'use strict';

const _ = require('lodash');
const experimentTemplateModel = require('../../app/models/experimentTemplate');

const defaults = [
  {
    id: 'WakingTimeVsProductivity',
    text: 'How does the hour at which I wake up effect my productivity?',
    procedure: [
      {
        type: 'count',
        countOf: 'How many hours has it been since you\'ve eaten a meal?',
        label: 'hour since last meal',
        variant: 'stroop1'
      }, {
        type: 'instruction',
        text: 'You have to do this focus test now'
      }, {
        id: 'stroop1',
        type: 'stroop'
      }
    ]
  }
];

module.exports = {
  defaultExperimentIds: _.map(defaults, 'id'),
  addDefault: function* () {
    yield experimentTemplateModel.clear();
    yield _.map(defaults, function(trait) {
      return experimentTemplateModel.addOrUpdate(trait);
    });
  }
};
