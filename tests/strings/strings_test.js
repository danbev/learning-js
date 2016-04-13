var assert = require('assert');

describe('Strings', function() {

  it('empty string should have zero length', function() {
    assert.equal("".length, 0);
  });

  it('a string should be immutable', function() {
    var s = "str";
    var s2 = s.replace('s', 'x');
    assert.equal(s, "str");
    assert.equal(s2, "xtr");
  });

  // if either operand (operand + operand) is a string or an object that 
  // can be converted to string concatination is done.
  describe('+ operator', function() {
    it("1 + '2' should be '12'", function() {
      assert.equal(1 + '2', '12');
    });
    it("1 + 2 + '2' should be '32'", function() {
      assert.equal(1 + 2 + '2', '32');
    });
    it("'1' + 2 + 2 should be '122'", function() {
      assert.equal('1' + 2 + 2, '122');
    });
    it("'1' + {} should be '1[object Object]'", function() {
      assert.equal('1' + {}, '1[object Object]');
    });
    it('true + true should be 2. Boolean is converted to Number(true) which i 1', function() {
      assert.equal(true + true, 2);
    });
    it('2 + null should be 2. null converts to 0 (Number(null))', function() {
      assert.equal(2 + null, 2);
    });
    it('2 + undefined should be NaN. undefined converts to NaN (Number(undefined))', function() {
      assert.equal(2 + null, 2);
    });

  });

});
