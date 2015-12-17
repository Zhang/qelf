'use strict';

const traitModel = require('../../models/trait');
const accountModel = require('../../models/account');

const query = function* query() {
  const facebookId = this.params.facebookId;
  const account = yield accountModel.getByFacebookId(facebookId);

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
