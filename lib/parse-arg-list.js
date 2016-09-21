module.exports = function parseArgList(argList) {
  let kwargs = {};
  if (typeof argList[argList.length - 1] === 'object' && argList[argList.length - 1] !== 'null') {
    kwargs = argList.pop();
  }
  const args = argList.slice();
  return new Buffer(
    JSON.stringify({
      args,
      kwargs,
    })
  );
};
