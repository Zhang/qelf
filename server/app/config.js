'use strict';

const uuid = require('uuid');

const isTest = process.env.NODE_ENV === 'test';
const mongoURI = isTest ? 'localhost/qelf_test_' + uuid.v4() : (process.env.APP_HOST || 'localhost') + '/qelf';

module.exports = {
  isTest: isTest,
  mongoURI: mongoURI,
  mongoVersion: '3.0.x'
};
