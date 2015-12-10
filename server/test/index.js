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
});
