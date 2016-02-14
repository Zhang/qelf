'use strict';

const db = require('../db');
const COLL = 'user';
const collection = db.get(COLL);
const UserSchema = require('./schemas')[COLL];
const _ = require('lodash');

const modelCRUD = require('./concerns/modelCRUD')(COLL, collection, UserSchema);
const experimentModel = require('./experiment');

const getByEmail = function* getByEmail(email) {
  const user = yield collection.findOne({email: email});
  return user;
};

const add = function* add(toAdd) {
  const existingUser = yield collection.findOne({
    email: toAdd.email
  });

  if (existingUser) {
    this.status = 400;
    throw new Error('attempting to add duplicate user', existingUser);
  }

  const added = yield* modelCRUD.create(toAdd);
  return added;
};

const updateExperiments = function* (userId, templateIds) {
  const user = yield modelCRUD.get(userId);
  const newExperiments = _.filter(templateIds, function(id) {
    return !_.find(user.experiments, {templateId: id});
  });
  const addedExperiments = yield _.map(newExperiments, function(id) {
    return experimentModel.makeExperimentForUser(userId, id);
  });

  const updatedExperiments = _.map(user.experiments, function(ex) {
    ex.active = _.contains(templateIds, ex.templateId);
    return ex;
  }).concat(_.map(addedExperiments, function(ex) {
    return {
      id: ex.id,
      active: true,
      templateId: ex.templateId
    };
  }));

  yield modelCRUD.updateById(userId, {experiments: updatedExperiments});
};

module.exports = {
  add: add,
  get: modelCRUD.get,
  query: modelCRUD.query,
  getByEmail: getByEmail,
  updateExperiments: updateExperiments,
  updateById: modelCRUD.updateById,
  update: modelCRUD.update,
  //FOR TESTING ONLY
  clear: function* () {
    yield collection.remove({});
  }
};
