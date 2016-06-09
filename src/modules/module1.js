
/**
 * When a module's code is executed it gets wrapped in
 * (function (exports, require, module, __filename, __dirname) { 
 *  exports.first = () => "first";
 * });
 *  
 *  In module.js and it's Module._load function the last line returns:
 *  return module.exports;
 */
exports.first = () => "first";
console.log(module.exports);
