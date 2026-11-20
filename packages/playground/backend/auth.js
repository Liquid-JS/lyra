import { Passport } from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { users } from './users.js';
import { cfg } from './config.js';
const passport = new Passport();
var params = {
  secretOrKey: cfg.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

export function createAuth() {
  var strategy = new Strategy(params, function (payload, done) {
    var user = users[payload.sub -1 ] || null;
    if (user) {
      return done(null, {
        id: user.id
      });
    } else {
      return done(new Error('User not found'), null);
    }
  });
  passport.use(strategy);
  return {
    initialize: function () {
      return passport.initialize();
    },
    authenticate: function () {
      return passport.authenticate('jwt', cfg.jwtSession);
    }
  };
};
