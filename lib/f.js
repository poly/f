const http = require('http');
const https = require('https');
const parseArgList = require('./parse-arg-list');
const getResponseByContentType = require('./get-response-by-content-type');

function parseContent(content) {
  return new Buffer(content.toString());
}

function f(name, mode = 'json', config = f.config) {
  return function external(...argList) {
    let callback = function callback() {};
    let payload;
    let headers;

    if (typeof argList[argList.length - 1] === 'function') {
      callback = argList.pop();
    }

    if (mode === 'json') {
      headers = { 'Content-Type': 'application/json' };
      payload = parseArgList(argList);
    } else if (mode === 'command') {
      headers = { 'Content-Type': 'application/command' };
      payload = parseContent(argList[0]);
    } else if (mode === 'file') {
      if (!(argList[0] instanceof Buffer)) {
        return callback(new Error(`Expecting Buffer for function mode: ${mode}`));
      }
      headers = { 'Content-Type': 'application/octet-stream' };
      payload = argList[0];
    } else {
      return callback(new Error(`Invalid function mode: ${mode}`));
    }

    const req = [http, https][(config.gateway.port === 443) || 0].request({
      host: config.gateway.host,
      method: 'POST',
      headers,
      port: config.gateway.port,
      path: config.gateway.path + name,
    }, (res) => {
      const buffers = [];
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
    return true;
  };
}

f.config = {
  gateway: {
    host: 'f.stdlib.com',
    port: 443,
    path: '/',
  },
};

module.exports = f;
