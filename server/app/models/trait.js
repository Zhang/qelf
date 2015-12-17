'use strict';

const db = require('../db');
const collection = db.get('trait');
const Joi = require('joi');
const _ = require('lodash');

const TraitSchema = Joi.object().keys({
  _id: Joi.string(),
  id: Joi.string().required(),
  templateId: Joi.string().required(),
  count: Joi.number().required(),
  total: Joi.number().required()
});

const modelCRUD = require('./concerns/modelCRUD')('trait', collection, TraitSchema);
const newTrait = function newTrait(templateId) {
  return {
    templateId: templateId,
    count: 0,
    total: 0
  };
};

const incrementTrait = function(id, incrementCount) {
  const update = _.defaults(
    { total: {$inc: 1} },
    (incrementCount ? {count: {$inc: 1}} : {})
  );
  return collection.update({id: id}, update);
};

module.exports = {
  add: modelCRUD.create,
  update: modelCRUD.update,
  newTrait: newTrait,
  addBulk: modelCRUD.bulkInsert,
  query: modelCRUD.query,
  incrementTrait: incrementTrait
};
