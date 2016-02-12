'use strict';

const experimentTemplateModel = require('../../models/experimentTemplate');

const query = function* query() {
  try {
    const templates = yield experimentTemplateModel.query();

    this.body = templates;
    this.status = 200;
  } catch(e) {
    this.body = e;
    this.status = 500;
  }
};

/**
 * Exports.
 */

module.exports = query;
