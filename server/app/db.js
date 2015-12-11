'use strict';

const monk = require('monk');
const semver = require('semver');
const util = require('util');
const q = require('q');

function* validateMongoVersion(db) {
  const EXPECTED_MONGO_VERSION = '3.0.x';

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
  const db = monk('localhost/sheen', {
    w: 1,
    j: true,
    native_parser: true,
    poolSize: 25
  });

  validateMongoVersion(db.driver);
  return db;
})();
