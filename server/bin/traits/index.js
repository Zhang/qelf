'use strict';

const _ = require('lodash');
const fs = require('fs');
const q = require('q');

function getFiles() {
  var deferred = q.defer();
  fs.readdir(__dirname, function(err, files) {
    console.log(err, files);
    if (err) return deferred.reject(err);
    deferred.resolve(files);
  });
  return deferred.promise;
}

module.exports = function *() {
  const files = yield getFiles().then(function(res) {
    return res;
  });
    console.log(files);
  _.map(files, function *(file) {
    if (file === 'index.js') return;
    const traitConfig = require('./' + file);
    const added = yield traitConfig.model.addOrUpdate(traitConfig.template);
  });
};
