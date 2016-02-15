'use strict';

const _ = require('lodash');
const experimentTemplateModel = require('../../app/models/experimentTemplate');

const pomodoroInstruction = {
  type: 'instruction',
  text: 'Tap the button that corresponds to the COLOR of the word. R for red, P for purple, G for green'
};
const defaults = [
  {
    id: 'TimeEatenVsProductivity',
    text: 'How is my focus effected by the last time I ate?',
    minimumResults: 15,
    procedure: [
      {
        type: 'count',
        text: 'How many hours has it been since you\'ve eaten a meal?',
        label: 'hour since last meal',
        measured: true
      },
      pomodoroInstruction, {
        outcome: true,
        type: 'stroop'
      }
    ]
  },
  {
    id: 'TimeToCloseFriend',
    text: 'Number of conversations I have vs. friends I make',
    minimumResults: 1,
    procedure: [
      {
        type: 'multiple',
        choices: [
          'Less than 1 month',
          '1 - 3 Months',
          '3 - 6 Months',
          '6 Months +'
        ],
        text: 'For the last friend you made, how long had you known them before becoming friends?',
        measured: true
      }, {
        outcome: true,
        type: 'count',
        text: 'How many times had you talked to this person before becoming friends?',
        label: 'conversations'
      }
    ]
  },
  {
    id: 'WakingTimeVsProductivity',
    text: 'How does when I woke up effect my productivity?',
    minimumResults: 20,
    procedure: [
      {
        type: 'time',
        text: 'When did you wake up today?',
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
    minimumResults: 15,
    procedure: [
      {
        type: 'multiple',
        choices: [
          'Familiar Song',
          'Unfamiliar Song'
        ],
        text: 'I am listening to a(n) ...',
        measured: true
      },
      pomodoroInstruction,
      {
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
