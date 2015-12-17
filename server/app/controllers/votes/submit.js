'use strict';

const voteModel = require('../../models/vote');
const accountModel = require('../../models/account');
const _ = require('lodash');

const submit = function* submit() {
  const voteId = this.params.id;
  const selected = this.body.selected;

  yield voteModel.submit(voteId, selected);
  const vote = yield voteModel.get(voteId);
  const templateId = vote.traitTemplateId;

  _.each(vote.contestants, function(fbId) {
    accountModel.incrementTraitByTemplateId(fbId, templateId, fbId === selected);
  });
  //each contestant - I update their count
  //I update the vote to submmitted
  //I update the finished selection
  //I return

  this.status = 200;
};

/**
 * Exports.
 */

module.exports = submit;
