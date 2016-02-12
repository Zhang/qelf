'use strict';

const COLL = 'experiment';
const db = require('../db');
const collection = db.get(COLL);
const ExperimentSchema = require('./schemas')[COLL];
const modelCRUD = require('./concerns/modelCRUD')(COLL, collection, ExperimentSchema);

const measureModel = require('measureModel');
const submit = function* (id, res) {
  const measure = yield measureModel.add(res);

  yield collection.update({id: id}, {results: {$push: measure.id}});
};

module.exports = {
  addOrUpdate: modelCRUD.addOrUpdate,
  get: modelCRUD.get,
  query: modelCRUD.query,
  submit: submit,
  //FOR TESTING ONLY
  clear: function* () {
    yield collection.remove({});
  }
};
