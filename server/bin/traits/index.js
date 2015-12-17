'use strict';

const _ = require('lodash');
const fs = require('fs');
const co = require('co');

let defaultTraits;
fs.readdirSync(__dirname, function(err, files) {
  defaultTraits = _.map(files, function(file) {
    if (file === 'index.js') return;
    return require('./' + file);
  });
});

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
