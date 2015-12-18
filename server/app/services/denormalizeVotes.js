'use strict';

const accountModel = require('../models/account');
const _ = require('lodash');

module.exports = function* (votes) {
  const contestantIds = _.uniq(_.flatten(_.map(votes, 'contestants')));
  const contestants = yield accountModel.query({
    facebookId: {$in: contestantIds}
  });

  return (function composeVotes() {
    return _.map(votes, function(vote) {
      const contestantIds = vote.contestants;
      vote.contestants = [_.find(contestants, {facebookId: contestantIds[0]}), _.find(contestants, {facebookId: contestantIds[1]})];
      return vote;
    });
  })();
};
