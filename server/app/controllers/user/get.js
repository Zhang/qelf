'use strict';

const userModel = require('../../models/user');
/**
 * Find a photo by ID.
 */
const find = function* find() {
  const id = this.params.id;
  const user = yield userModel.get(id);

  if (!user) {
    this.status = 404;
    return;
  }

  this.body = user;
  this.status = 200;
};

/**
 * Exports.
 */

module.exports = find;
