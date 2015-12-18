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

  let defaultTraits;
  let facebookPresence;

  yield [
    defaultTraits = traitModel.addBulk(DEFAULT_TRAITS),
    facebookPresence = yield {
      friends: accountModel.getFriends(facebookId, accessToken),
      picture: accountModel.getPicture(facebookId, accessToken),
      profile: accountModel.getProfile(facebookId, accessToken)
    },
    completedVotesModel.createForAcct(facebookId)
  ];

  yield accountModel.add({
    facebookId: facebookId,
    traits: _.map(defaultTraits, 'id'),
    friends: facebookPresence.friends,
    accessToken: accessToken,
    profilePicture: facebookPresence.picture,
    name: facebookPresence.profile.name
  });

  yield authentication.login.call(this);
};

/**
 * Exports.
 */

module.exports = create;
