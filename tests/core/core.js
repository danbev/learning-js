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

    test('create core instance test', function() {
        var core = Sync.Core();
        var result = core.something("dummy");
        strictEqual(result, "dummy", "Expected result to be 'dummy'");
    });
})();
