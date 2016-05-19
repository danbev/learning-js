var assert = require('assert');
var basic = require('../../src/promises/basic');

describe('Promises', function() {

  it('basic successful resolution', function() {
    var promise = basic.doit("success");
    promise.then(function (message) {
      assert.equal("success", message);
    });
  });

  it('basic rejection', function() {
    var promise = basic.doit("success");
    promise.then(function (message) {
      assert.equal("should not get here", message);
    }, function(message) {
      assert.equal("rejected", message);
    });
  });

});
