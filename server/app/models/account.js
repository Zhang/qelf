'use strict';

const db = require('../db');
const collection = db.get('account');
const Joi = require('joi');

const AccountSchema = Joi.object().keys({
  _id: Joi.string(),
  id: Joi.string().required(),
  email: Joi.string().required(),
  friends: Joi.array(Joi.string().description('id of other account objects')).items().required(),
  password: Joi.string().required(),
  traits: Joi.array().items(Joi.string()).required().description('Array of strings that correspond to the id of trait objects'),
});

const modelCRUD = require('./concerns/modelCRUD')('account', collection, AccountSchema);
const getByEmail = function getByEmail(email) {
  return collection.findOne({email: email});
};
const getFriends = function() {
  return [];
};

module.exports = {
  add: modelCRUD.create,
  get: modelCRUD.get,
  query: modelCRUD.query,
  getByEmail: getByEmail,
  getFriends: getFriends
};
