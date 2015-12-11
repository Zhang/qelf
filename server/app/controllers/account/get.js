'use strict';

const accountModel = require('../../models/account');
/**
 * Find a photo by ID.
 */
const find = function* find() {
  const id = this.params.id;
  const account = yield accountModel.get(id);
  if (!account) {
    this.status = 404;
    return;
  }

  this.body = account;
  this.status = 200;
};

/**
 * Exports.
 */

module.exports = find;
