'use strict';

const app = require('koa')();
const router = require('koa-router')();

router.get('/user/:id', require('./getByUser'));
router.post('/:id', require('./submit'));
router.get('/:id', require('./get'));

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
