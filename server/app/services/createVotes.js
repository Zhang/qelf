'use strict';

const voteModel = require('../models/vote');
const traitTemplateModel = require('../models/traitTemplate');
const _ = require('lodash');

module.exports = function* (accountIds, traitTemplateId) {
  const template = yield traitTemplateModel.get(traitTemplateId);

  var votes = _.reduce(accountIds, function(total, accountId, key) {
    var unmatchedAccountIds = accountIds.slice(key + 1);
    var newVotes = _.map(unmatchedAccountIds, function(acctId) {
      return {
        contestants: [acctId, accountId],
        comparison: template.comparisons[Math.floor(Math.random() * (template.comparisons.length - 1))],
        traitTemplateId: traitTemplateId,
        selected: null
      };
    });
    return total.concat(newVotes);
  }, []);

  yield voteModel.bulkAdd(votes);
};
