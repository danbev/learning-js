module.exports = function* gen() {
  console.log("generator");
  var n = 0;
  // pass the value of n as the value of next.value
  // the value of v will be the value passed in the next call to it.next(4)
  var v = yield n++;  
  return n + v;
};
