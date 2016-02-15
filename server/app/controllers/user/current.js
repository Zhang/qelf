'use strict';

const userModel = require('../../models/user');
const _ = require('lodash');

const current = function* current() {
  const userId = _.get(this.session, 'passport.user');
  const user = yield userModel.get(userId);

  if (!user) {
    this.status = 403;
  } else {
    this.status = 200;
    this.body = user;
  }
};

module.exports = current;
