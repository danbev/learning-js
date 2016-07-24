// Requires support for Proxy so use bulid of nodejs:
// $ ~/work/nodejs/node/out/Debug/node basic.js
var target = {};

// create a pass-through proxy since the handler does nothing.
// var handler = {};
var handler = {
  get(target, key) {
    console.log(`Getting property ${key}`);
    return target[key];
  }
};

var proxy = new Proxy(target, handler);
proxy.a = 'b';
console.log("target.a = ", proxy.a);

// you add traps to intercept interations with the target

