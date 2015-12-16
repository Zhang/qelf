'use strict';

/**
 * Module dependencies.
 */

const agent = require('supertest').agent;
const app = require('../app');
const http = require('http');
const uuid = require('uuid');
const _ = require('lodash');
const expect = require('expect.js');
/**
 * Tests.
 */

describe('/trait', function() {
  let request;

  beforeEach(function() {
    request = agent(http.createServer(app.callback()));
  });

  describe('GET /query', function() {
    it('should get traits by user', function(done) {
      var MOCK_USER;
      request
        .post('/account')
        .send({
          facebookId: uuid.v4()
        })
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          MOCK_USER = res.body;

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
});
