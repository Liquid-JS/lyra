import { Passport } from 'passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { users } from './users.js'
import { cfg } from './config.js'
const passport = new Passport()
const params = {
    secretOrKey: cfg.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

export function createAuth() {
    const strategy = new Strategy(params, (payload, done) => {
        const user = users[payload.sub -1 ] || null
        if (user) {
            return done(null, {
                id: user.id
            })
        } else {
            return done(new Error('User not found'), null)
        }
    })
    passport.use(strategy)
    return {
        initialize: () => passport.initialize(),
        authenticate: () => passport.authenticate('jwt', cfg.jwtSession)
    }
};
