var assert = require('assert');
var selectionSort = require('../../../src/algorithms/sort/selection-sort.js');

describe('Algorthms sort module', function() {
  describe('selection-sort', function() {
    it('should sort the array', function() {
      var sorted = selectionSort.sort([5, 1, 2, 3, 4]);
      assert.deepEqual(sorted, [1, 2, 3, 4, 5], "The array should have been sorted using insertion-sort.");
    });
  });

});
