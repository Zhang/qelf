'use strict';

const createVotes = require('../app/services/createVotes');
const voteModel = require('../app/models/vote');
const traitTemplateModel = require('../app/models/traitTemplate');
const traits = require('../scripts/traits');
const co = require('co');
const expect = require('expect.js');
const testUtils = require('./testUtils');

describe('createVotes', function() {
  beforeEach(testUtils.clearAll);

  let MOCK_USER;
  const traitTemplate = {
    id: 'test',
    comparisons: ['this is a comparison'],
    themes: []
  };

  beforeEach(co.wrap(function* () {
    yield traitTemplateModel.addOrUpdate(traitTemplate);
    MOCK_USER = yield testUtils.createTestUser(null, null, {
      friends: ['1', '2', '3', '4']
    });
  }));

  it('should add votes', co.wrap(function* () {
    const TEMPLATE_ID = traitTemplate.id;
    yield createVotes(MOCK_USER.facebookId);
    const votes = yield voteModel.query({
      traitTemplateId: TEMPLATE_ID
    });

    const TOTAL_POSSIBLE_VOTES = ((MOCK_USER.friends.length * ( MOCK_USER.friends.length - 1 )) / 2 );
    expect(votes).to.be.an('array');
    expect(votes).to.have.length(TOTAL_POSSIBLE_VOTES);
  }));

  it('should stop adding votes after max has been reached', co.wrap(function* () {
    const TEMPLATE_ID = traitTemplate.id;
    yield createVotes(MOCK_USER.facebookId);
    yield createVotes(MOCK_USER.facebookId);
    const votes = yield voteModel.query({
      traitTemplateId: TEMPLATE_ID
    });

    const TOTAL_POSSIBLE_VOTES = ((MOCK_USER.friends.length * ( MOCK_USER.friends.length - 1 )) / 2 );
    expect(votes).to.have.length(TOTAL_POSSIBLE_VOTES);
  }));

  it('should create an appropriate amount of votes', co.wrap(function* () {
    yield traits.addDefault();
    const templates = yield traitTemplateModel.query({});
    yield createVotes(MOCK_USER.facebookId);
    const votes = yield voteModel.query({});
    const maxVotes = ((MOCK_USER.friends.length * ( MOCK_USER.friends.length - 1 )) / 2) * templates.length;
    expect(maxVotes).to.equal(votes.length);
  }));
});
