const getResponseByContentType = require('./get-response-by-content-type');

it('should stringify reseponse when text content type', () => {
  expect(getResponseByContentType('test', 'text/plain')).toBe('test');
  expect(getResponseByContentType(12, 'text/plain')).toBe('12');
});

it('should JSON parse response when json content type', () => {
  expect(getResponseByContentType('{"a":1}', 'application/json')).toEqual({ a: 1 });
});

it('should fail to JSON parse response when json content type but not valid JSON', () => {
  expect(getResponseByContentType('notvalid', 'application/json')).toEqual(null);
});

it('should return null when there is not recognisible contentn type', () => {
  expect(getResponseByContentType('{"a":1}', 'application/sadsadas')).toEqual(null);
  expect(getResponseByContentType('{"a":1}')).toEqual(null);
});