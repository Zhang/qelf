'use strict';

const experimentModel = require('../../models/experiment');
const getExperimentResult = require('../../services/getExperimentResults');

const get = function* get() {
  const experimentId = this.params.id;
  const experiment = yield experimentModel.get(experimentId);
  if (!experiment) {
    this.status = 404;
    this.body = new Error('No experiment with id: ', experimentId);
  } else {
    const result = yield getExperimentResult(experiment);
    this.body = result;
    this.status = 200;
  }
};

/**
 * Exports.
 */

module.exports = get;
