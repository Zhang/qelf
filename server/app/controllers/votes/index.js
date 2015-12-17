'use strict';

const app = require('koa')();
const router = require('koa-router')();

router.get('/:facebookId', require('./query'));
router.post('/:id', require('./submit'));

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
