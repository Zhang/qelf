'use strict';

const traits = require('./traits');
const co = require('co');

function addDefaults() {
  co(function* () {
    yield traits.addDefault();
  });
}

addDefaults();
