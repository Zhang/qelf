'use strict';

const Joi = require('joi');
const uuid = require('uuid');
const _ = require('lodash');

function validate(obj, schema, collectionName) {
  const validity = Joi.validate(obj, schema);
  if (validity.error) {
    console.log('Invalid ' + collectionName + ' object: ', JSON.stringify(obj));
    console.log('Error: ', validity.error);
    throw validity.error;
  }
}

module.exports = function(collectionName, collection, schema) {
  function bulkUpdate(ids, updateParams) {
    return collection.update({id: {$in: ids}}, {$set: updateParams}, {multi: true});
  }
  return {
    bulkInsert: function* bulkInsert(toAdd) {
      try {
        const toAddWithIds = (function() {
          return _.map(toAdd, function(v) {
            const val = _.cloneDeep(v);
            val.id = v.id || uuid.v4();
            return val;
          });
        })();

        _.each(toAddWithIds, function(v) {
          validate(v, schema, collectionName);
        });
        yield collection.insert(toAddWithIds);
        return toAddWithIds;
      } catch (err) {
        console.error('error attempting to bulk insert ' + collectionName + ':', err);
      }
    },
    create: function* create(toAdd) {
      try {
        const existingId = toAdd.id;
        toAdd.id = existingId || uuid.v4();

        validate(toAdd, schema, collectionName);
        if (existingId) {
          const existingObj = yield collection.find({id: existingId});
          if (existingObj) throw new Error('attempted to add duplicate object');
        }

        yield collection.insert(toAdd);
        return toAdd;
      } catch (err) {
        console.error('error attempting to create ' + collectionName + ':', err);
        throw err;
      }
    },
    addOrUpdate: function addOrUpdate(obj) {
      validate(obj, schema, collectionName);
      return collection.update({id: obj.id}, obj, {upsert: true});
    },
    get: function get(id) {
      return collection.findOne({id: id});
    },
    bulkUpdate: bulkUpdate,
    updateById: function updateById(id, updateParams) {
      return bulkUpdate([id], updateParams);
    },
    update: function* update(query, updateParams) {
      yield collection.update(query, {$set: updateParams});
    },
    query: function query(params) {
      params = params || {};
      const optKeys = ['sort', 'limit', 'offset'];
      const opts = _.pick(params, optKeys);
      const filter = _.omit(params, optKeys);

      const q = collection.find(filter);

      if (opts.limit) {
        q.limit(opts.limit);
      }

      return q;
    }
  };
};
