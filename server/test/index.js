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

describe('api', function() {
  let request;

  beforeEach(function() {
    request = agent(http.createServer(app.callback()));
  });

  xdescribe('GET /photo/:id', function() {
    it('should 404 when no photo is found', function(done) {
      request
        .get('/photo/nonexistent')
        .expect(404, done);
    });

    it('should 200 when a photo is found', function(done) {
      request
        .get('/photo/123')
        .expect(200, done);
    });
  });

  describe('POST /photo', function() {
    xit('should 200 when a photo is successfully uploaded');
  });
});
