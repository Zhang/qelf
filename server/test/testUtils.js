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
const traitModel = require('../app/models/trait');
const traitTemplateModel = require('../app/models/traitTemplate');

module.exports = {
  clearUsers: function* () {
    yield accountModel.clear();
  },
  createTestUser: function* (_facebookId, accessToken, opts) {
    const facebookId = _facebookId || 'test';
    yield createAccount.call({
      request: {
        body: {
          facebookId: facebookId,
          access_token: accessToken || 'test_token'
        }
      }
    });

    if (opts) {
      yield accountModel.update({facebookId: facebookId}, opts);
    }

    return yield accountModel.getByFacebookId(facebookId);
  },
  createTrait: function* (templateId) {
    var trait = traitModel.newTrait(templateId);
    return yield traitModel.add(trait);
  },
  createTraitTemplate: function(id, comparisons) {
    traitTemplateModel.addOrUpdate({
      id: id,
      comparisons: comparisons
    });
  }
};
