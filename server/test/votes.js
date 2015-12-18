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

describe('/votes', function() {
  beforeEach(testUtils.clearAll);
  let request;
  let mockUser;
  let friend1;
  let friend2;
  let testVote;
  let trait1;
  let trait2;
  const id1 = 'friend1';
  const id2 = 'friend2';

  beforeEach(function(done) {
    co(function* () {
      request = agent(http.createServer(app.callback()));
      mockUser = yield testUtils.createTestUser(null, null, {
        friends: [id1, id2]
      });
      const traitTemplateId = '1';
      trait1 = yield testUtils.createTrait(traitTemplateId);
      trait2 = yield testUtils.createTrait(traitTemplateId);
      testUtils.createTraitTemplate(traitTemplateId, ['comparison1']);
      friend1 = yield testUtils.createTestUser(id1, null, {
        traits: [trait1.id]
      });
      friend2 = yield testUtils.createTestUser(id2, null, {
        traits: [trait2.id]
      });

      yield createVotes(mockUser.facebookId);
      const votes = yield voteModel.query({});
      testVote = votes[0];
      done();
    });
  });

  describe('POST /votes/:id', function() {
    it('should complete a vote', function(done) {
      request
        .post('/votes/' + testVote.id)
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
            console.log('heyc', completedVotes);
            expect(completedVotes.complete).to.have.length(1);
            expect(completedVotes.complete[0].id).to.be(testVote.id);

            done();
          }).catch(function(err) {
            console.log(err);
          });
        });
    });
  });
});
