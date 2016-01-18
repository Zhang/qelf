'use strict';

const accountModel = require('../models/account');
const _ = require('lodash');

module.exports = function* (votes) {
  const contestantIds = _.uniq(_.flatten(_.map(votes, 'contestants')));
  const contestants = yield accountModel.query({
    facebookId: {$in: contestantIds}
  });

  return (function composeVotes() {
    return _.compact(_.map(votes, function(vote) {
      const contestantIds = vote.contestants;
      const contestant1 = _.find(contestants, {facebookId: contestantIds[0]});
      const contestant2 = _.find(contestants, {facebookId: contestantIds[1]});
      if (!contestant1 || !contestant2) {
        console.error('Refusing to denormalize vote: ', vote.id, ' because of missing contestant');
        return null;
      }
      vote.contestants = [contestant1, contestant2];
      return vote;
    }));
  })();
};
