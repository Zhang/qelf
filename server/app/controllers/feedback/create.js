'use strict';

/**
 * Module dependencies.
 */

const feedbackModel = require('../../models/feedback');
const nodemailer = require('nodemailer');
const logger = require('../../logger');
const _ = require('lodash');

if (!process.env.SUPPORT_EMAIL || !process.env.SUPPORT_PASSWORD) {
  logger.error('MISSING SUPPORT_EMAIL AND SUPPORT_PASSWORD, FEEDBACK WILL NOT SEND EMAILS');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.SUPPORT_EMAIL,
      pass: process.env.SUPPORT_PASSWORD
  }
});
const userModel = require('../../models/user');
/**
 * upload a photo. Handles multipart uploads only.
 */
const create = function* create() {
  try {
    const body = this.request.body;
    const text = body.feedbackText;

    const user = yield userModel.getByFacebookId(_.get(this.session, 'passport.user'));
    yield feedbackModel.add({
      text: text,
      email: user.email
    });

    if (process.env.NODE_ENV !== 'test') {
      transporter.sendMail({
        from: 'scottzhang235@gmail.com',
        to: 'scottzhang235@gmail.com',
        subject: 'I GOTZ APP FEEDBACK',
        text: text + ' EMAIL: ' + user.email + ' USER OBJECT: ' + JSON.stringify(user)
      }, function() {
        logger.info('node email cb arguments: ', arguments);
      });
    }

    this.status = 200;
  } catch (e) {
    logger.error('error sending feedback', e);
    this.status = 500;
  }
};

/**
 * Exports.
 */

module.exports = create;

