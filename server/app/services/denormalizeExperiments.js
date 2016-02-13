'use strict';

const experimentTemplateModel = require('../models/experimentTemplate');
const _ = require('lodash');

module.exports = function* (experiments) {
  const templates = yield _.map(experiments, experimentTemplateModel.get);

  return _.map(experiments, function(ex, i) {
    ex.template = templates[i];
    return ex;
  });
};
