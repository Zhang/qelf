'use strict';

/**
 * Module dependencies.
 */

const agent = require('supertest').agent;
const app = require('../app');
const http = require('http');

/**
 * Tests.
 */

describe('/account', function() {
  let request;

  beforeEach(function() {
    request = agent(http.createServer(app.callback()));
  });

  describe('POST /account', function(done) {
    it('should create a new account', function(done) {
      request
        .post('/account')
        .send({
          email: 'testz',
          password: 'tesst'
        })
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          console.log(res);
        });
    });
    xit('should 500 when missing required fields', function(done) {
      request
        .post('/account')
        .send({
          email: 'test'
        })
        .expect(500, done);
    });
  });
});
