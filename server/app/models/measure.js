'use strict';

const COLL = 'measure';
const db = require('../db');
const collection = db.get(COLL);
const ExperimentTemplateSchema = require('./schemas')[COLL];
const modelCRUD = require('./concerns/modelCRUD')(COLL, collection, ExperimentTemplateSchema);
const logger = require('../logger');

const typeValidation = require('./schemas/measureTypes').validate;

module.exports = {
  bulkAdd: modelCRUD.bulkInsert,
  query: modelCRUD.query,
  //FOR TESTING ONLY
  clear: function* () {
    yield collection.remove({});
  }
};
