import { TestBed } from '@angular/core/testing'
import { of } from 'rxjs'
import { NbAccessChecker, NbRoleProvider, provideNbSecurity } from '@liquid-js/lyr-security'

describe('provideNbSecurity', () => {
    it('should provide the access checker with the ACL options without the module', () => new Promise<void>((done) => {
        TestBed.configureTestingModule({
            providers: [
                provideNbSecurity({ accessControl: { guest: { view: 'news' } } }),
                { provide: NbRoleProvider, useValue: { getRole: () => of('guest') } }
            ]
        })

        TestBed.inject(NbAccessChecker).isGranted('view', 'news').subscribe((granted) => {
            expect(granted).toBe(true)
            done()
        })
    }))
})
