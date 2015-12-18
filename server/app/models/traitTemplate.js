'use strict';

const db = require('../db');
const collection = db.get('traitTemplate');
const Joi = require('joi');

const TraitTemplateSchema = Joi.object().keys({
  _id: Joi.string(),
  id: Joi.string().required(),
  comparisons: Joi.array().required()
});

const modelCRUD = require('./concerns/modelCRUD')('traitTemplate', collection, TraitTemplateSchema);

module.exports = {
  addOrUpdate: modelCRUD.addOrUpdate,
  get: modelCRUD.get,
  query: modelCRUD.query,
  //FOR TESTING ONLY
  clear: function* () {
    yield collection.remove({});
  }
};
