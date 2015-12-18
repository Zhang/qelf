'use strict';

const db = require('../db');
const collection = db.get('vote');
const Joi = require('joi');

const VoteSchema = Joi.object().keys({
  _id: Joi.string(),
  id: Joi.string().required(),
  traitTemplateId: Joi.string().required(),
  contestants: Joi.array(Joi.string().description('facebookId of contestant')).required(),
  comparison: Joi.string().required(),
  selected: Joi.string().required().allow(null)
});

const modelCRUD = require('./concerns/modelCRUD')('vote', collection, VoteSchema);

const submit = function* submit(id, selected) {
  yield modelCRUD.updateById(id, {
    selected: selected
  });
};

module.exports = {
  add: modelCRUD.create,
  bulkAdd: modelCRUD.bulkInsert,
  query: modelCRUD.query,
  get: modelCRUD.get,
  submit: submit,
  //FOR TESTING ONLY
  clear: function* () {
    yield collection.remove({});
  }
};
