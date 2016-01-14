'use strict';

const traits = require('../bin/traits');
const expect = require('expect.js');
const co = require('co');
const testUtils = require('./testUtils');
const traitTemplateModel = require('../app/models/traitTemplate');
const _ = require('lodash');

describe('Trait Importing', function() {
  beforeEach(testUtils.clearAll);
  it('should add all default traits', function(done) {
    co(function *() {
      yield traits.addDefault();
      const addedTraits = yield traitTemplateModel.query({
        id: { $in: _.map(traits.defaultTraits, 'id') }
      });

      expect(addedTraits).to.have.length(traits.defaultTraits.length);
      done();
    }).catch(function(e) {
      console.error('error adding traits', e);
      done(e);
    });
  });
});
