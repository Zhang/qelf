'use strict';

const createVotes = require('../../services/createVotes');
const denormalizeVotes = require('../../services/denormalizeVotes');
const query = function* query() {
  const facebookId = this.params.facebookId;
  const votes = yield createVotes(facebookId);
  const denormalizedVotes = yield denormalizeVotes(votes);

  this.body = denormalizedVotes;
  this.status = 200;
};

/**
 * Exports.
 */

module.exports = query;
