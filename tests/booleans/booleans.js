(function() {

    module('Booleans module');

    test('falsy', function() {
        equal(Boolean(null), false, "null is falsy");
        equal(Boolean(undefined), false, "undefined is falsy");
        equal(Boolean(0), false, "0 is falsy");
        equal(Boolean(-0), false, "-0 is falsy");
        equal(Boolean(NaN), false, "NaN is falsy");
        equal(Boolean(''), false, "empty string is falsy");
    });

    test('truthy', function() {
        equal(Boolean({}), true, "objects are always truthey");
        equal(Boolean(1), true, "non zero number is truthey");
        equal(Boolean(-1), true, "-1 number is truthey");
        equal(Boolean("bajja"), true, "non empty string is always truthy");
    });

    test("equals vs strict equals in if statements", function() {
        var obj = null;
        if (obj === null) {
            ok(true, "=== checking for null.")
        }
        if (!obj) {
            ok(true, "== checking for null.")
        }
        obj = undefined;
        if (!obj) {
            ok(true, "== also matches any undefined")
        }
        obj = 0;
        if (!obj) {
            ok(true, "== also matches any undefined")
        }
    });

})();
