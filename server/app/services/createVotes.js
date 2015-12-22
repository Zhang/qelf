'use strict';

const voteModel = require('../models/vote');
const accountModel = require('../models/account');
const traitTemplateModel = require('../models/traitTemplate');
const completedVotesModel = require('../models/completedVotes');
const _ = require('lodash');

// returns a map describing created vote objects
// {
//  trait : {
//    userId1: {
//      userId2: true,
//      userId3: true
//    },
//    userId4: {
//      userId5: true
//    }
//  }
// }
function getCompletedMapByFriend(completedVotes) {
  return _.reduce(completedVotes, function(total, vote) {
    return _.set(total, vote.traitTemplateId + '.' + vote.contestants[0] + '.' + vote.contestants[1], true);
  }, {});
}

function validateCombinationIsUnique(completedVoteMap, accountId, accountId2, traitTemplateId) {
  return _.get(completedVoteMap, traitTemplateId + '.' + accountId + '.' + accountId2) ||
    _.get(completedVoteMap, traitTemplateId + '.' + accountId2 + '.' + accountId);
}

module.exports = function* (facebookId) {
  const values = yield [accountModel.getByFacebookId(facebookId), traitTemplateModel.query({}), completedVotesModel.getByFacebookId(facebookId)];
  const user = values[0];
  const templates = values[1];
  const completedVotes = _.get(values[2], 'complete');
  const completedVoteMap = getCompletedMapByFriend(completedVotes);

  if (_.isEmpty(templates)) {
    throw new Error('missing default traits, please run addTraits');
  }

  if (user.friends.length < 2) {
    console.log('Not enough friends');
    return [];
  }

  var votes = _.reduce(user.friends, function(total, accountId, key, coll) {
    var unmatchedAccountIds = coll.slice(key + 1);
    var newVotes = _.map(unmatchedAccountIds, function(acctId) {
      return _.map(templates, function(template) {
        if (validateCombinationIsUnique(completedVoteMap, accountId, acctId, template.id)) return null;

        return {
          contestants: [acctId, accountId],
          comparison: template.comparisons[Math.floor(Math.random() * (template.comparisons.length - 1))],
          traitTemplateId: template.id,
          selected: null,
          voterId: facebookId
        };
      });
    });

    return total.concat(newVotes);
  }, []);

  const flattenedVotes = _.compact(_.flatten(votes));
  if (_.isEmpty(flattenedVotes)) return;

  yield completedVotesModel.push(facebookId, flattenedVotes);
  yield voteModel.bulkAdd(flattenedVotes);
};
