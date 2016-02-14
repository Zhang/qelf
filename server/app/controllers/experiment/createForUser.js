'use strict';

const experimentModel = require('../../models/experiment');
const _ = require('lodash');

const submit = function* submit() {
  const userId = this.params.id;
  const templateIds = this.request.body.templateIds;

  yield _.map(templateIds, function(id) {
    return experimentModel.makeExperimentForUser(userId, id);
  });

  this.status = 200;
};

module.exports = submit;
