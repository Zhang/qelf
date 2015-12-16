'use strict';

const db = require('../db');
const collection = db.get('account');
const Joi = require('joi');
const request = require('koa-request');
const _ = require('lodash');

const AccountSchema = Joi.object().keys({
  _id: Joi.string(),
  id: Joi.string().required(),
  facebookId: Joi.string().required(),
  accessToken: Joi.string().required(),
  friends: Joi.array(Joi.string().description('id of other account objects')).items().required(),
  traits: Joi.array().items(Joi.string()).required().description('Array of strings that correspond to the id of trait objects'),
});

const modelCRUD = require('./concerns/modelCRUD')('account', collection, AccountSchema);
const getByFacebookId = function getByFacebookId(facebookId) {
  return collection.findOne({facebookId: facebookId});
};
const getFriends = function* (facebookId) {
  // const options = {
  //     url: 'graph.facebook.com/v2.5/' + facebookId + '/friends',
  //     headers: { 'User-Agent': 'request' }
  // };

  // const response = yield request(options);
  // return response;
  return [];
};

module.exports = {
  add: modelCRUD.create,
  get: modelCRUD.get,
  query: modelCRUD.query,
  getByFacebookId: getByFacebookId,
  getFriends: getFriends,
  update: modelCRUD.updateById,
  //FOR TESTING ONLY
  clear: function* () {
    yield collection.remove({});
  }
};
