'use strict';

const agent = require('supertest').agent;
const app = require('./mockApp');
const http = require('http');
const uuid = require('uuid');
const expect = require('expect.js');
const testUtils = require('./testUtils');
const completedVotesModel = require('../app/models/completedVotes');
const co = require('co');

describe('/account', function() {
  beforeEach(testUtils.clearAll);

  let request;
  let testUser;
  beforeEach(function(cb) {
    request = agent(http.createServer(app.callback()));
    const facebookId = uuid.v4();
    request
      .post('/account')
      .send({
        facebookId: facebookId,
        access_token: 'test'
      })
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        testUser = res.body;
        cb();
      });
  });

  describe('POST /account', function() {
    it('should create a new account', function(cb) {
      expect(testUser).to.be.ok();
      cb();
    });
    it('should create a completed votes collection for given user', function(cb) {
      co(function* () {
        const completedVotes = yield completedVotesModel.getByFacebookId(testUser.facebookId);
        expect(completedVotes).to.be.ok();
        expect(completedVotes.complete).to.be.an('array');
        cb();
      }).catch(function(err) {
        console.log(err);
      });
    });
    it('should 500 when missing required fields', function(cb) {
      request
        .post('/account')
        .expect(500, cb);
    });
  });
});
