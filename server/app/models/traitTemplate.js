'use strict';

const db = require('../db');
const collection = db.get('traitTemplate');
const TraitTemplateSchema = require('./schemas').traitTemplate;

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
