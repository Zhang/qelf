'use strict';

/**
 * Module dependencies.
 */

const bodyParser = require('koa-bodyparser');
const koa = require('koa');
const route = require('koa-route');
const mount = require('koa-mount');
const logger = require('koa-logger');
const cors = require('kcors');
const authentication = require('./lib/authentication');

/**
 * App instance.
 */

const app = koa();

/**
 * Global middleware.
 */

app.use(bodyParser({
  formLimit: '10mb'
}));
app.use(cors({
  credentials: true
}));
app.use(logger());
authentication.initialize(app);
/**
 * Routes.
 */
app.use(mount('/login', require('./login')));
app.use(mount('/account', require('./controllers/account')));
app.use(route.post('/logout', function *() {
  this.session = null;
  this.body = null;
  this.status = 200;
}));
/**
 * Exports.
 */

module.exports = app;
