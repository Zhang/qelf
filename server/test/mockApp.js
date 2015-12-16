'use strict';

const proxyquire = require('proxyquire');
const accountModel = require('../app/models/account');
const _ = require('lodash');
const mockAuth = {
  login: function* () {
    const fbId = _.get(this, 'request.body.facebookId');
    if (fbId) {
      this.body = yield accountModel.getByFacebookId(fbId);
    }
    this.status = 200;
  }
};
const app = proxyquire('../app', {
  './controllers/account': proxyquire('../app/controllers/account', {
    './create': proxyquire('../app/controllers/account/create', {
      '../../lib/authentication': mockAuth
    })
  }),
  './login': proxyquire('../app/login', {
    './lib/authentication': mockAuth
  })
});

module.exports = app;
