'use strict';

const isTest = process.env.NODE_ENV === 'test';
const isProd = process.env.NODE_ENV === 'prod';
const mongoURI = (function getMongoURI() {
  if (isProd) return 'mongodb://admin:internal1@ds045785.mongolab.com:45785/qelf';
  if (isTest) return 'localhost/qelf_test';
  return 'localhost/qelf';
})();

module.exports = {
  isTest: isTest,
  isProd: isProd,
  mongoURI: mongoURI,
  mongoVersion: '3.x.x',
  facebookClientId: '201708533509741',
  facebookClientSecret: '2815fd63ddaf3161387ec1ef760b66a7'
};
