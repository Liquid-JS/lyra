import express from 'express'
import jwt from 'jwt-simple'
import moment from 'moment'
import { createAuth } from './auth.js'
import * as auth_helpers from './auth_helpers.js'
import { users } from './users.js'
import * as tokens from './token_helpers.js'
import { wines } from './wines.js'
import { cfg } from './config.js'

const app = express()
const auth = createAuth()

app.use(express.json())
app.use(express.urlencoded({ extended: true })) // support encoded bodies
app.use(auth.initialize())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, HEAD')
    next()
})

app.get('/', (req, res) => {
    res.json({
        status: 'OK!'
    })
})

app.get('/api/user', auth.authenticate(), (req, res) => {
    res.json({
        data: users[req.user.id - 1]
    })
})

app.get('/api/wines', auth.authenticate(), (req,res) => {
    res.json(wines)
})

app.post('/api/auth/login', (req, res) => {

    if (req.body.email && req.body.password) {
        const email = req.body.email
        const password = req.body.password
        const user = users.find((u) => u.email === email && u.password === password)
        if (user) {
            return res.json({
                data: {
                    message: 'Successfully logged in!',
                    token: tokens.createAccessToken(user)
                }
            })
        }
    }
    return res.status(401).json({
        data: {
            error: 'Login/password combination is not correct'
        }
    })
})

app.post('/api/auth/token', (req, res) => {

    if (req.body.username && req.body.password) {
        const email = decodeURIComponent(req.body.username)
        const password = req.body.password
        const user = users.find((u) => u.email === email && u.password === password)
        if (user) {
            return res.json({
                token_type: 'Bearer',
                access_token: tokens.createAccessToken(user),
                expires_in: cfg.accessTokenExpiresIn,
                refresh_token: tokens.createRefreshToken(user)
            })
        }
    }
    return res.status(401).json({
        error: 'invalid_client',
        error_description: 'Invalid Login/Password combination.'
    })
})

app.post('/api/auth/register', (req, res) => {

    if (req.body.email && req.body.password && req.body.password === req.body.confirmPassword) {
        const user = {
            id: 2
        }
        if (user) {
            const payload = {
                id: user.id,
                email: user.email,
                role: 'user'
            }
            const token = jwt.encode(payload, cfg.jwtSecret)
            return res.json({
                data: {
                    message: 'Successfully registered!',
                    token
                }
            })
        }
    }
    return res.status(401).json({
        data: {
            error: 'Something went wrong while registering your account. Please check the form and try again.'
        }
    })
})

app.post('/api/auth/request-pass', (req, res) => res.json({
    data: {
        message: 'Email with instruction has been sent!'
    }
}))

app.put('/api/auth/reset-pass', (req, res) => {

    if (req.body.reset_password_token) {
        return res.json({
            data: {
                message: 'Password successfully reset!'
            }
        })
    }
    return res.status(401).json({
        data: {
            error: 'Token is not correct.'
        }
    })
})

app.delete('/api/auth/logout', (req, res) => res.json({
    data: {
        message: 'Successfully logged out!'
    }
}))

app.post('/api/auth/refresh-token', (req, res) => {

    // token issued by oauth2 strategy
    if (req.body.refresh_token) {
        const token = req.body.refresh_token
        const parts = token.split('.')
        if (parts.length !== 3) {
            return res.status(401).json({
                error: 'invalid_token',
                error_description: 'Invalid refresh token'
            })
        }
        const payload = JSON.parse(auth_helpers.urlBase64Decode(parts[1]))
        const exp = payload.exp
        const userId = payload.sub
        const now = moment().unix()
        if (now > exp) {
            return res.status(401).json({
                error: 'unauthorized',
                error_description: 'Refresh Token expired.'
            })
        } else {
            return res.json({
                token_type: 'Bearer',
                access_token: tokens.createAccessToken(users[userId - 1]),
                expires_in: cfg.accessTokenExpiresIn
            })
        }
    }

    // token issued via email strategy
    if (req.body.token) {
        return res.json({
            data: {
                message: 'Successfully refreshed token!',
                token: tokens.createAccessToken(users[0])
            }
        })
    };

})

app.listen(4400, () => {
    console.log('Lyra sample API is running on 4400')
})

export { app }
