(function() {
    // warpped in a function to avoid global variable popultion.
    module('Core module', {
        setup: function() {
            //set up
        },
        teardown: function() {
            //set up
        }
    });

    test('increment', function() {
        var i = 1;
        equal(i++, 1, 'i++ is 1. The returned value is the value before the inc');
        equal(i, 2, 'i is now 2.');
        equal(++i, 3, '++i is 3. The returned value is the incemented value');
    });

    test('typeof', function() {
        equal(typeof null, "object", 'typeof null is "object"');
        equal(typeof undefined, "undefined", 'undefined null is "undefined"');
        equal(typeof true, "boolean", 'booleans are "boolean"');
        equal(typeof function() {}, "function", 'functions are "function"');
        equal(typeof 1, "number", 'typeof int is "number"');
    });

    test('delete', function() {
        var s = { x: 1, y: 2};
        equal(delete s.x, true, 'a property can be deleted');
        equal(delete s, false, 'a var cannot be deleted');
        var a = [1, 2, 3];
        equal(delete a[2], true, 'an array element can be deleted');
        equal(a.length, 3, 'the length of the array is not changed after a delete.');
    });

    test('create core instance test', function() {
        var core = Sync.Core();
        var result = core.something("dummy");
        strictEqual(result, "dummy", "Expected result to be 'dummy'");
    });
})();
