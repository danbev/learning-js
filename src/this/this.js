
exports.explicitCall = function(obj, str) {
  return doit.call(obj, str);
};

exports.bind = function(obj, str) {
  // note that bind returns a new function
  var bound = doit.bind(obj);
  return bound(str);
};

function doit(str) {
  return this.var + ', ' + str;
}
