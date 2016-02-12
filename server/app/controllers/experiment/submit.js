'use strict';

const experimentModel = require('../../models/experiment');

const submit = function* submit() {
  const id = this.params.id;
  const results = this.request.body;
  yield experimentModel.submit(id, results);

  this.status = 200;
};

module.exports = submit;
