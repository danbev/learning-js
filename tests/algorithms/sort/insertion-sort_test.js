var assert = require('assert');
var insertionSort = require('../../../src/algorithms/sort/insertion-sort.js');

describe('Algorthms sort module', function() {
  describe('insertion-sort', function() {
    it('should sort the array', function() {
      var sorted = insertionSort.sort([5, 1, 2, 3, 4]);
      assert.deepEqual(sorted, [1, 2, 3, 4, 5], "The array should have been sorted using insertion-sort.");
    });
  });
});
