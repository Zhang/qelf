'use strict';

const db = require('../db');
const COLL = 'feedback';
const collection = db.get(COLL);
const FeedbackSchema = require('./schemas')[COLL];

const modelCRUD = require('./concerns/modelCRUD')(COLL, collection, FeedbackSchema);

module.exports = {
  add: modelCRUD.create
};
