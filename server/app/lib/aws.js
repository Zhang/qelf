'use strict';

const AWS = require('aws-sdk');

const AWS_CONFIG = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
};

AWS.config.update(AWS_CONFIG);
const s3 = new AWS.S3();

/**
 * Upload a photo to S3.
 *
 * @param {stream.Readable} contents
 * @param {string} key to save file as
 * @return {Promise}
 */
const upload = function upload(contents, key) {
  const params = {
    Body: contents,
    Bucket: process.env.AWS_BUCKET,
    Key: key
  };

  return new Promise(function(resolve, reject) {
    s3.upload(params, function(err, data) {
      if (err) return reject(err);
      resolve(data);
    });
  });
};

module.exports = {
  upload: upload
};
