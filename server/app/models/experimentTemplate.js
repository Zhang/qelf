'use strict';

const COLL = 'experimentTemplate';
const db = require('../db');
const collection = db.get(COLL);
const ExperimentTemplateSchema = require('./schemas')[COLL];

const modelCRUD = require('./concerns/modelCRUD')(COLL, collection, ExperimentTemplateSchema);

module.exports = {
  addOrUpdate: modelCRUD.addOrUpdate,
  get: modelCRUD.get,
  query: modelCRUD.query,
  //FOR TESTING ONLY
  clear: function* () {
    yield collection.remove({});
  }
};
