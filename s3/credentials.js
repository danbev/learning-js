const AWS = require("aws-sdk");

// Will read from ~/.aws/credentials
AWS.config.getCredentials(function(err) {
  if (err) {
    console.log(err.stack);
    return;
  }
  console.log("Access key:", AWS.config.credentials.accessKeyId);
  console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
});
