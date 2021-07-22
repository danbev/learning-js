const acorn = require('acorn');

console.log(acorn.parse("const s = 'bajja';", {ecmaVersion: 2020}));
