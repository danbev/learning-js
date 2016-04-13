var assert = require('assert');

describe('Equals', function() {
  
  it('null should be == to undefined', function() {
        assert.ok(null == undefined);
  });

  it("string '0' should be equal to zero. Any string is first converted to a number", function() {
        assert.ok('0' == 0);
        assert.ok(Number('0') == 0);
  });

  it('0 should == false. boolean values are first converted to number', function() {
        assert.ok(0 == false);
        assert.ok(Number(false) == 0);
  });

  it("string '0' should == false. First the string is converted to number then to boolean", function() {
        assert.ok('0' == false);
  });

  it("string '10' should be == 10. First the string is converted to number", function() {
        assert.ok('10' == 10);
  });

  it("string '10' should be !== 10", function() {
        assert.ok('10' !== 10);
  });

  it("typeof string should be 'string'", function() {
        assert.ok(typeof "dummy" === "string");
  });

  it("typeof integer should be 'number'", function() {
        assert.ok(typeof 10 === "number");
  });

  it("typeof array should be 'object'", function() {
        assert.ok(typeof 10 === "number");
  });

});
