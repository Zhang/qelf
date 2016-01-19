'use strict';

const log = require('./logger');
const bodyParser = require('koa-bodyparser');
const koa = require('koa');
const route = require('koa-route');
const mount = require('koa-mount');
const devLogger = require('koa-logger');
const cors = require('kcors');
const authentication = require('./lib/authentication');
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
app.use(devLogger());
authentication.initialize(app);
app.on('error', function(err) {
  log.error(err);
});
/**
 * Routes.
 */
app.use(mount('/login', require('./login')));
app.use(mount('/account', require('./controllers/account')));
app.use(mount('/trait', require('./controllers/trait')));
app.use(mount('/feedback', require('./controllers/feedback')));
app.use(mount('/vote', require('./controllers/votes')));
app.use(route.post('/logout', function *() {
  this.session = null;
  this.body = null;
  this.status = 200;
}));
/**
 * Exports.
 */

module.exports = app;
