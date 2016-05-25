var assert = require('assert');
var iife = require('../../src/scope/iife');

describe('Immediate Invoked Function Expression', function() {

  it('should create a separate scope', function() {
    assert.equal(iife.hello("Fletch"), "hello Fletch");
  });

  it('parentheses can be before or after the function definition', function() {
    assert.equal(iife.goodby("Fletch"), "goodby Fletch");
  });

});
