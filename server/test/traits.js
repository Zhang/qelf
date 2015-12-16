'use strict';

/**
 * Module dependencies.
 */

const agent = require('supertest').agent;
const app = require('./mockApp');
const http = require('http');
const uuid = require('uuid');
const _ = require('lodash');
const expect = require('expect.js');
const co = require('co');
const testUtils = require('./testUtils');
/**
 * Tests.
 */

describe('/trait', function() {
  let request;
  let MOCK_USER;

  beforeEach(function() {
    request = agent(http.createServer(app.callback()));
  });
  beforeEach(function(done) {
    co(function* () {
      yield testUtils.clearUsers();
      MOCK_USER = yield testUtils.createTestUser();
      done();
    });
  });

  describe('GET /query', function() {
    it('should get traits by user', function(done) {
      request
        .get('/trait/query/' + MOCK_USER.facebookId)
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          var traits = res.body;
          expect(_.map(traits, 'id')[0]).to.be(MOCK_USER.traits[0]);
          expect(traits).to.have.length(MOCK_USER.traits.length);
          done();
        });
    });
  });
});
