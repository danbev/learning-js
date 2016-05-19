var Promise = require('promise');

module.exports.doit = function(message) {
  return new Promise(function(resolve, reject) {
    if (message === "success") {
      resolve("resolved");
    } else {
      reject("rejected");
    }
  });
};

