'use strict';

/**
 * Module dependencies.
 */

const agent = require('supertest').agent;
const app = require('./mockApp');
const http = require('http');
const uuid = require('uuid');
const testUtils = require('./testUtils');
const co = require('co');
/**
 * Tests.
 */

describe('/login', function() {
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

  describe('POST /login', function() {
    var facebookId = uuid.v4();
    it('should login an existing account', function(done) {
      request
        .post('/login')
        .send({facebookId: facebookId})
        .expect(200, done);
    });
  });
});
