'use strict';

const session = require('koa-session-store');
const mongoStore = require('koa-session-mongo');
const db = require('../db');
const passport = require('koa-passport');
const accountModel = require('../models/account');
const FacebookStrategy = require('passport-facebook-token');
const co = require('co');
const logger = require('../logger');

passport.serializeUser(function(user, done) {
  if (user && user.id) {
    done(null, user.id);
  } else {
    throw new Error('Missing user or user id');
  }
});

passport.deserializeUser(function (id, done) {
  co(function* () {
    try {
      const user = yield accountModel.get(id);
      if (user) {
        done(null, user);
      } else {
        done(new Error('No user'));
      }
    } catch(e) {
      done(e);
    }
  });
});

passport.use(new FacebookStrategy({
  clientID: '201708533509741', //FACEBOOK_APP_ID
  clientSecret: '2815fd63ddaf3161387ec1ef760b66a7', //FACEBOOK_APP_SECRET
}, function (accessToken, refreshToken, profile, done) {
  co(function* () {
    let account = yield accountModel.getByFacebookId(profile.id);
    if (!account) {
      logger.warn('No such account: ', profile);
      return done(null, false);
    }
    if (account.accessToken !== accessToken) {
      yield accountModel.updateById(account.id, {
        accessToken: accessToken
      });
      account = yield accountModel.getByFacebookId(profile.id);
    }

    done(null, account);
  });
}));

module.exports = {
  initialize: function(app) {
    app.keys = ['secrsset'];
    app.use(session({
      cookie: {
        maxAge: 1000000000,
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
        logger.error('Authentication error: ', info);
        self.status = 403;
      } else {
        self.status = 200;
        self.body = user;
        yield self.login(user);
      }
    });
  }
};
