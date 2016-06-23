const domain = require('domain');

const testDomain = domain.create();
testDomain.run(() => {
  console.log("in domain...");
});
