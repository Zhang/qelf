'use strict';

const experimentTemplateModel = require('../models/experimentTemplate');
const _ = require('lodash');

module.exports = function* (user, experiments) {
  const templates = yield _.map(_.map(experiments, 'templateId'), experimentTemplateModel.get);

  return _.map(experiments, function(ex, i) {
    ex.template = templates[i];
    if (user) {
      ex.active = _.find(user.experiments, {id: ex.id}).active;
    }
    return ex;
  });
};
