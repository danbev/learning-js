var assert = require('assert');
var basic = require('../../src/promises/basic');

describe('Promises', function() {

  it('basic successful resolution', function() {
    var promise = basic.doit("success");
    return promise.then(function (message) {
      assert.equal("resolved", message);
    });
  });

  it('basic rejection', function() {
    var promise = basic.doit("fail");
    return promise.then(function (message) {
      assert.equal("should not get here", message);
    }, function(message) {
      assert.equal(message, "rejected");
    });
  });

});
