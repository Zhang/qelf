'use strict';

const db = require('../db');
const collection = db.get('account');
const Joi = require('joi');

const AccountSchema = Joi.object().keys({
  _id: Joi.string(),
  id: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const modelCRUD = require('./concerns/modelCRUD')('account', collection, AccountSchema);
const getByEmail = function getByEmail(email) {
  console.log(email);
  return collection.findOne({email: email});
};

module.exports = {
  add: modelCRUD.create,
  get: modelCRUD.get,
  query: modelCRUD.query,
  getByEmail: getByEmail
};
