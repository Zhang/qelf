'use strict';

const app = require('koa')();
const router = require('koa-router')();

router.get('/query/:facebookId', require('./query'));
router.get('/:id', require('./get'));

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
