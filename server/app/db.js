'use strict';

const monk = require('monk');
const semver = require('semver');
const q = require('q');
const config = require('./config');
const log = require('./logger');

function validateMongoVersion(db) {
  function promisifiedBuildInfo() {
    const deferred = q.defer();
    db.admin().buildInfo(
      function(err, res) {
        if (err) return deferred.reject(err);
        deferred.resolve(res);
      },
      function(err) {
        log.error('error checking mongo version', err);
        deferred.reject(err);
      }
    );
    return deferred.promise;
  }

  promisifiedBuildInfo().then(function(res) {
    const version = res.version;
    if (!semver.satisfies(version, config.mongoVersion)) {
      log.error('WRONG MONGO VERSION: ' + version + ' - VERSION ' + config.mongoVersion + ' REQUIRE MONGO VERSION ');
      process.exit(1);
    } else {
      return null;
    }
  });
}

module.exports = (function() {
  const db = monk(config.mongoURI, {
    w: 1,
    j: true,
    native_parser: true,
    poolSize: 25
  });

  validateMongoVersion(db.driver);

  if (config.isTest) {
    process.on('exit', function() {
      db.driver.dropDatabase(config.mongoURI, function(err) {
        if (err) return log.error(err);
      });
    });
  }

  return db;
})();
