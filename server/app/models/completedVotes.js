'use strict';

const db = require('../db');
const collection = db.get('completedVotes');
const Joi = require('joi');
const _ = require('lodash');

const CompletedVotesSchema = Joi.object().keys({
  _id: Joi.string(),
  id: Joi.string().required(),
  complete: Joi.array().required(),
  facebookId: Joi.string().required()
});

const modelCRUD = require('./concerns/modelCRUD')('completedVotes', collection, CompletedVotesSchema);
const push = function* push(facebookId, votes) {
  const isVoteArr = _.isArray(votes);
  const toPush = isVoteArr ? votes : [votes];
  if (_.isEmpty(toPush)) return;

  yield collection.update({facebookId: facebookId}, {
    $push: {
      complete: { $each: toPush }
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
