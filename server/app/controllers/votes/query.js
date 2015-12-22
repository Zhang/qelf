'use strict';

const createVotes = require('../../services/createVotes');
const denormalizeVotes = require('../../services/denormalizeVotes');
const voteModel = require('../../models/vote');
const _ = require('lodash');

const query = function* query() {
  const facebookId = this.params.facebookId;
  yield createVotes(facebookId);
  const votes = yield voteModel.query({voterId: facebookId, selected: null});
  const denormalizedVotes = yield denormalizeVotes(votes);

  this.body = _.shuffle(denormalizedVotes);
  this.status = 200;
};

/**
 * Exports.
 */

module.exports = query;
