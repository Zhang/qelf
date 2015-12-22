'use strict';

const traitModel = require('../../models/trait');
const denormalizeTrait = require('../../services/denormalizeTrait');

const get = function* get() {
  const id = this.params.id;
  const trait = yield traitModel.get(id);
  if (!trait) {
    this.status = 404;
    return;
  }

  const denormalizedTrait = yield denormalizeTrait(trait);
  this.body = denormalizedTrait;
  this.status = 200;
};

/**
 * Exports.
 */

module.exports = get;
