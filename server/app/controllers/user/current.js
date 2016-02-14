'use strict';

const userModel = require('../../models/user');
const _ = require('lodash');

const current = function* current() {
  // const userId = _.get(this.session, 'passport.user');
  // const acct = yield userModel.get(userId);
  const user = yield userModel.getByEmail('test_user1@gmail.com');
  if (!user) {
    this.status = 403;
  } else {
    this.status = 200;
    this.body = user;
  }
};

module.exports = current;
