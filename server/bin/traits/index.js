'use strict';

const _ = require('lodash');
const fs = require('fs');
const traitTemplateModel = require('../../app/models/traitTemplate');
const files = fs.readdirSync(__dirname);
const defaultTraits = _.reduce(files, function(total, file) {
  if (file === 'index.js') return total;
  return total.concat(require('./' + file));
}, []);

module.exports = {
  defaultTraits: defaultTraits,
  addDefault: function* () {
    yield _.map(defaultTraits, function(traitConfig) {
      return traitTemplateModel.addOrUpdate(traitConfig.template);
    });
  }
};
