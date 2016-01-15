'use strict';

const db = require('../db');
const collection = db.get('trait');
const _ = require('lodash');
const TraitSchema = require('./schemas').trait;
const co = require('co');
const modelCRUD = require('./concerns/modelCRUD')('trait', collection, TraitSchema);
const newTrait = function newTrait(templateId, themes) {
  return {
    templateId: templateId,
    count: 0,
    themes: themes || [],
    total: []
  };
};

const incrementTrait = function(id, incrementCount, vote) {
  const update = _.merge({ $push: {total: vote.id } },
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
co(function* () {
  var traits = yield modelCRUD.query({});
  // console.log(traits);
  console.log(_.sum(traits, 'count'));
});
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
