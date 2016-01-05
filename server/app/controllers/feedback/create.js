'use strict';

/**
 * Module dependencies.
 */

const feedbackModel = require('../../models/feedback');
const nodemailer = require('nodemailer');

if (!process.env.SUPPORT_EMAIL || !process.env.SUPPORT_PASSWORD) {
  console.error('MISSING SUPPORT EMAIL AND PASSWORD, FEEDBACK WILL NOT SEND EMAILS');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.SUPPORT_EMAIL,
      pass: process.env.SUPPORT_PASSWORD
  }
});
const accountModel = require('../../models/account');
/**
 * upload a photo. Handles multipart uploads only.
 */
const create = function* create() {
  try {
    const body = this.request.body;
    const text = body.feedbackText;
    const facebookId = body.facebookId;

    const vals = yield [
      accountModel.getByFacebookId(facebookId),
      feedbackModel.add({
        facebookId: facebookId,
        text: text
      })
    ];

    if (process.env.NODE_ENV !== 'test') {
      const account = vals[0];
      transporter.sendMail({
        from: 'scottzhang235@gmail.com',
        to: 'scottzhang235@gmail.com',
        subject: 'I GOTZ APP FEEDBACK',
        text: text + ' USER OBJECT: ' + JSON.stringify(account)
      }, function() {
        console.log('node email cb arguments: ', arguments);
      });
    }

    this.status = 200;
  } catch (e) {
    console.error('error sending feedback', e);
    this.status = 500;
  }
};

/**
 * Exports.
 */

module.exports = create;

