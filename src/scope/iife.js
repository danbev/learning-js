//Immediate Invoked Function Expression
exports.hello = function(str) {
  var greeting = (function greet(str) {
    var greeting = "hello ";
    return greeting + str;
  })(str);
  return greeting;
};

exports.goodby = function(str) {
  var bye = (function greet(str) {
    var bye = "goodby ";
    return bye + str;
  }(str));
  return bye;
};
