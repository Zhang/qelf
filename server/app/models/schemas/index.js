'use strict';

const Joi = require('joi');
const TYPES = require('./measureTypes').types;

const UserSchema = Joi.object().keys({
  _id: Joi.string(),
  id: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  experiments: Joi.array().required().items(Joi.object().keys({
    id: Joi.string().required(),
    active: Joi.boolean().required()
  })).description('An array of experiment metadata')
});

const FeedbackSchema = Joi.object().keys({
  _id: Joi.string(),
  id: Joi.string().required(),
  text: Joi.string().required(),
  facebookId: Joi.string().required(),
  email: Joi.string().required().allow('')
});

const ExperimentTemplateSchema = Joi.object().keys({
  _id: Joi.string(),
  id: Joi.string().required(),
  text: Joi.string().required().description('The title of the experiment'),
  procedure: Joi.array().required().description('An array of measure ids'),
  minimumResults: Joi.number().required(),
  resultUnits: Joi.string().required().allow(null)
});

const ExperimentSchema = Joi.object().keys({
  _id: Joi.string(),
  id: Joi.string().required(),
  results: Joi.array().required().items(Joi.string()).description('An array of measure ids'),
  templateId: Joi.string().required().description('The id of the experiment template this experiment stems from'),
  userId: Joi.string().required()
});

const MeasureSchema = Joi.object().keys({
  _id: Joi.string(),
  id: Joi.string().required(),
  type: Joi.string().required().valid(TYPES),
  value: Joi.any().required(),
  experimentId: Joi.string().required(),
  time: Joi.date().required()
});

module.exports = {
  experimentTemplate: ExperimentTemplateSchema,
  user: UserSchema,
  experiment: ExperimentSchema,
  feedback: FeedbackSchema,
  measure: MeasureSchema
};
