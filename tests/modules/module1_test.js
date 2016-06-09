var assert = require('assert');
var module1 = require('../../src/modules/module1.js');

describe('Module tests', function() {

  it('module exports vs module.export', function() {
    assert.ok(module1 instanceof Object);
    assert.ok(module1.first instanceof Function);
    assert.equal("first", module1.first());
  });

});
