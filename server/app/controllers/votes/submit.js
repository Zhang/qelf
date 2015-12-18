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

  const values = yield {
    submit: voteModel.submit(voteId, selected),
    vote: voteModel.get(voteId)
  };

  const vote = values.vote;
  const templateId = vote.traitTemplateId;

  yield [_.map(vote.contestants, function(fbId) {
    return accountModel.incrementTraitByTemplateId(fbId, templateId, fbId === selected, vote);
  })];

  yield completedModel.push(voterFbId, vote);
  this.status = 200;
};

/**
 * Exports.
 */

module.exports = submit;
