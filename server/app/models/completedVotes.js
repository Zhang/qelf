'use strict';

const db = require('../db');
const collection = db.get('feedback');
const Joi = require('joi');

const CompletedVotesSchema = Joi.object().keys({
  _id: Joi.string(),
  id: Joi.string().required(),
  complete: Joi.array().required(),
  facebookId: Joi.string().required()
});

const modelCRUD = require('./concerns/modelCRUD')('completedVotes', collection, CompletedVotesSchema);
const push = function push(facebookId, vote) {
  return collection.update({facebookId: facebookId}, {
    $push: {
      complete: vote
    }
  });
};
const getByFacebookId = function getByFacebookId(facebookId) {
  return collection.findOne({facebookId: facebookId});
};
const createForAcct = function* createForAcct(fbId) {
  yield modelCRUD.create({
    facebookId: fbId,
    complete: []
  });
};
module.exports = {
  add: modelCRUD.create,
  push: push,
  createForAcct: createForAcct,
  getByFacebookId: getByFacebookId,
  query: modelCRUD.query,
  //FOR TESTING ONLY
  clear: function* () {
    yield collection.remove({});
  }
};
