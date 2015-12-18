'use strict';

const voteModel = require('../../models/vote');
const accountModel = require('../../models/account');
const completedModel = require('../../models/completedVotes');
const co = require('co');
const _ = require('lodash');

//Submitting a vote :
//Updates the vote obj to have a selected field
//Updates relevant trait according to each contestant
//Pushes the vote into the created array for submitting user

const submit = function* submit() {
  const body = this.request.body;
  const voteId = this.params.id;
  const voterFbId = body.facebookId;
  const selected = body.selected;

  yield voteModel.submit(voteId, selected);
  const vote = yield voteModel.get(voteId);
  const templateId = vote.traitTemplateId;

  _.each(vote.contestants, function(fbId) {
    co(function*() {
      yield accountModel.incrementTraitByTemplateId(fbId, templateId, fbId === selected, vote);
    });
  });

  yield completedModel.push(voterFbId, vote);
  this.status = 200;
};

/**
 * Exports.
 */

module.exports = submit;
