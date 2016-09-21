'use strict';
var http = require('http');
var https = require('https');
var fs = require('fs');
const parseArgList = require('./parse-arg-list');
const getResponseByContentType = require('./get-response-by-content-type');

function parseContent(content) {
  return new Buffer(content.toString());
}

function f(name, mode, config) {

  mode = mode || 'json';
  config = config || f.config;

  return function external() {

    var argList = [].slice.call(arguments);
    var callback = function() {};
    var payload;
    var headers;
    var req;

    if (typeof argList[argList.length - 1] === 'function') {
      callback = argList.pop();
    }

    if (mode === 'json') {
      headers = {'Content-Type': 'application/json'};
      payload = parseArgList(argList);
    } else if (mode === 'command') {
      headers = {'Content-Type': 'application/command'};
      payload = parseContent(argList[0]);
    } else if (mode === 'file') {
      if (!(argList[0] instanceof Buffer)) {
        return callback(new Error('Expecting Buffer for function mode: ' + mode));
      }
      headers = {'Content-Type': 'application/octet-stream'};
      payload = argList[0];
    } else {
      return callback(new Error('Invalid function mode: ' + mode));
    }

    req = [http, https][(config.gateway.port === 443) | 0].request({
      host: config.gateway.host,
      method: 'POST',
      headers: headers,
      port: config.gateway.port,
      path: config.gateway.path + name
    }, function (res) {

      var buffers = [];
      res.on('data', buffers.push);
      res.on('end', () => {
        let response = Buffer.concat(buffers);
        response = getResponseByContentType(response, res.headers['content-type']);
        if (((res.statusCode / 100) || 0) !== 2) {
          return callback(new Error(response));
        }
        return callback(null, response);
      });

    });

    req.on('error', callback);
    req.write(payload);
    req.end();

  };

};

f.config = {
  gateway: {
    host: 'f.stdlib.com',
    port: 443,
    path: '/'
  }
};

module.exports = f;
