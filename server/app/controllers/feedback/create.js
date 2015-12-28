'use strict';

/**
 * Module dependencies.
 */

const feedbackModel = require('../../models/feedback');

/**
 * upload a photo. Handles multipart uploads only.
 */
const create = function* create() {
  const body = this.request.body;
  const text = body.feedbackText;
  const facebookId = body.facebookId;

  yield feedbackModel.add({
    facebookId: facebookId,
    text: text
  });

  this.status = 200;
};

/**
 * Exports.
 */

module.exports = create;
