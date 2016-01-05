'use strict';

const db = require('../db');
const collection = db.get('feedback');
const FeedbackSchema = require('./schemas').feedback;

const modelCRUD = require('./concerns/modelCRUD')('account', collection, FeedbackSchema);

module.exports = {
  add: modelCRUD.create
};
