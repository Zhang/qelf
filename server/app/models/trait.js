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
  total: Joi.array().required()
});

const modelCRUD = require('./concerns/modelCRUD')('trait', collection, TraitSchema);
const newTrait = function newTrait(templateId) {
  return {
    templateId: templateId,
    count: 0,
    total: []
  };
};

const incrementTrait = function(id, incrementCount, vote) {
  const update = _.merge({ $push: {total: vote } },
    (incrementCount ? {$inc: {count: 1}} : {})
  );

  return collection.update({id: id}, update);
};

const getFromArrByTemplateId = function(traits, templateId) {
  return collection.findOne({
    id: {$in: traits},
    templateId: templateId
  });
};

module.exports = {
  get: modelCRUD.get,
  add: modelCRUD.create,
  update: modelCRUD.update,
  newTrait: newTrait,
  addBulk: modelCRUD.bulkInsert,
  query: modelCRUD.query,
  incrementTrait: incrementTrait,
  getFromArrByTemplateId: getFromArrByTemplateId,
  //FOR TESTING ONLY
  clear: function* () {
    yield collection.remove({});
  }
};
