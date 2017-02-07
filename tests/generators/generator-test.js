'use strict';

var test = require('tape');
var gen = require('../../src/generators/generator.js');

test('[generators] test', function (t) {
  console.log(gen);
  let iter = gen();
  var n = iter.next().value;
  t.equals(n, 0);
  n = iter.next(3).value;
  t.equals(n, 4);
  t.end();
});
