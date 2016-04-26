module.exports.sort = function(arr) {
  var n = arr.length, i, j, min;
  for (i = 0; i < n; i++) {
    min = i;
    for (j = i; j < n; j++) {
      if (arr[j] < arr[min]) {
        min = j;
      }
    }
    var tmp = arr[i];
    arr[i] = arr[min];
    arr[min] = tmp;
  }
  return arr;
};

