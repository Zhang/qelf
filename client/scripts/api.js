'use strict';

(function() {
  var module = angular.module('api', []);
  module.service('HttpHelper', function($http, ENV) {
    return {
      post: function(url, json) {
        return $http.post(ENV.apiEndpoint + url, json);
      },
      get: function(url) {
        return $http.get(ENV.apiEndpoint + url);
      },
    };
  });

  module.service('AccountAPI', function(HttpHelper) {
    return {
      create: function(facebookId, access_token) {
        return HttpHelper.post('account', { facebookId: facebookId, access_token: access_token });
      },
      get: function(id) {
        return HttpHelper.get('account/' + encodeURIComponent(id));
      },
      getCurrentUser: function() {
        return HttpHelper.get('account/current');
      },
      setViewed: function(id, component) {
        return HttpHelper.post('account/viewed', { id: id, component: component });
      },
    };
  });

  module.service('SessionAPI', function(HttpHelper) {
    return {
      login: function(facebookId, access_token) {
        return HttpHelper.post('login', { facebookId: facebookId, access_token: access_token });
      },
      logout: function() {
        return HttpHelper.post('logout');
      }
    };
  });

  module.service('FeedbackAPI', function(HttpHelper, $rootScope) {
    return {
      create: function(feedbackText, email) {
        return HttpHelper.post('feedback', { email: email, facebookId: $rootScope.user.facebookId, feedbackText: feedbackText });
      }
    };
  });

  module.service('TraitAPI', function(HttpHelper) {
    return {
      getForUser: function(facebookId) {
        return HttpHelper.get('trait/query/' + facebookId);
      },
      getTrait: function(id) {
        return HttpHelper.get('trait/' + id);
      }
    };
  });

  module.service('VoteAPI', function(HttpHelper) {
    return {
      getForUser: function(facebookId) {
        return HttpHelper.get('vote/' + facebookId);
      },
      submit: function(voteId, selectedFbId, score) {
        return HttpHelper.post('vote/' + voteId, { selected: selectedFbId, score: score });
      }
    };
  });
  module.service('ExperimentsAPI', function() {
    function getUnqiueVariants(results) {
      return _.uniq(_.filter(results, function(res) {
        return !!res.variant;
      }), function(res) {
        return res.value;
      });
    }
    function getScores(variants, results, scoreCalc) {
      return _.map(variants, function(variable) {
        var pertinentResults = _.filter(results, function(res) {
          console.log(_.find(res, {value: variable.value}));
          return !!_.find(res, {value: variable.value});
        });

        var resultValues = _.filter(_.flatten(pertinentResults), function(res) {
          return res.id === variable.variant;
        });

        return {
          text: variable.value,
          score: scoreCalc(resultValues)
        };
      });
    }
    var experiments = [{
      id: 'music',
      text: 'What is the best music for me to work to?',
      dataPoints: 4,
      minimumDatapoints: 10,
      ranking: {
        text: 'Best Music To Work With',
        getScores: function(results) {
          if (!results) return [];
          var flatResults = _.flatten(results);
          var variants = getUnqiueVariants(flatResults);
          return getScores(variants, results, function(resultValues) {
            return Math.floor(_.sum(resultValues, 'value.reactionTime') / resultValues.length);
          });
        }
      },
      results: [],
      trackers: [{
        text: 'instruction',
        instructions: 'These are the instructions you shall follow, and these are the things you must do. first put on rap song',
        presetValue: 'rap',
        variant: 'stroop1'
      }, {
        text: 'instruction',
        instructions: 'To do the stroop, you have to do these things.',
      }, {
        id: 'stroop1',
        text: 'stroop'
      }]
    }, {
      id: 'wake',
      text: 'Waking up vs productivity?',
      dataPoints: 4,
      minimumDatapoints: 10,
      ranking: {
        text: 'Best time to wake up',
        getScores: function(results) {
          if (!results) return [];
          var flatResults = _.flatten(results);
          var variants = getUnqiueVariants(flatResults);
          return getScores(variants, results, function(resultValues) {
            return _.sum(resultValues, 'value') / resultValues.length;
          });
        }
      },
      results: [],
      trackers: [{
        text: 'time',
        countOf: 'When did you wake up?',
        label: '',
        variant: 'count1'
      }, {
        id: 'count1',
        text: 'count',
        countOf: 'How many pomodoros did you do today?',
        label: 'pomodoros'
      }]
    }, {
      id: 'food',
      text: 'Time eaten vs focus?',
      dataPoints: 4,
      minimumDatapoints: 10,
      ranking: {
        text: 'Most focused hour',
        getScores: function(results) {
          if (!results) return [];
          var flatResults = _.flatten(results);
          var variants = getUnqiueVariants(flatResults);
          return getScores(variants, results, function(resultValues) {
            return Math.floor(_.sum(resultValues, 'value.reactionTime') / resultValues.length);
          });
        }
      },
      results: [],
      trackers: [{
        text: 'count',
        countOf: 'How many hours has it been since you\'ve eaten a meal?',
        label: 'hour since last meal',
        variant: 'stroop1'
      }, {
        text: 'instruction',
        instructions: 'You have to do this focus test now'
      }, {
        id: 'stroop1',
        text: 'stroop'
      }]
    }];

    return {
      getExperiment: function(id) {
        return _.find(experiments, {id: id});
      },
      submit: function(id, res) {
        var exp = _.find(experiments, {id: id});
        exp.results.push(res);
      },
      get: function() {
        return experiments;
      }
    };
  });
})();
