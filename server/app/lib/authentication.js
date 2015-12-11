'use strict';

const session = require('koa-session-store');
const mongoStore = require('koa-session-mongo');
const db = require('../db');
const passport = require('koa-passport');
const accountModel = require('../models/account');
const LocalStrategy = require('passport-local').Strategy;
const co = require('co');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  co(function* () {
    const user = yield accountModel.get(id);
    done(null, user);
  });
});

passport.use(new LocalStrategy(function (email, password, done) {
  co(function* () {
    const account = yield accountModel.getByEmail(email);
    console.log(account);
    if (account && account.password === password) return done(null, account);

    done(null, false);
  });
}));

module.exports = {
  initialize: function(app) {
    app.keys = ['secrsset'];
    app.use(session({
      cookie: {
        maxAge: 10000000,
        httpOnly: false
      },
      store: mongoStore.create({
        db: db.driver,
        collection: 'sessions'
      })
    }));

    app.use(passport.initialize());
    app.use(passport.session());
  },
  passport: passport,
  isAuthenticated: function* (next) {
    if (this.isAuthenticated()) {
      yield next;
    } else {
      throw new Error('Authentication error');
    }
  },
  login: function () {
    const self = this;
    return passport.authenticate('local', function* (err, user) {
      if (err) throw err;
      if (user === false) {
        throw new Error('Authentication error');
      } else {
        self.status = 201;
        self.body = user;
        yield self.login(user);
      }
    });
  }
};

