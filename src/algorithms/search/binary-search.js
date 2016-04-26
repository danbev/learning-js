module.exports.search = function(arr, key) {
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
