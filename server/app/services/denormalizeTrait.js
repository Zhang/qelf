'use strict';

const voteModel = require('../models/vote');

module.exports = function* (trait) {
  const voteIds = trait.total;
  console.log(voteIds);
  const votes = yield voteModel.query({
    id: {$in: voteIds}
  });

  trait.total = votes;
  return trait;
};
