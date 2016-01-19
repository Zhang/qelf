'use strict';

/**
 * Module dependencies.
 */

const db = require('../app/db');
const config = require('../app/config');
const expect = require('expect.js');

describe('test harness', function() {
  before(function(cb) {
    db.driver.dropDatabase(config.mongoURI, function() {
      cb();
    });
  });
  it('Should have a clean db', function(cb) {
    db.driver._native.command({ 'listCollections': 1 }, function(err,result) {
      const collections = result.cursor.firstBatch.map(function(el) {
        console.log(el.name);
        return el.name;
      });
      try {
        expect(collections).to.have.length(0);
        cb();
      } catch(e) {
        cb(e);
      }
    });
  });
});
