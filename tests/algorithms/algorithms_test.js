var assert = require('assert');
var algorithms = require('../../src/algorithms/algorithms');

describe('Algorthms module', function() {
  describe('binary-search', function() {
    var arr = [1, 2, 3, 4, 5];
    it('should be able to fine 1', function() {
      assert.equal(algorithms.binarySearch(arr, 1), 0, "BinarySearch for 1 should have index 0");
    });
    it('should be able to find 2', function() {
      assert.equal(algorithms.binarySearch(arr, 2), 1, "BinarySearch for 2 should have index 1");
    });
    it('should be able to find 3', function() {
      assert.equal(algorithms.binarySearch(arr, 3), 2, "BinarySearch for 3 should have index 2");
    });
    it('should be able to find 4', function() {
      assert.equal(algorithms.binarySearch(arr, 4), 3, "BinarySearch for 4 should have index 3");
    });
    it('should be able to find 4', function() {
      assert.equal(algorithms.binarySearch(arr, 5), 4, "BinarySearch for 5 should have index 4");
    });
    it('should be not be able to find 6', function() {
      assert.equal(algorithms.binarySearch(arr, 6), -6, "BinarySearch for 6 should have index -6");
    });
    it('should be not be able to find 7', function() {
      assert.equal(algorithms.binarySearch(arr, 7), -6, "BinarySearch for 7 should have index -6");
    });
  });

  describe('insertion-sort', function() {
    it('should sort the array', function() {
      var sorted = algorithms.insertionSort([5, 1, 2, 3, 4]);
      assert.deepEqual(sorted, [1, 2, 3, 4, 5], "The array should have been sorted using insertion-sort.");
    });
  });

  describe('selection-sort', function() {
    it('should sort the array', function() {
      var sorted = algorithms.selectionSort([5, 1, 2, 3, 4]);
      assert.deepEqual(sorted, [1, 2, 3, 4, 5], "The array should have been sorted using insertion-sort.");
    });
  });

});
