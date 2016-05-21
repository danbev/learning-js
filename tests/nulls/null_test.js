var assert = require('assert');

describe('Null and undefined', function() {

  it('an uninitialized object should be null', function() {
    var obj;
    assert.equal(obj, null);
  });

  it('a missing property should be undefined', function() {
    var obj = {};
    assert.equal(obj.missing, undefined);
  });

  it('undefined is !== null', function() {
    assert.ok(undefined !== null);
  });

  it('a missing array element should be undefined', function() {
    var arr = [1, 2, 3];
    assert.equal(arr[4], undefined);
  });

  it("typeof null should be 'object'", function() {
    // this is actually a bug in JavaScript according to the book "You Don't konw JS: Types and Grammar"
    assert.equal(typeof null, 'object');
  });

  it("typeof undefined should be 'undefined'", function() {
    assert.equal(typeof undefined, 'undefined');
  });

  it("void should make a value undefined", function() {
    var arr = [1, 2];
    assert.equal(void arr, undefined);
  });

});
