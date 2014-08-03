(function() {

    module('Algorithms module');

    test('binary-search', function() {
        var arr = [1, 2, 3, 4, 5];
        equal(Algorithms.binarySearch(arr, 1), 0, "BinarySearch for 1 should have index 0");
        equal(Algorithms.binarySearch(arr, 2), 1, "BinarySearch for 2 should have index 1");
        equal(Algorithms.binarySearch(arr, 3), 2, "BinarySearch for 3 should have index 2");
        equal(Algorithms.binarySearch(arr, 4), 3, "BinarySearch for 4 should have index 3");
        equal(Algorithms.binarySearch(arr, 5), 4, "BinarySearch for 5 should have index 4");
        equal(Algorithms.binarySearch(arr, 6), -6, "BinarySearch for 6 should have index -6");
        equal(Algorithms.binarySearch(arr, 7), -6, "BinarySearch for 7 should have index -6");
    });

    test('insertion-sort', function() {
        var sorted = Algorithms.insertionSort([5, 1, 2, 3, 4]);
        deepEqual(sorted, [1, 2, 3, 4, 5], "The array should have been sorted using insertion-sort.");
    });

    test('selection-sort', function() {
        var sorted = Algorithms.selectionSort([5, 1, 2, 3, 4]);
        deepEqual(sorted, [1, 2, 3, 4, 5], "The array should have been sorted using selection-sort.");
    });

})();
