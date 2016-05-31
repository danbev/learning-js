var assert = require('assert');

describe('Algorthms datastructures arrays', function() {
  describe('creating', function() {
    it('create with elements should give proper length', function() {
      var arr = [1, 2, 3, 4, 5];
      assert.equal(arr.length, 5, "length should be 5");
      assert.equal(Array.isArray(arr), true);
    });
    it('create new Array with one property should set length', function() {
      var arr = new Array(10);
      assert.equal(arr.length, 10);
    });
    it('create array from string', function() {
      var arr = "one two three".split(" ");
      assert.equal(arr.length, 3);
    });
    it('create a copy using splice ', function() {
      var arr = [1, 2, 3];
      var copy = arr.slice()
      assert.notStrictEqual(arr, copy);
    });
  });
  describe('searching', function() {
    it('indexOf', function() {
      var arr = [1, 2, 3, 4, 5];
      assert.equal(arr.indexOf(1), 0);
      assert.equal(arr.indexOf(10), -1);
    });
  });
  describe('string representations', function() {
    it('toString', function() {
      var arr = [1, 2, 3, 4, 5];
      assert.equal(arr.toString(), '1,2,3,4,5');
    });
    it('join', function() {
      var one = [1, 2, 3];
      assert.equal(one.join(), '1,2,3');
    });
  });
  describe('new array from existing', function() {
    it('concat', function() {
      var one = [1, 2, 3];
      var two = [1, 2, 3];
      assert.equal(one.concat(two).length, 6);
    });
    it('splice', function() {
      var one = [1, 2, 3];
      var two = one.splice(1,2)
      assert.equal(two[0], 2);
      assert.equal(two[1], 3);
    });
  });
  describe('mutator functions', function() {
    it('push should add to the end of the array', function() {
      var one = [1, 2, 3];
      one.push(4);
      assert.equal(one[3], 4);
      // is bascially the same as using:
      one[one.length] = 5;
      assert.equal(one[4], 5);
    });
    it('pop should remove the end of the array', function() {
      var one = [1, 2, 3];
      one.pop();
      assert.equal(one.length, 2);
      assert.equal(one[1], 2);
    });
    it('unshift should add to the head of the array', function() {
      var one = [1, 2, 3];
      one.unshift(0);
      one.unshift(-1);
      assert.equal(one[0], -1);
      assert.equal(one[1], 0);
    });
    it('shift should remove from the head of the array', function() {
      var one = [1, 2, 3];
      one.shift();
      assert.equal(one[0], 2);
      assert.equal(one[1], 3);
    });
    it('splice should be able to add to the middle of an array', function() {
      var arr = [1, 2, 3, 6, 7];
      arr.splice(3, 0, 4, 5);
      assert.equal(arr.length, 7);
      assert.equal(arr[3], 4);
      assert.equal(arr[4], 5);
    });
  });

});
