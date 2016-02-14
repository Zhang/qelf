'use strict';

const experimentModel = require('../../models/experiment');
const _ = require('lodash');

const deactivate = function* submit() {
  const userId = this.params.id;
  const templateIds = this.request.body.templateIds;

  yield _.map(templateIds, function(id) {
    return experimentModel.deactivateByTemplateId(userId, id);
  });

  this.status = 200;
};

module.exports = deactivate;
