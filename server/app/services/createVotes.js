'use strict';

const voteModel = require('../models/vote');
const accountModel = require('../models/account');
const traitTemplateModel = require('../models/traitTemplate');
const _ = require('lodash');
const defaultTraits = require('../../bin/traits');

module.exports = function* (facebookId) {
  const user = yield accountModel.getByFacebookId(facebookId);
  const templates = yield traitTemplateModel.query({
    id: { $in: _.map(defaultTraits, 'template.id') }
  });

  var votes = _.reduce(user.friends, function(total, accountId, key, coll) {
    var unmatchedAccountIds = coll.slice(key + 1);
    var newVotes = _.map(unmatchedAccountIds, function(acctId) {
      return _.map(templates, function(template) {
        return {
          contestants: [acctId, accountId],
          comparison: template.comparisons[Math.floor(Math.random() * (template.comparisons.length - 1))],
          traitTemplateId: template.id,
          selected: null
        };
      });
    });
    return total.concat(newVotes);
  }, []);

  yield voteModel.bulkAdd(_.flatten(votes));
};
