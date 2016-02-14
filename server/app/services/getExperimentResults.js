'use strict';

const _ = require('lodash');
const measureModel = require('../models/measure');

module.exports = function* (experiment) {
  const results = yield measureModel.query({id: {$in: experiment.results}});
  const keys = _.unique(_.map(results, 'measured.value'));
  const type = _.get(_.first(results), 'outcome.type');

  function getSummary() {
    if (!results.length) {
      return [{
        label: 'No current measurements'
      }];
    }
    if (type === 'stroop') {
      return [{
        label: 'Average Accuracy',
        value: Math.floor(_.sum(results, 'outcome.value.correct') / _.sum(results, 'outcome.value.total') * 100) + '%'
      },
      {
        label: 'Average Reaction Time',
        value: Math.floor(_.sum(results, 'outcome.value.reactionTime') / results.length)
      }];
    } else {
      return [
      {
        label: 'Average Value',
        value: Math.floor(_.sum(results, 'outcome.value') / results.length)
      }];
    }
  }

  return {
    summary: getSummary(),
    outcomes: _.map(keys, function(key) {
      const pertinentMeasures = _.filter(results, function(res) {
        return res.measured.value === key;
      });

      if (type === 'stroop') {
        return {
          text: key,
          score: Math.floor(_.sum(pertinentMeasures, 'outcome.value.reactionTime') / pertinentMeasures.length)
        };
      } else {
        return {
          text: key,
          score: Math.floor(_.sum(pertinentMeasures, 'outcome.value') / pertinentMeasures.length)
        };
      }
    })
  };
};
