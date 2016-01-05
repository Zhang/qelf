'use strict';

const db = require('../db');
const collection = db.get('vote');
const Joi = require('joi');

const VoteSchema = Joi.object().keys({
  _id: Joi.string(),
  id: Joi.string().required(),
  traitTemplateId: Joi.string().required(),
  contestants: Joi.array(Joi.string().description('facebookId of contestant').required()).required(),
  comparison: Joi.string().required(),
  selected: Joi.string().required().allow(null),
  comment: Joi.string().required().allow(null),
  voterId: Joi.string().required()
});

const modelCRUD = require('./concerns/modelCRUD')('vote', collection, VoteSchema);

const submit = function* submit(id, selected, comment) {
  yield modelCRUD.updateById(id, {
    selected: selected,
    comment: comment
  });
};

const newVote = function(fbId, comparison, contestants, traitTemplateId) {
  return {
    traitTemplateId: traitTemplateId,
    voterId: fbId,
    comment: null,
    selected: null,
    comparison: comparison,
    contestants: contestants
  };
};

module.exports = {
  add: modelCRUD.create,
  bulkAdd: modelCRUD.bulkInsert,
  query: modelCRUD.query,
  get: modelCRUD.get,
  submit: submit,
  newVote: newVote,
  //FOR TESTING ONLY
  clear: function* () {
    yield collection.remove({});
  }
};
