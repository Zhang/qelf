'use strict';

const experimentTemplateModel = require('../models/experimentTemplate');
const _ = require('lodash');

module.exports = function* (user, experiments) {
  const isArray = _.isArray(experiments);
  const arrayedExp = (isArray ? experiments : [experiments]);

  const templates = yield _.map(_.map(arrayedExp, 'templateId'), experimentTemplateModel.get);

  const denormalized = _.map(arrayedExp, function(ex, i) {
    ex.template = templates[i];
    if (user) {
      ex.active = _.find(user.experiments, {id: ex.id}).active;
    }
    return ex;
  });

  if (!isArray) {
    return _.first(denormalized);
  }
  return denormalized;
};
