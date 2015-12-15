'use strict';

const fs = require('fs');
const async = require('async');
const co = require('co');

fs.readdir(__dirname, function(err, files) {
  async.map(files, function(fileName, cb) {
    if (fileName === 'index.js') return cb();
    co(function* () {
      const traitConfig = require('./' + fileName);
      const trait = yield traitConfig.model.addOrUpdate(traitConfig.template);
      cb(null, trait);
    });
  }, function(err, res) {
    if (err) {
      console.log('error adding traits');
      throw err;
    }
    console.log('Completed importing trait templates', res);
  });
});
