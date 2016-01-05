'use strict';

const accountModel = require('../../models/account');

const current = function* current() {
  const acctId = this.request.body.id;
  try {
    yield accountModel.completeWalkthrough(acctId);
    this.body = 200;
  } catch(e) {
    console.error(e);
    this.body = e.message;
    this.status = 500;
  }
};

module.exports = current;
