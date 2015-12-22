'use strict';

const traits = require('./traits');
const expect = require('expect.js');

var addDefaults = traits.addDefault();
addDefaults.next();
expect(addDefaults.next().done).to.be.ok();
process.exit(0);
