'use strict';

const app = require('koa')();
const router = require('koa-router')();

router.get('/user/:id', require('./getByUser'));
router.post('/submit/:id', require('./submit'));
router.post('/create/:id', require('./createForUser'));
router.post('/deactivate/:id', require('./deactivateForUser'));
router.get('/results/:id', require('./results'));
router.get('/:id', require('./get'));

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
