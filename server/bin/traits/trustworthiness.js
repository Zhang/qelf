'use strict';

module.exports = {
  model: require('../../app/models/traitTemplate'),
  template: {
    id: 'trustworthiness',
    comparisons: [
      'If told a secret in confidence, is likely to keep your secret safe'
    ]
  }
};
