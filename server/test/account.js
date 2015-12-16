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

describe('/account', function() {
  let request;

  beforeEach(function() {
    request = agent(http.createServer(app.callback()));
  });

  describe('POST /account', function() {
    var facebookId = uuid.v4();
    it('should create a new account and log in', function(done) {
      request
        .post('/account')
        .send({
          facebookId: facebookId,
          access_token: 'test'
        })
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          expect(res.body.facebookId).to.be(facebookId);
          done();
        });
    });
    it('should 500 when missing required fields', function(done) {
      request
        .post('/account')
        .expect(500, done);
    });
  });
});
