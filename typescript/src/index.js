"use strict";
exports.__esModule = true;
function name(user) {
    if (user === void 0) { user = { name: 'Fletch', age: 46 }; }
    return "Hello " + user.name + "! ";
}
exports.name = name;
var danbev = {
    name: "Daniel",
    age: 46
};
console.log(name());
console.log(name(danbev));
