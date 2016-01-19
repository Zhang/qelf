'use strict';

const bunyan = require('bunyan');
const config = require('./config');
const errFilePath = __dirname + '/../logs.log';
const fs = require('fs');

if (config.isProd) {
  try {
    fs.statSync(errFilePath);
  } catch(e) {
    //Doesnt exist, create file
    if (e.code === 'ENOENT') {
      fs.openSync(errFilePath, 'w+');
    }
  }
}

const streams = [
  {
    level: 'info',
    stream: process.stdout // log INFO and above to stdout
  }
];

if (config.isProd) {
  streams.push({
    path: errFilePath,
    level: 'error'
  });
}

module.exports = bunyan.createLogger({
  name: 'qelf',
  streams: streams
});
