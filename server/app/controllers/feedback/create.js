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
  const email = 'scott'; //this.req.user.email
  const canContact = body.canContact;

  yield feedbackModel.add({
    canContact: canContact,
    email: email,
    text: text
  });

  this.status = 200;
};

/**
 * Exports.
 */

module.exports = create;
