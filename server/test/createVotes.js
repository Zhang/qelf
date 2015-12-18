'use strict';

const createVotes = require('../app/services/createVotes');
const voteModel = require('../app/models/vote');
const traitTemplateModel = require('../app/models/traitTemplate');
const co = require('co');
const expect = require('expect.js');
const testUtils = require('./testUtils');

describe('createVotes', function() {
  beforeEach(testUtils.clearAll);

  let MOCK_USER;
  const traitTemplate = {
    id: 'test',
    comparisons: ['this is a comparison']
  };

  beforeEach(function(cb) {
    co(function* () {
      yield traitTemplateModel.addOrUpdate(traitTemplate);
      MOCK_USER = yield testUtils.createTestUser(null, null, {
        friends: ['1', '2', '3', '4']
      });
      cb();
    });
  });

  it('should add votes', function(done) {
    const TEMPLATE_ID = traitTemplate.id;
    co(function* () {
      yield createVotes(MOCK_USER.facebookId);
      const votes = yield voteModel.query({
        traitTemplateId: TEMPLATE_ID
      });

      expect(votes).to.be.an('array');
      expect(votes).to.have.length(6);
      done();
    }).catch(function(err) {
      if (err) return console.log(err);
    });
  });
});
