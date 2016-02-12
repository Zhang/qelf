'use strict';

const userModel = require('../../models/user');
const authentication = require('../../lib/authentication');
const logger = require('../../logger');

const create = function* create() {
  const body = this.request.body;
  try {
    yield userModel.add({
      email: body.email,
      password: body.password
    });

    yield authentication.login.call(this);
  } catch (err) {
    this.body = err.message;
    this.status = 500;
    logger.error(err);
  }
};

/**
 * Exports.
 */

module.exports = create;
