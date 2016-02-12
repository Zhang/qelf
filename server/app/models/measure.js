'use strict';

const COLL = 'measure';
const db = require('../db');
const collection = db.get(COLL);
const ExperimentTemplateSchema = require('./schemas')[COLL];
const modelCRUD = require('./concerns/modelCRUD')(COLL, collection, ExperimentTemplateSchema);
const logger = require('../logger');

const typeValidation = require('schemas/measureTypes').validate;
const add = function* (measure) {
  const measuredValidity = typeValidation(measure.measured.type, measure.measured.value);
  const outcomeValidity = typeValidation(measure.outcome.type, measure.outcome.value);
  const err = measuredValidity.error || outcomeValidity.error;
  if (err) {
    const invalid = measuredValidity.error ? measure.measured : measure.outcome;
    logger.error('Invalid value: ', invalid.value, 'for: ', invalid.type);
    throw err.error;
  }

  const added = yield* modelCRUD.create(measure);
  return added;
};

module.exports = {
  add: add,
  //FOR TESTING ONLY
  clear: function* () {
    yield collection.remove({});
  }
};
