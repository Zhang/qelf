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
    var email = 'test@' + uuid.v4();
    it('should create a new account and log in', function(done) {
      request
        .post('/account')
        .send({
          email: email,
          password: 'tesst'
        })
        .expect(201)
        .end(function(err, res) {
          if (err) throw err;
          expect(res.body.email).to.be(email);
          done();
        });
    });
    it('should 500 when missing required fields', function(done) {
      request
        .post('/account')
        .send({
          email: 'test'
        })
        .expect(500, done);
    });
  });
});
