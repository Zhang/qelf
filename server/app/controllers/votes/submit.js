'use strict';

const voteModel = require('../../models/vote');
const accountModel = require('../../models/account');
const completedModel = require('../../models/completedVotes');
const co = require('co');
const _ = require('lodash');

const submit = function* submit() {
  const body = this.request.body;
  const voteId = this.params.id;
  const voterFbId = body.facebookId;
  const selected = body.selected;

  //I update the vote to submmitted
  yield voteModel.submit(voteId, selected);
  const vote = yield voteModel.get(voteId);
  const templateId = vote.traitTemplateId;

  //each contestant - I update their count
  _.each(vote.contestants, function(fbId) {
    co(function*() {
      yield accountModel.incrementTraitByTemplateId(fbId, templateId, fbId === selected, vote);
    });
  });

  //I update the finished selection
  yield completedModel.push(voterFbId, vote);

  this.status = 200;
};

/**
 * Exports.
 */

module.exports = submit;
