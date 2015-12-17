'use strict';

const trustworthiness = require('../bin/traits/trustworthiness');
const traits = require('../bin/traits');
const expect = require('expect.js');
const co = require('co');

describe('Trait Importing', function() {
  describe('Adding Traits', function() {
    it('should add traits', function(done) {
      co(function *() {
        traits.addDefault();
        const addedTrait = yield trustworthiness.model.get(trustworthiness.template.id);
        expect(addedTrait.id).to.be(trustworthiness.template.id);
        expect(addedTrait.comparisons).to.have.length(trustworthiness.template.comparisons.length);
        done();
      });
    });
  });
});
