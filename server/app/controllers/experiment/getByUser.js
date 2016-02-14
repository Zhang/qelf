'use strict';

const experimentModel = require('../../models/experiment');
const userModel = require('../../models/user');
const denormalizeExperiments = require('../../services/denormalizeExperiments');

const get = function* get() {
  const userId = this.params.id;
  const experiments = yield experimentModel.query({userId: userId});
  const user = yield userModel.get(this.params.id);

  const denormalizedExperiments = yield denormalizeExperiments(user, experiments);

  this.body = denormalizedExperiments;
  this.status = 200;
};

/**
 * Exports.
 */

module.exports = get;
