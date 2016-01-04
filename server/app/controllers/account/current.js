'use strict';

const accountModel = require('../../models/account');
const _ = require('lodash');

const current = function* current() {
  // const userId = _.get(this.session, 'passport.user');
  // const acct = yield accountModel.get(userId);
  const acct = yield accountModel.getByFacebookId('mock_facebookId13');
  console.log(acct);
  if (!acct) {
    this.status = 403;
  } else {
    this.status = 200;
    this.body = acct;
  }
};

module.exports = current;
