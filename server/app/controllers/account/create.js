'use strict';

/**
 * Module dependencies.
 */

const accountModel = require('../../models/account');
const authentication = require('../../lib/authentication');
const traitModel = require('../../models/trait');
const _ = require('lodash');

const create = function* create() {
  const body = this.request.body;
  const facebookId = body.facebookId;
  const accessToken = body.access_token;
  const DEFAULT_TRAITS = _.map(['trustworthiness', 'scott'], traitModel.newTrait);
  const defaultTraits = yield traitModel.addBulk(DEFAULT_TRAITS);
  const friends = yield accountModel.getFriends(facebookId);

  yield accountModel.add({
    facebookId: facebookId,
    traits: _.map(defaultTraits, 'id'),
    friends: friends,
    accessToken: accessToken
  });

  yield authentication.login.call(this);
};

/**
 * Exports.
 */

module.exports = create;
