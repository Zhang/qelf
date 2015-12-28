'use strict';

const db = require('../db');
const collection = db.get('feedback');
const Joi = require('joi');

const FeedbackSchema = Joi.object().keys({
  _id: Joi.string(),
  id: Joi.string().required(),
  text: Joi.string().required(),
  facebookId: Joi.string().required()
});

const modelCRUD = require('./concerns/modelCRUD')('account', collection, FeedbackSchema);

module.exports = {
  add: modelCRUD.create
};
