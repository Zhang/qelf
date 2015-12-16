'use strict';

const app = require('koa')();
const router = require('koa-router')();
const authentication = require('./lib/authentication');

router.post('/', function* () {
  yield authentication.login.call(this);
});

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
