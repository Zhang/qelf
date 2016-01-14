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

function shuffleContestants(id1, id2) {
  return Math.random() > 0.5 ? [id1, id2] : [id2, id1];
}

module.exports = function* (facebookId) {
  const values = yield [accountModel.getByFacebookId(facebookId), traitTemplateModel.query({}), completedVotesModel.getByFacebookId(facebookId)];
  const account = values[0];
  const templates = values[1];
  const completedVotes = _.get(values[2], 'complete');
  const completedVoteMap = getCompletedMapByFriend(completedVotes);
  if (_.isEmpty(templates)) {
    throw new Error('missing default traits, please run addTraits');
  }

  if (account.friends.length < 2) {
    return [];
  }

  const TOTAL_POSSIBLE_VOTES = ((account.friends.length * ( account.friends.length - 1 )) / 2 ) * (templates.length);
  if (completedVotes.length === TOTAL_POSSIBLE_VOTES) {
    //don't need to create any more votes;
    return [];
  }

  const votes = _.reduce(account.friends, function(total, friendFBid1, key, coll) {
    const unmatchedFBIds = coll.slice(key + 1);
    const newVotes = _.map(unmatchedFBIds, function(friendFBid2) {
      return _.map(templates, function(template) {
        if (validateCombinationIsUnique(completedVoteMap, friendFBid1, friendFBid2, template.id)) return null;
        const contestants = shuffleContestants(friendFBid2, friendFBid1);
        return voteModel.newVote(
          facebookId,
          template.comparisons[Math.floor(Math.random() * template.comparisons.length)],
          contestants,
          template.id
        );
      });
    });

    return total.concat(newVotes);
  }, []);

  const flattenedVotes = _.compact(_.flatten(votes));
  if (_.isEmpty(flattenedVotes)) return;

  const addedVotes = yield voteModel.bulkAdd(flattenedVotes);
  yield completedVotesModel.push(facebookId, addedVotes);
};
