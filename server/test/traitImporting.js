'use strict';

const trustworthiness = require('../bin/traits/trustworthiness');
const addTraits = require('../bin/traits');
const expect = require('expect.js');
const co = require('co');

describe('Trait Importing', function() {
  describe('Adding Traits', function() {
    it('should add traits', function(done) {
      co(function *() {
        addTraits(
          co(function *(err) {
            expect(err).to.be(undefined);
            const addedTrait = yield trustworthiness.model.get(trustworthiness.template.id);
            return addedTrait;
          })
          .then(function resolve(res) {
            console.log(res);
            expect(res.id).to.be.ok();
            expect(res.comparisons).to.have.length(trustworthiness.template.comparisons.length);
            done();
          }, function reject(err) {
            console.log(err);
            throw err;
          })
        );
      });
    });
  });
});
