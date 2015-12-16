'use strict';

/**
 * Module dependencies.
 */

const agent = require('supertest').agent;
const app = require('./mockApp');
const http = require('http');
/**
 * Tests.
 */

describe('/feedback', function() {
  let request;

  beforeEach(function () {
    request = agent(http.createServer(app.callback()));
  });

  describe('POST /feedback', function() {
    it('should create feedback', function(done) {
      request
        .post('/feedback')
        .send({
          facebookId: 'test',
          feedbackText: 'testFeedback',
          canContact: false
        })
        .expect(200, done);
    });
  });
});
