'use strict';

var test = require('tape');
var basic = require('../../src/promises/basic');

test('[Promises] successful resolution', function (t) {
  var promise = basic.doit("success");
  promise.then(function (message) {
    t.equals('resolved', message);
    t.end();
  });
});

/*
  it('basic rejection', function() {
    var promise = basic.doit("fail");
    return promise.then(function (message) {
      assert.equal("should not get here", message);
    }, function(message) {
      assert.equal(message, "rejected");
    });
  });

});
*/
