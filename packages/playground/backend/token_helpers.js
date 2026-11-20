import moment from 'moment'
import jwt from 'jwt-simple'
import { cfg } from './config.js'

export const permanentRefreshToken = 'eb4e15840117437cbfd7343f257c4aae'

export function createAccessToken(user) {
    const payload = {
        sub: user.id,
        exp: moment().add(cfg.accessTokenExpiresIn, 'seconds').unix(),
        iat: moment().unix(),
        id: user.id,
        email: user.email,
        role: 'user'
    }
    const token = jwt.encode(payload, cfg.jwtSecret)
    return token
}

export function createRefreshToken(user) {
    const refreshPayload = {
        sub: user.id,
        exp: moment().add(cfg.refreshTokenExpiresIn, 'seconds').unix(),
        iat: moment().unix(),
        id: user.id,
        email: user.email,
        role: 'REFRESH_TOKEN'
    }
    const refreshToken = jwt.encode(refreshPayload, cfg.jwtSecret)
    return refreshToken
}
