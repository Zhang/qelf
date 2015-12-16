'use strict';

const traitModel = require('../../models/trait');
const accountModel = require('../../models/account');
/**
 * Find a photo by ID.
 */
const query = function* query() {
  const email = this.params.email;
  const account = yield accountModel.getByEmail(email);
  if (!account) {
    this.status = 404;
    this.body = 'No user found';
    return;
  }

  const traits = yield traitModel.query({
    id: { $in: account.traits }
  });

  this.body = traits;
  this.status = 200;
};

/**
 * Exports.
 */

module.exports = query;