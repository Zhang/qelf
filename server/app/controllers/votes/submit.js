'use strict';

const voteModel = require('../../models/vote');
const accountModel = require('../../models/account');
const _ = require('lodash');
const logger = require('../../logger');

//Submitting a vote :
//Updates the vote obj to have a selected field
//Updates relevant trait according to each contestant

const submit = function* submit() {
  const body = this.request.body;
  const voteId = this.params.id;
  const selected = body.selected;
  const score = body.score;

  try {
    const vote = yield voteModel.submit(voteId, selected, score);

    yield [_.map(vote.contestants, function(fbId) {
      return accountModel.incrementTraitByTemplateId(fbId, vote.traitTemplateId, fbId === selected, vote);
    })];

    this.status = 200;
  } catch(err) {
    logger.error('Error submitting a vote', err);
    this.status = 500;
  }
};

/**
 * Exports.
 */

module.exports = submit;
