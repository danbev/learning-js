const AWS = require('aws-sdk');

const bucket = 'learning-js-bucket';
const key = 'something';

const s3 = new AWS.S3({});

const objectParams = {Bucket: bucket, Key: key, Body: 'testing'};
const uploadPromise = s3.putObject(objectParams).promise();
uploadPromise.then(
  function(data) {
    console.log(`Successfully uploaded data to ${bucket}/${key}`);
  }).catch(
  function(err) {
    console.error(err, err.stack);
});


