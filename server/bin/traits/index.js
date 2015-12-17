'use strict';

const _ = require('lodash');
const fs = require('fs');
const co = require('co');

const files = fs.readdirSync(__dirname);
const defaultTraits = _.reduce(files, function(total, file) {
  if (file === 'index.js') return total;
  return total.concat(require('./' + file));
}, []);

module.exports = {
  defaultTraits: defaultTraits,
  addDefault: function() {
    _.each(defaultTraits, function(traitConfig) {
      co(function* () {
        yield traitConfig.model.addOrUpdate(traitConfig.template);
      });
    });
  }
};
