'use strict';

const _ = require('lodash');
const experimentTemplateModel = require('../../app/models/experimentTemplate');
const defaults = [
  {
    id: 'WakingTimeVsProductivity',
    text: 'How does the hour at which I wake up effect my productivity?',
    proceedure: ['wake-up-time', 'productivity-measure']
  }
];

module.exports = {
  defaultTraits: defaults,
  addDefault: function* () {
    yield experimentTemplateModel.clear();
    yield _.map(defaults, function(trait) {
      return experimentTemplateModel.addOrUpdate(trait);
    });
  }
};
