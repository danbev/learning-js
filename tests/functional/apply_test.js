var assert = require('assert');
var apply = require('../../src/functional/apply');

describe('Apply', function() {

  it('applying a function', function() {
    var doit = apply.doit(function(x, y) { return x + y; });
    assert.equal(3, doit([1, 2]));
  });

});
