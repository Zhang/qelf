'use strict';

const session = require('koa-session-store');
const mongoStore = require('koa-session-mongo');
const db = require('../db');
const passport = require('koa-passport');
const accountModel = require('../models/account');
const FacebookStrategy = require('passport-facebook-token');
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

passport.use(new FacebookStrategy({
  clientID: '409640992567240', //FACEBOOK_APP_ID
  clientSecret: '6b4b58114c18d90a2c5f62bb98f595c4', //FACEBOOK_APP_SECRET
}, function (accessToken, refreshToken, profile, done) {
  co(function* () {
    console.log(accessToken, refreshToken, profile);
    let account = yield accountModel.getByFacebookId(profile.id);
    if (account.accessToken !== accessToken) {
      account = yield accountModel.update(account.id, {
        accessToken: accessToken
      });
    }
    //if (account && account.password === password) return done(null, account);
    done(null, account);
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
    return passport.authenticate('facebook-token', function* (err, user, info) {
      if (err) throw err;
      if (user === false) {
        console.log('Authentication error: ', info);
        self.status = 403;
      } else {
        self.status = 200;
        self.body = user;
        yield self.login(user);
      }
    });
  }
};
