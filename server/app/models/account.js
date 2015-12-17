'use strict';

const db = require('../db');
const collection = db.get('account');
const Joi = require('joi');
const facebook = require('../lib/facebook');
console.log(facebook);
const AccountSchema = Joi.object().keys({
  _id: Joi.string(),
  id: Joi.string().required(),
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

module.exports = {
  add: modelCRUD.create,
  get: modelCRUD.get,
  query: modelCRUD.query,
  getByFacebookId: getByFacebookId,
  getFriends: getFriends,
  getPicture: getPicture,
  updateById: modelCRUD.updateById,
  update: modelCRUD.update,
  //FOR TESTING ONLY
  clear: function* () {
    yield collection.remove({});
  }
};
