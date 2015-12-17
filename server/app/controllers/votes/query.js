'use strict';

const createVotes = require('../../services/createVotes');

const query = function* query() {
  const facebookId = this.params.facebookId;
  const votes = yield createVotes(facebookId);

  this.body = votes;
  this.status = 200;
};

/**
 * Exports.
 */

module.exports = query;
