'use strict';

const Joi = require('joi');
const _ = require('lodash');

const TYPES = {
  stroop: Joi.object().required(),
  count: Joi.number().required(),
  ratings: Joi.number().required(),
  time: Joi.date().required(),
  multiple: Joi.string().required()
};

module.exports = {
  types: _.keys(TYPES),
  validate: function(type, value) {
    if (TYPES[type]) {
      return Joi.validate(value, TYPES[type]);
    } else {
      throw new Error('Invalid measure type: ', type);
    }
  }
};
