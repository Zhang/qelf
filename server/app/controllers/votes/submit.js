'use strict';

const voteModel = require('../../models/vote');
const accountModel = require('../../models/account');
const _ = require('lodash');

//Submitting a vote :
//Updates the vote obj to have a selected field
//Updates relevant trait according to each contestant

const submit = function* submit() {
  const body = this.request.body;
  const voteId = this.params.id;
  const selected = body.selected;
  const comment = body.comment;

  try {
    const values = yield {
      submit: voteModel.submit(voteId, selected, comment),
      vote: voteModel.get(voteId)
    };

    const vote = values.vote;
    yield [_.map(vote.contestants, function(fbId) {
      return accountModel.incrementTraitByTemplateId(fbId, vote.traitTemplateId, fbId === selected, vote);
    })];

    this.status = 200;
  } catch(err) {
    console.error(err);
    this.status = 500;
  }
};

/**
 * Exports.
 */

module.exports = submit;
