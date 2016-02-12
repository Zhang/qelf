'use strict';

const experimentModel = require('../../models/experiment');
const denormalizeExperiments = require('../../services/denormalizeExperiments');

const get = function* get() {
  const userId = this.params.userId;
  const experiments = yield experimentModel.query({userId: userId});
  if (!experiments) {
    this.status = 404;
    return;
  }

  const denormalizedExperiments = yield denormalizeExperiments(experiments);
  this.body = denormalizedExperiments;
  this.status = 200;
};

/**
 * Exports.
 */

module.exports = get;
