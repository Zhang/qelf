'use strict';

const accountModel = require('../../models/account');
const viewComponents = require('../../models/schemas').viewComponents;
const _ = require('lodash');
const logger = require('../../logger');

const current = function* current() {
  const body = this.request.body;
  const acctId = body.id;
  const component = body.component;
  if(_.contains(viewComponents, component)) {
    try {
      yield accountModel.setComponentViewed(acctId, component);
      this.body = 200;
    } catch(e) {
      logger.error(e);
      this.body = e.message;
      this.status = 500;
    }
  } else {
    this.status = 400;
    this.body = 'Unknown component ' + component;
  }
};

module.exports = current;
