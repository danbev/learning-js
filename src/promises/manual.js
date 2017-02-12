
let promise = new Promise(function(resolve, reject) {
  if (true) {
    resolve("resolved");
  } else {
    reject("rejected");
  }
});

promise.then(function (message) {
  console.log(message);
});

