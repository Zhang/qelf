'use strict';

const agent = require('supertest').agent;
const app = require('./mockApp');
const http = require('http');
const _ = require('lodash');
const expect = require('expect.js');
const co = require('co');
const testUtils = require('./testUtils');
const voteModel = require('../app/models/vote');
const Joi = require('joi');
const voteSchema = require('../app/models/schemas').vote;

describe('/trait', function() {
  beforeEach(testUtils.clearAll);

  let request;
  let MOCK_USER;

  beforeEach(function(done) {
    co(function* () {
      request = agent(http.createServer(app.callback()));
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
          if (err) return cb(err);
          var traits = res.body;
          expect(_.map(traits, 'id')[0]).to.be(MOCK_USER.traits[0]);
          expect(traits).to.have.length(MOCK_USER.traits.length);
          done();
        });
    });
  });

  describe('GET /get', function() {
    //Add vote
    let testTrait;
    beforeEach(function(done) {
      co(function* () {
        const vote = yield voteModel.add(voteModel.newVote('testId', 'is this a test?', ['1', '2'], 'test'));
        testTrait = yield testUtils.createTrait('test', {
          total: [vote.id]
        });
        done();
      }).catch(function(err) {
        console.error(err);
        done(err);
      });
    });

    it('should get denormalized traits by id', function(done) {
      request
        .get('/trait/' + testTrait.id)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          const trait = res.body;
          expect(trait.total).to.have.length(1);

          const validation = Joi.validate(_.first(trait.total), voteSchema);
          if (validation.error) {
            return done(validation.error);
          }

          expect(trait).to.have.key('template');
          done();
        });
    });
  });
});
