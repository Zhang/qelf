'use strict';

const traits = require('../scripts/traits');
const expect = require('expect.js');
const co = require('co');
const testUtils = require('./testUtils');
const traitTemplateModel = require('../app/models/traitTemplate');
const _ = require('lodash');

describe('Trait Importing', function() {
  beforeEach(testUtils.clearAll);
  it('should add all default traits', co.wrap(function* () {
    yield traits.addDefault();
    const addedTraits = yield traitTemplateModel.query({
      id: { $in: _.map(traits.defaultTraits, 'id') }
    });

    expect(addedTraits).to.have.length(traits.defaultTraits.length);
  }));
});
