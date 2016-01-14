'use strict';

const voteModel = require('../models/vote');
const traitTemplateModel = require('../models/traitTemplate');

module.exports = function* (trait) {
  const voteIds = trait.total;
  const traitTemplateId = trait.templateId;
  const vals = yield {
    votes: voteModel.query({
      id: {$in: voteIds}
    }),
    traitTemplate: traitTemplateModel.get(traitTemplateId)
  };

  trait.total = vals.votes;
  trait.template = vals.traitTemplate;

  return trait;
};
