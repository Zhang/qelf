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
  const DEFAULT_TRAITS = _.map(['trustworthiness', 'scott'], traitModel.newTrait);
  console.log('1');
  const defaultTraits = yield traitModel.addBulk(DEFAULT_TRAITS);
  console.log('2')
  const friends = yield accountModel.getFriends(facebookId);
  console.log('3');
  yield accountModel.add({
    facebookId: facebookId,
    traits: _.map(defaultTraits, 'id'),
    friends: friends
  });

  yield authentication.login.call(this);
};

/**
 * Exports.
 */

module.exports = create;
