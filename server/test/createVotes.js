'use strict';

const createVotes = require('../app/services/createVotes');
const voteModel = require('../app/models/vote');
const traitTemplateModel = require('../app/models/traitTemplate');
const co = require('co');
const expect = require('expect.js');

describe('createVotes', function() {
  var traitTemplate = {
    id: 'test',
    comparisons: ['this is a comparison']
  };

  beforeEach(function() {
    traitTemplateModel.addOrUpdate(traitTemplate);
  });

  it('should add votes', function(done) {
    var TEMPLATE_ID = traitTemplate.id;
    co(function* () {
      yield createVotes(['1', '2', '3', '4'], TEMPLATE_ID);
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
