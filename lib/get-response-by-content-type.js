module.exports = function getResponseByContentType(response, contentType = '') {
  for (const parser of parsers) {
    if (contentType.match(parser.regex)) {
      return parser.parse(response);
    }
  }
  return null;
}

const parsers = [
  {
    regex: /application\/json/,
    parse: (response) => {
      try {
        return JSON.parse(response.toString());
      } catch (e) {
        return null;
      }
    },
  }, {
    regex: /^text\/.*$/i,
    parse: response => response.toString(),
  },
];
