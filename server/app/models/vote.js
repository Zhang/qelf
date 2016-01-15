'use strict';

const db = require('../db');
const collection = db.get('vote');
const VoteSchema = require('./schemas').vote;
const modelCRUD = require('./concerns/modelCRUD')('vote', collection, VoteSchema);

const submit = function* submit(id, selected, score) {
  const vote = yield modelCRUD.get(id);
  if (vote.selected || vote.score) {
    throw new Error('Attempting to re-submit completed vote', vote);
  } else {
    const updated = yield collection.findAndModify({
      query: {id: id},
      update: {
        $set: {
          selected: selected,
          score: score
        }
      },
      new: true
    });
    return updated;
  }
};

const newVote = function(fbId, comparison, contestants, traitTemplateId) {
  return {
    traitTemplateId: traitTemplateId,
    voterId: fbId,
    selected: null,
    score: null,
    comparison: comparison,
    contestants: contestants
  };
};

module.exports = {
  add: modelCRUD.create,
  bulkAdd: modelCRUD.bulkInsert,
  query: modelCRUD.query,
  get: modelCRUD.get,
  submit: submit,
  newVote: newVote,
  //FOR TESTING ONLY
  clear: function* () {
    yield collection.remove({});
  }
};
