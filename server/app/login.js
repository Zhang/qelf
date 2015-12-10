'use strict';

const app = require('koa')();
const router = require('koa-router')();
const authentication = require('./lib/authentication');

router.post('/', function* () {
  const body = this.request.body;
  if (!body.username || !body.password) throw new Error('Login Error');
  yield authentication.login.call(this);
});

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
