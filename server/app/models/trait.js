'use strict';

const db = require('../db');
const collection = db.get('trait');
const Joi = require('joi');

const TraitSchema = Joi.object().keys({
  _id: Joi.string(),
  id: Joi.array().required(),
  votes: Joi.array().required(),
  templateId: Joi.string().required(),
  count: Joi.number().required()
});

const modelCRUD = require('./concerns/modelCRUD')('trait', collection, TraitSchema);

module.exports = {
  add: modelCRUD.create
};
