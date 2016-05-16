module.exports.doit = function(fun) {
  return function(array) {
    return fun.apply(null, array);
  };
};

