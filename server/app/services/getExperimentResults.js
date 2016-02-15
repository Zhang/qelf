'use strict';

const _ = require('lodash');
const measureModel = require('../models/measure');
const moment = require('moment');
module.exports = function* (experiment) {
  const results = yield measureModel.query({experimentId: {$in: experiment.id}});
  console.log(results);
  const keys = _.unique(_.map(results, 'measured.value'));
  const measuredType = _.get(_.first(results), 'measured.type');
  const outcomeType = _.get(_.first(results), 'outcome.type');

  function getSummary() {
    if (!results.length) {
      return [{
        label: 'No current measurements'
      }];
    }
    if (outcomeType === 'stroop') {
      return [{
        label: 'Average Accuracy',
        value: Math.floor(_.sum(results, 'outcome.value.correct') / _.sum(results, 'outcome.value.total') * 100) + '%'
      },
      {
        label: 'Average Reaction Time',
        value: Math.floor(_.sum(results, 'outcome.value.reactionTime') / results.length) + ' ms'
      }];
    } else {
      return [
      {
        label: 'Average Value',
        value: Math.floor(_.sum(results, 'outcome.value') / results.length)
      }];
    }
  }
  const allKeys = {
    stroop: [{
      text: 'Reaction Time in ms',
      value: 'reactionTime'
    },
    {
      text: 'Accuracy in %',
      value: 'accuracy'
    }]
  };
  const outcomeKeys = allKeys[outcomeType] || [{
    text: 'Average Count',
    value: 'count'
  }];

  return {
    outcomeKeys: outcomeKeys,
    summary: getSummary(),
    outcomes: _.map(keys, function(key) {
      const pertinentMeasures = _.filter(results, function(res) {
        return res.measured.value === key;
      });
      const formattedKey = (function() {
        const formatted = measuredType === 'time' ? moment(key).format('h:mm a') : key;
        return formatted + (experiment.template.resultUnits ? ' ' + experiment.template.resultUnits : '');
      })();
      if (outcomeType === 'stroop') {
        return {
          text: formattedKey,
          score: {
            reactionTime: Math.floor(_.sum(pertinentMeasures, 'outcome.value.reactionTime') / pertinentMeasures.length),
            accuracy: Math.floor(_.sum(pertinentMeasures, 'outcome.value.correct') / _.sum(pertinentMeasures, 'outcome.value.total') * 100)
          }
        };
      } else if (outcomeType === 'time') {
        return {
          text: moment(formattedKey).format('h:mm a'),
          score: {
            count: Math.floor(_.sum(pertinentMeasures, 'outcome.value') / pertinentMeasures.length)
          }
        };
      } else {
        return {
          text: formattedKey,
          score: {
            count: Math.floor(_.sum(pertinentMeasures, 'outcome.value') / pertinentMeasures.length)
          }
        };
      }
    })
  };
};
