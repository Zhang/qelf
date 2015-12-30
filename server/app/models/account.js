'use strict';

const db = require('../db');
const collection = db.get('account');
const Joi = require('joi');
const facebook = require('../lib/facebook');
const traitModel = require('./trait');

const AccountSchema = Joi.object().keys({
  _id: Joi.string(),
  id: Joi.string().required(),
  name: Joi.string().required(),
  facebookId: Joi.string().required(),
  accessToken: Joi.string().required(),
  friends: Joi.array(Joi.string().description('id of other account objects')).items().required(),
  traits: Joi.array().items(Joi.string()).required().description('Array of strings that correspond to the id of trait objects'),
  profilePicture: Joi.string().required().description('profile picture url')
});

const modelCRUD = require('./concerns/modelCRUD')('account', collection, AccountSchema);
const getByFacebookId = function getByFacebookId(facebookId) {
  return collection.findOne({facebookId: facebookId});
};
const getFriends = facebook.getFriends;
const getPicture = facebook.getPicture;
const getProfile = facebook.getProfile;

const incrementTraitByTemplateId = function* (fbId, templateId, increment, vote) {
  const acct = yield getByFacebookId(fbId);
  const trait = yield traitModel.getFromArrByTemplateId(acct.traits, templateId);

  yield traitModel.incrementTrait(trait.id, increment, vote);
};

const add = function* add(toAdd) {
  const existingUser = yield collection.findOne({
    facebookId: toAdd.facebookId
  });

  if (existingUser) {
    this.status = 400;
    throw new Error('attempting to add duplicate user', existingUser);
  }

  const added = yield* modelCRUD.create(toAdd);
  return added;
};

const addAcctToFriends = function(fbId, friends) {
  return collection.update(
    { friends: { $in: friends } },
    { $push: { friends: fbId } }
  );
};

module.exports = {
  add: add,
  get: modelCRUD.get,
  query: modelCRUD.query,
  getByFacebookId: getByFacebookId,
  getFriends: getFriends,
  getPicture: getPicture,
  updateById: modelCRUD.updateById,
  update: modelCRUD.update,
  incrementTraitByTemplateId: incrementTraitByTemplateId,
  getProfile: getProfile,
  addAcctToFriends: addAcctToFriends,
  //FOR TESTING ONLY
  clear: function* () {
    yield collection.remove({});
  }
};
