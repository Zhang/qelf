'use strict';

/**
 * Module dependencies.
 */

const agent = require('supertest').agent;
const app = require('../app');
const http = require('http');
const uuid = require('uuid');
const expect = require('expect.js');
/**
 * Tests.
 */

describe('/login', function() {
  let request;

  beforeEach(function() {
    request = agent(http.createServer(app.callback()));
  });

  describe('POST /login', function() {
    var facebookId = uuid.v4();
    it('should login an existing account', function(done) {
      request
        .post('/account')
        .send({ facebookId: facebookId })
        .expect(200)
        .end(function(err) {
          if (err) throw err;
          request
            .post('/login')
            .send({facebookId: facebookId})
            .expect(200, done);
        });
    });
    it('should 403 when logging in invalid account', function(done) {
      request
        .post('/login')
        .send({
          facebookId: 'invalid'
        })
        .expect(403, done);
    });
  });
});
