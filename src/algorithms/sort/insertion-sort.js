module.exports.sort = function(arr) {
  var n = arr.length, i, j;
  for (i = 1; i < n; i++) {
    for (j = i; j > 0 && arr[j] < arr[j-1]; j--) {
      var tmp = arr[j-1];
      arr[j-1] = arr[j];
      arr[j] = tmp;
    }
  }
  return arr;
};
