module.exports.binarySearch = function(arr, key) {
  var low = 0;
  var high = arr.length;
  while (low < high) {
    var mid = Math.floor(low + (high - low) / 2);
    if (key < arr[mid]) {
      high = mid;
    } else if (key > arr[mid]) {
      low = mid + 1;
    } else {
      return mid;
    }
  }
  return -(low + 1);
};

module.exports.insertionSort = function(arr) {
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

module.exports.selectionSort = function(arr) {
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

