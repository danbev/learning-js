(function() {

    module('Equals module');

    test('null and undefined', function() {
        equal(null, undefined, "null is equal to undefined");
        equal(undefined, null, "undefined is equal to null");
    });

    test('"0" == 0', function() {
        equal('0', 0, "string '0' is equal to zero. Any string is first converted to a number.");
        equal(Number('0'), 0, "Number('0') is 0");
    });

    test('0 == false', function() {
        equal(0, false, "zero is equal to false. boolean values are first converted to number.");
        equal(Number(false), 0, "Number(false) is zero");
    });

    test('"0" == false', function() {
        equal('0', false, "string '0' is equal to false. First the string is converted to number. Next the boolean is converted.");
        equal(Number(false), 0, "Number(false) is zero");
        equal(Number('0'), 0, "Number('0') is zero");
    });

    test('equal but different types', function() {
        equal('10', 10, "string '10' is equal to number 10. First the string is converted to number.");
        notStrictEqual('10', 10, "string '10' is not strictly equal to number 10");
    });

    test('object equality', function() {
        var o1 = { a: "dummy"};
        var o2 = { a: "dummy"}
        notEqual(o1 ,o2, "Two objects with same properties are not equal.");
        equal(o1.a ,o2.a, "But the properties are equal.");
    });

    test('typeof equals test', function() {
        ok(typeof "dummy" === "string", "typeof string is 'string'");
        ok(typeof 10 === "number", "typeof integer is 'number'");
        ok(typeof [] === "object", "typeof array is 'object'");
    });
})();
