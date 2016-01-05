'use strict';

const agent = require('supertest').agent;
const app = require('./mockApp');
const http = require('http');
const expect = require('expect.js');
const createVotes = require('../app/services/createVotes');
const voteModel = require('../app/models/vote');
const completedVotesModel = require('../app/models/completedVotes');
const traitModel = require('../app/models/trait');
const testUtils = require('./testUtils');
const co = require('co');
const _ = require('lodash');
const Joi = require('joi');
const accountSchema = require('../app/models/schemas').account;

describe('/vote', function() {
  beforeEach(testUtils.clearAll);
  let request;
  let mockUser;
  let friend1;
  let friend2;
  let trait1;
  let trait2;
  const id1 = 'friend1';
  const id2 = 'friend2';

  beforeEach(function(cb) {
    request = agent(http.createServer(app.callback()));
    co(function* () {
      const traitTemplateId = '1';
      const setup = yield {
        mockUser: testUtils.createTestUser(null, null, {
          friends: [id1, id2]
        }),
        trait1: testUtils.createTrait(traitTemplateId),
        trait2: testUtils.createTrait(traitTemplateId),
        template: testUtils.createTraitTemplate(traitTemplateId, ['comparison1'])
      };
      mockUser = setup.mockUser;
      trait1 = setup.trait1;
      trait2 = setup.trait2;

      const setupFriends = yield [
        testUtils.createTestUser(id1, null, {
          traits: [trait1.id]
        }),
        testUtils.createTestUser(id2, null, {
          traits: [trait2.id]
        })
      ];
      friend1 = setupFriends[0];
      friend2 = setupFriends[1];

      cb();
    }).catch(function(err) {
      console.error(err);
    });
  });

  describe('POST /vote/:id', function() {
    let testVote;
    beforeEach(function(cb) {
      co(function* () {
        yield createVotes(mockUser.facebookId);
        const votes = yield voteModel.query({});
        testVote = votes[0];
        cb();
      });
    });
    it('should complete a vote', function(cb) {
      request
        .post('/vote/' + testVote.id)
        .send({
          facebookId: mockUser.facebookId,
          selected: id1
        })
        .expect(200)
        .end(function(err) {
          if (err) throw err;
          co(function* () {
            const winningTrait = yield traitModel.get(trait1.id);
            const losingTrait = yield traitModel.get(trait2.id);
            expect(winningTrait.count).to.be(1);
            expect(losingTrait.count).to.be(0);
            expect(losingTrait.total).to.be.an('array');
            expect(losingTrait.total).to.have.length(1);

            const completedVotes = yield completedVotesModel.getByFacebookId(mockUser.facebookId);
            expect(completedVotes.complete).to.have.length(1);
            expect(completedVotes.complete[0].id).to.be(testVote.id);

            cb();
          }).catch(function(err) {
            console.log('error with should complete a vote', err);
            throw err;
          });
        });
    });
  });
  describe('GET /vote/:facebookId', function() {
    it('should return an array of incomplete votes', function(cb) {
      request
        .get('/vote/' + mockUser.facebookId)
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          const votes = res.body;
          expect(votes).to.have.length(1);
          expect(votes[0].contestants).to.have.length(2);

          cb();
        });
    });
    it('returned votes should be denomalized', function(cb) {
      request
        .get('/vote/' + mockUser.facebookId)
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          const votes = res.body;
          _.each(votes[0].contestants, function(acct) {
            const validation = Joi.validate(acct, accountSchema);
            expect(!validation.error).to.be.ok();
          });
          cb();
        });
    });
  });
});
