'use strict';

const db = require('../db');
const collection = db.get('account');
const facebook = require('../lib/facebook');
const traitModel = require('./trait');
const AccountSchema = require('./schemas').account;

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

const setComponentViewed = function* setComponentViewed(id, component) {
  var update = {};
  update['viewed.' + component] = true;
  try {
    yield modelCRUD.updateById(id, update);
  } catch (e) {
    console.error('error completing walkthrough', e);
    throw e;
  }
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
  setComponentViewed : setComponentViewed,
  //FOR TESTING ONLY
  clear: function* () {
    yield collection.remove({});
  }
};
