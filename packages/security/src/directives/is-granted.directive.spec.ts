import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { BehaviorSubject, Observable } from 'rxjs'

import { NbAccessChecker, NbIsGrantedDirective } from '@liquid-js/lyr-security'

@Component({
    template: '<p *nbIsGranted="permission()">Granted</p>',
    imports: [NbIsGrantedDirective]
})
class NbIsGrantedTestComponent {
    readonly permission = signal<[string, string]>(['view', 'news'])
}

describe('NbIsGrantedDirective', () => {
    let grants: Record<string, BehaviorSubject<boolean>>

    beforeEach(() => {
        grants = { news: new BehaviorSubject(true), users: new BehaviorSubject(false) }
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: NbAccessChecker,
                    useValue: { isGranted: (_: string, resource: string): Observable<boolean> => grants[resource] }
                }
            ]
        })
    })

    it('should render the content while the permission is granted', () => {
        const fixture = TestBed.createComponent(NbIsGrantedTestComponent)
        fixture.detectChanges()
        expect(fixture.nativeElement.textContent).toContain('Granted')

        grants['news'].next(false)
        fixture.detectChanges()
        expect(fixture.nativeElement.textContent).not.toContain('Granted')
    })

    it('should follow only the latest permission', () => {
        const fixture = TestBed.createComponent(NbIsGrantedTestComponent)
        fixture.detectChanges()

        fixture.componentInstance.permission.set(['view', 'users'])
        fixture.detectChanges()
        expect(fixture.nativeElement.textContent).not.toContain('Granted')

        // The check for the previous resource no longer shows the content.
        grants['news'].next(true)
        fixture.detectChanges()
        expect(fixture.nativeElement.textContent).not.toContain('Granted')
    })
})
