'use strict';

const request = require('koa-request');
const FB_API_HOST = 'graph.facebook.com/v2.5/';
const _ = require('lodash');

const get = function* (fbId, access_token, route, opts) {
  const qs = _.defaults({
    access_token: access_token
  }, opts || {});
  const options = {
      url: 'https://' + FB_API_HOST + fbId + '/' + route,
      qs: qs,
      headers: { 'User-Agent': 'request' }
  };

  const response = yield request(options);
  return JSON.parse(response.body);
};

const getFriends = function* getFriends(facebookId, access_token) {
  const res = yield get(facebookId, access_token, 'friends');
  return res.data;
};

const getPicture = function* getPicture(facebookId, access_token) {
  const res = yield get(facebookId, access_token, 'picture', {type: 'large', redirect: false});
  return res.data.url;
};

module.exports = {
  getPicture: getPicture,
  getFriends: getFriends
};
