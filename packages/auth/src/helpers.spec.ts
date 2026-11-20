import { HttpHeaders } from '@angular/common/http'

import { nbOptionsFactory } from './auth.module'
import { defaultAuthOptions } from './auth.options'
import { deepExtend } from './helpers'

describe('deepExtend', () => {
    it('should merge object literals into a copy, and keep instances of other classes whole', () => {
        const headers = new HttpHeaders({ Accept: 'application/json' })
        const created = new Date(2020, 0, 1)
        const defaults = { login: { method: 'post', endpoint: '/login' } }

        const merged = deepExtend({}, defaults, { login: { endpoint: '/sign-in' }, headers, created, list: [headers] })

        expect(merged.login).toEqual({ method: 'post', endpoint: '/sign-in' })
        expect(defaults.login.endpoint).toBe('/login')
        expect(merged.headers).toBe(headers)
        expect(merged.list[0]).toBe(headers)
        expect(merged.created).toEqual(created)
        expect(merged.created).not.toBe(created)
    })
})

describe('nbOptionsFactory', () => {
    it('should leave the shared defaults as they are', () => {
        const before = JSON.stringify(defaultAuthOptions)

        const options = nbOptionsFactory({ forms: { login: { redirectDelay: 0 } } })

        expect(options.forms.login.redirectDelay).toBe(0)
        expect(JSON.stringify(defaultAuthOptions)).toBe(before)
        expect(nbOptionsFactory().forms.login.redirectDelay).toBe(defaultAuthOptions.forms.login.redirectDelay)
    })
})
