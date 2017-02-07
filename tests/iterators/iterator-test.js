'use strict';

var test = require('tape');
var it = require('../../src/iterators/iterator.js');

test('[iterators] custom', function (t) {
  let iterator = it[Symbol.iterator]();
  var next = iterator.next();
  t.equal(next.value, 0, 'first should be 0');
  t.equal(next.done, false, 'done should be false');
  next = iterator.next();
  t.equal(next.value, 1, 'second should be 1');
  t.equal(next.done, false, 'done should be false');

  var ret = iterator.return(10); // break; in a loop will also call return
  t.equal(ret.value, 10, 'return value passed should be 10');
  t.equal(ret.done, true, 'done should be true');

  // would not be possible to resuse the same iterator like this
  // unless there was a [Symbol.iterator]() on the returned 
  // iterator instance. This could be used in multiple for of 
  // loops.
  iterator = iterator[Symbol.iterator]();
  var next = iterator.next();
  t.equal(next.value, 0, 'first should be 0');
  t.equal(next.done, false, 'done should be false');
  t.end();
});

test('[iterators] destructuring', function (t) {
  let iterator = it[Symbol.iterator]();
  var [x, y] = iterator;
  t.equal(x, 0, 'x should be 0');
  t.equal(y, 1, 'y should be 1');
  t.end();
});
