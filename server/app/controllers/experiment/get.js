'use strict';

const experimentModel = require('../../models/experiment');
const denormalizeExperiments = require('../../services/denormalizeExperiments');

const get = function* get() {
  const id = this.params.id;
  const experiment = yield experimentModel.get(id);
  if (!experiment) {
    this.status = 404;
    return;
  }

  const denormalizedExperiment = yield denormalizeExperiments(null, [experiment]);
  this.body = denormalizedExperiment[0];
  this.status = 200;
};

/**
 * Exports.
 */

module.exports = get;
