'use strict';

const db = require('../db');
const COLL = 'user';
const collection = db.get(COLL);
const AccountSchema = require('./schemas')[COLL];

const modelCRUD = require('./concerns/modelCRUD')(COLL, collection, AccountSchema);

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

module.exports = {
  add: add,
  get: modelCRUD.get,
  query: modelCRUD.query,
  updateById: modelCRUD.updateById,
  update: modelCRUD.update,
  //FOR TESTING ONLY
  clear: function* () {
    yield collection.remove({});
  }
};
