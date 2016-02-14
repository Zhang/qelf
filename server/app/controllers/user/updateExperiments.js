'use strict';

const userModel = require('../../models/user');

module.exports = function* updateExperiments() {
  const body = this.request.body;
  const userId = this.params.id;
  yield userModel.updateExperiments(userId, body.templateIds);

  this.status = 200;
};
