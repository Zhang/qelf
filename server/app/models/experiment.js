'use strict';

const COLL = 'experiment';
const db = require('../db');
const collection = db.get(COLL);
const ExperimentSchema = require('./schemas')[COLL];
const modelCRUD = require('./concerns/modelCRUD')(COLL, collection, ExperimentSchema);
const experimentTemplateModel = require('./experimentTemplate');
const measureModel = require('./measure');

const submit = function* (id, res) {
  const measure = yield measureModel.add(res);

  yield collection.update({id: id}, {$push: {results: measure.id}});
};

const makeExperimentForUser = function* addExperiment(userId, templateId) {
  const experimentTemplate = yield experimentTemplateModel.get(templateId);
  if (experimentTemplate) {
    const newExperiment = {
      results: [],
      userId: userId,
      templateId: templateId
    };
    const experiment = yield modelCRUD.create(newExperiment);
    return experiment;
  } else {
    throw new Error('attempting to create an experiment without a template. TemplateId of: ', templateId);
  }
};

module.exports = {
  addOrUpdate: modelCRUD.addOrUpdate,
  get: modelCRUD.get,
  query: modelCRUD.query,
  submit: submit,
  makeExperimentForUser: makeExperimentForUser,
  //FOR TESTING ONLY
  clear: function* () {
    yield collection.remove({});
  }
};
