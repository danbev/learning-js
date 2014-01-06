(function() {

    module('Strings module');

    test('empty string has zero length', function() {
        equal("".length, 0, "empty string has zero length");
    });

    test('string immutability', function() {
        var s = "str";
        var s2 = s.replace('s', 'x');
        equal(s, "str", 'charAt produces a new string and does not change a string.');
        equal(s2, "xtr", 'charAt produces a new string and does not change a string.');
    });

    test('strings and the + operator', function() {
        // if either operand (operand + operand) is a string or an object that can be converted to string and concatination is done.
        // Addition is performed only if neither is string-like.
        equal(1 + "2", "12", '1 + "2" is "12"');
        equal(1 + 2 + "2", "32", '1 + 2 + "2" is 32');
        equal("1" + 2 + 2, "122", '"1" + 2 + 2 is 122');
        equal("1" + {}, "1[object Object]", '"1" + {}  is 1[object Object]');
        equal(true + true, 2, 'true + true is 2. Boolean is converted to Number(true) which is 1');
        equal(2 + null, 2, '2 + null is 2. null converts to 0 (Number(null)');
        notEqual(2 + undefined, NaN, '2 + null is 2. null converts to 0 (Number(null)');
    });

})();
