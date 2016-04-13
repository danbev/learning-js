var assert = require('assert');

describe('Boolean construction', function() {

  describe('falsy', function() {
    it('null should be falsy', function() {
        assert.equal(Boolean(null), false);
    });
    it('undefined should be falsy', function() {
        assert.equal(Boolean(undefined), false);
    });
    it('0 should be falsy', function() {
        assert.equal(Boolean(0), false);
    });
    it('-0 should be falsy', function() {
        assert.equal(Boolean(-0), false);
    });
    it('NaN should be falsy', function() {
        assert.equal(Boolean(-0), false);
    });
    it('empty string should be falsy', function() {
        assert.equal(Boolean(''), false);
    });
  });

  describe('truthy', function() {
    it('Boolean({}) should be truthy', function() {
        assert.equal(Boolean({}), true);
    });
    it('1 should be truthy', function() {
        assert.equal(Boolean(1), true);
    });
    it('-1 should be truthy', function() {
        assert.equal(Boolean(-11), true);
    });
    it('non empty string should be truthy', function() {
        assert.equal(Boolean(-11), true);
        assert.equal(Boolean("bajja"), true);
    });
  });

});
