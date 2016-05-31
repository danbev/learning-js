var assert = require('assert');
var t = require('../../src/this/this.js');

describe('Binding this tests', function() {

  it('should be bound explicitely using call', function() {
    var obj = { var: 'testing'};
    assert.equal(t.explicitCall(obj, 'Fletch'), "testing, Fletch");
  });

  it('should be bound explicitely using bind', function() {
    var obj = { var: 'testing'};
    assert.equal(t.bind(obj, 'Fletch'), "testing, Fletch");
  });

});
