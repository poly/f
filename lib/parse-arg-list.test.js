const parseArgList = require('./parse-arg-list');

it('can parse args when no kwargs', () => {
  expect(parseArgList([1, 2, 3])).toEqual(new Buffer(JSON.stringify({args:[1, 2, 3], kwargs:{}})));
});

it('can parse kwargs when no args', () => {
  expect(parseArgList([{a: 1}])).toEqual(new Buffer(JSON.stringify({args:[], kwargs: {a: 1}})));
});

it('can parse args and kwargs', () => {
  expect(parseArgList([1, 2, 3, {a: 1}])).toEqual(new Buffer(JSON.stringify({args:[1, 2, 3], kwargs: {a: 1}})));
});

it('can handle falsy values', () => {
  expect(parseArgList([null, false, undefined, {a: 1}])).toEqual(new Buffer(JSON.stringify({args:[null, false, undefined], kwargs: {a: 1}})));
});

it('can handle nestes kwargs', () => {
  expect(parseArgList([1, 2, 3, {a: {a: 1}}])).toEqual(new Buffer(JSON.stringify({args:[1, 2, 3], kwargs: {a: {a: 1}}})));
});

it('can handle object args', () => {
  expect(parseArgList([1, 2, {b:1}, {a: {a: 1}}])).toEqual(new Buffer(JSON.stringify({args:[1, 2, {b:1}], kwargs: {a: {a: 1}}})));
});

it('can handle arrays args', () => {
  expect(parseArgList([1, 2, [3, 4], {a: {a: 1}}])).toEqual(new Buffer(JSON.stringify({args:[1, 2, [3, 4]], kwargs: {a: {a: 1}}})));
});