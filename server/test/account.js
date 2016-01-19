'use strict';

const agent = require('supertest').agent;
const app = require('./mockApp');
const http = require('http');
const uuid = require('uuid');
const expect = require('expect.js');
const testUtils = require('./testUtils');
const completedVotesModel = require('../app/models/completedVotes');
const co = require('co');
const accountModel = require('../app/models/account');

describe('/account', function() {
  beforeEach(testUtils.clearAll);

  let request;
  let testUser;
  beforeEach(function(done) {
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
        done();
      });
  });

  describe('POST /', function() {
    it('should create a new account', function(done) {
      expect(testUser).to.be.ok();
      done();
    });
    it('should create a completed votes collection for given user', co.wrap(function* () {
      const completedVotes = yield completedVotesModel.getByFacebookId(testUser.facebookId);
      expect(completedVotes).to.be.ok();
      expect(completedVotes.complete).to.be.an('array');
    }));
    it('should 500 when missing required fields', function(done) {
      request
        .post('/account')
        .expect(500, done);
    });
  });
  //TODO
  // describe('GET /current', function() {
  //   it('should create a new account', function(done) {
  //     expect(testUser).to.be.ok();
  //     done();
  //   });
  // });
  describe('GET /{id}', function() {
    it('should get an account', function(done) {
      request
      .get('/account/' + testUser.id)
      .expect(200)
      .end(function(err, res) {
        if (err) done(err);
        try {
          const acct = res.body;
          expect(acct.id).to.be(testUser.id);
          done();
        } catch(e) {
          done(e);
        }
      });
    });
  });

  describe('POST /viewed', function() {
    it('should set viewed elements', function(done) {
      request
      .post('/account/viewed')
      .send({
        id: testUser.id,
        component: 'walkthrough'
      })
      .expect(200)
      .end(function(err) {
        if (err) return done(err);
        co(function* () {
          const acct = yield accountModel.get(testUser.id);
          expect(acct.viewed.walkthrough).to.be(true);
          done();
        }).catch(function(e) {
          console.error(e);
          done(e);
        });
      });
    });
    it('should 400 when attempting to set non existant component', function(done) {
      request
      .post('/account/viewed')
      .send({
        id: testUser.id,
        component: 'made up'
      })
      .expect(400, done);
    });
  });
});
