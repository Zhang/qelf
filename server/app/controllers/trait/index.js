'use strict';

const app = require('koa')();
const router = require('koa-router')();

router.get('/query/:email', require('./query'));

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
