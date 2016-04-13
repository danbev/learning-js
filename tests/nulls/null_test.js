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

  it('a missing array element should be undefined', function() {
    var arr = [1, 2, 3];
    assert.equal(arr[4], undefined);
  });

});
