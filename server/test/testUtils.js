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
      },
      getProfile: function* () {
        return {
          name: 'test'
        };
      }
    }
  })
});
const _ = require('lodash');
const traitModel = require('../app/models/trait');
const voteModel = require('../app/models/vote');
const completedVotesModel = require('../app/models/completedVotes');
const traitTemplateModel = require('../app/models/traitTemplate');
const co = require('co');

module.exports = {
  clearAll: function(cb) {
    co(function* () {
      yield accountModel.clear();
      yield traitModel.clear();
      yield traitTemplateModel.clear();
      yield voteModel.clear();
      yield completedVotesModel.clear();
      cb();
    }).catch(function(err) {
      cb(err);
    });
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
  createTrait: function* (templateId, overrides) {
    var trait = traitModel.newTrait(templateId);
    return yield traitModel.add(_.merge(trait, overrides || {}));
  },
  createTraitTemplate: function(id, comparisons, themes) {
    traitTemplateModel.addOrUpdate({
      id: id,
      comparisons: comparisons,
      themes: themes || []
    });
  }
};
