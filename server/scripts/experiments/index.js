'use strict';

const _ = require('lodash');
const experimentTemplateModel = require('../../app/models/experimentTemplate');

const defaults = [
  {
    id: 'TimeEatenVsProductivity',
    text: 'How does the hour at which I wake up effect my productivity?',
    minimumResults: 10,
    procedure: [
      {
        type: 'count',
        text: 'How many hours has it been since you\'ve eaten a meal?',
        label: 'hour since last meal',
        measured: true
      }, {
        type: 'instruction',
        text: 'You have to do this focus test now'
      }, {
        outcome: true,
        type: 'stroop'
      }
    ]
  },
  {
    id: 'WakingTimeVsProductivity',
    text: 'How does when I woke up effect my productivity?',
    minimumResults: 10,
    procedure: [
      {
        type: 'time',
        text: 'When did you wake up?',
        measured: true
      }, {
        outcome: true,
        type: 'count',
        text: 'How many pomodoros did you do today?',
        label: 'pomodoros'
      }
    ]
  },
  {
    id: 'MusicVsProductivity',
    text: 'Am I more focused when I listen to music I\'m familiar with?',
    minimumResults: 10,
    procedure: [
      {
        type: 'multiple',
        choices: [
          'Familiar Song',
          'Unfamiliar Song'
        ],
        text: 'What are you listening to?',
        measured: true
      },
      {
        type: 'instruction',
        text: 'You have to do this focus test now'
      }, {
        outcome: true,
        type: 'stroop',
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
