(function() {

    module('Null module');

    test('null', function() {
        var obj;
        equal(obj, null, "uninitialized object is null");
    });

    test('undefined object property', function() {
        var obj = {};
        equal(obj.missing, undefined, "missing property is undefined.");
        var arr = [1, 2, 3];
        equal(arr[5], undefined, "missing array element is undefined.");
    });

    test('undefined array', function() {
        var arr = [1, 2, 3];
        equal(arr[5], undefined, "missing array element is undefined.");
    });

})();
