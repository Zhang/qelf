'use strict';

const monk = require('monk');
const semver = require('semver');
const util = require('util');
const q = require('q');
const uuid = require('uuid');

function* validateMongoVersion(db) {
  const EXPECTED_MONGO_VERSION = '3.x.x';

  function promisifiedBuildInfo() {
    const deferred = q.defer();
    db.admin().buildInfo(function(err, res) {
      if (err) return deferred.reject(err);
      deferred.resolve(res);
    });
    return deferred;
  }

  const buildInfo = yield promisifiedBuildInfo();
  const version = buildInfo.version;
  if (!semver.satisfies(version, EXPECTED_MONGO_VERSION)) {
        throw new Error(util.format(
          'Mongo version is %s, but Votally requires version %s. Exiting...',
          version, EXPECTED_MONGO_VERSION
        ));
  } else {
    return null;
  }
}

module.exports = (function() {
  const isTest = process.env.NODE_ENV === 'test';

  var mongoUri = (function() {
    return isTest ? 'localhost/sheen_test_' + uuid.v4() : (process.env.APP_HOST || 'localhost') + '/sheen';
  })();

  const db = monk(mongoUri, {
    w: 1,
    j: true,
    native_parser: true,
    poolSize: 25
  });
  validateMongoVersion(db.driver);

  if (isTest) {
    process.on('exit', function() {
      db.driver.dropDatabase(mongoUri, function(err) {
        if (err) return console.log(err);
      });
    });
  }

  return db;
})();
