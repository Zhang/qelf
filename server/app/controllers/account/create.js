'use strict';

/**
 * Module dependencies.
 */

const accountModel = require('../../models/account');
const authentication = require('../../lib/authentication');
const traitModel = require('../../models/trait');
const completedVotesModel = require('../../models/completedVotes');
const _ = require('lodash');

const create = function* create() {
  const body = this.request.body;
  const facebookId = body.facebookId;
  const accessToken = body.access_token;
  const DEFAULT_TRAITS = _.map(['trustworthiness', 'scott'], traitModel.newTrait);
  try {
    const acctOpts = yield {
      defaultTraits: traitModel.addBulk(DEFAULT_TRAITS),
      friends: accountModel.getFriends(facebookId, accessToken),
      picture: accountModel.getPicture(facebookId, accessToken),
      profile: accountModel.getProfile(facebookId, accessToken),
      completedVotes: completedVotesModel.createForAcct(facebookId)
    };

    yield accountModel.add({
      facebookId: facebookId,
      traits: _.map(acctOpts.defaultTraits, 'id'),
      friends: acctOpts.friends,
      accessToken: accessToken,
      profilePicture: acctOpts.picture,
      name: acctOpts.profile.name
    });

    yield authentication.login.call(this);
  } catch(err) {
    console.error(err);
    this.status = 500;
  }
};

/**
 * Exports.
 */

module.exports = create;
