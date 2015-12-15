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
  const email = body.email;
  const password = body.password;
  const DEFAULT_TRAITS = _.map(['trustworthiness', 'scott'], traitModel.newTrait);

  const defaultTraits = yield traitModel.addBulk(DEFAULT_TRAITS);

  yield accountModel.add({
    password: password,
    email: email,
    traits: _.map(defaultTraits, 'id')
  });

  yield authentication.login.call(this);
};

/**
 * Exports.
 */

module.exports = create;
