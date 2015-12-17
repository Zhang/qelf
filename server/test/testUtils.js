'use strict'

const accountModel = require('../app/models/account');
const proxyquire = require('proxyquire');
const createAccount = proxyquire('../app/controllers/account/create', {
  '../../lib/authentication': {
    login: function* () {
      this.status = 200;
    }
  },
  '../../models/account': proxyquire('../app/models/account', {
    '../lib/facebook': {
      getPicture: function* () {
        return 'test.jpeg';
      },
      getFriends: function* () {
        return [];
      }
    }
  })
});

module.exports = {
  clearUsers: function* () {
    yield accountModel.clear();
  },
  createTestUser: function* (_facebookId, accessToken) {
    const facebookId = _facebookId || 'test';
    yield createAccount.call({
      request: {
        body: {
          facebookId: facebookId,
          access_token: accessToken || 'test_token'
        }
      }
    });
    return accountModel.getByFacebookId(facebookId);
  }
};
