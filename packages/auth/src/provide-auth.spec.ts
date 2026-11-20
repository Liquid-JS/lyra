import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideRouter } from '@angular/router'
import { NbAuthService, NbDummyAuthStrategy, provideNbAuth } from '@liquid-js/lyr-auth'

describe('provideNbAuth', () => {
    it('should provide the auth service and the configured strategies without the module', () => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideRouter([]),
                provideNbAuth({ strategies: [NbDummyAuthStrategy.setup({ name: 'dummy' })] })
            ]
        })

        expect(TestBed.inject(NbAuthService)).toBeTruthy()
        expect(TestBed.inject(NbDummyAuthStrategy).getName()).toBe('dummy')
    })
})
