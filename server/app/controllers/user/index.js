'use strict';

const app = require('koa')();
const router = require('koa-router')();

router.get('/current', require('./current'));
router.post('/experiments/:id', require('./updateExperiments'));
router.post('/current', require('./current'));
router.post('/', require('./create'));

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
