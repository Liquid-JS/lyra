import { Component, NgZone, ɵNoopNgZone as NoopNgZone } from '@angular/core'
import { TestBed } from '@angular/core/testing'

@Component({
    selector: 'nb-zoneless-child',
    template: '{{ value }}'
})
class NbZonelessChildComponent {
    value = 'initial'
}

@Component({
    template: '<nb-zoneless-child />',
    imports: [NbZonelessChildComponent]
})
class NbZonelessHostComponent {}

describe('test environment', () => {
    it('should run change detection without zone.js', () => {
        expect('Zone' in globalThis).toBe(false)
        expect(TestBed.inject(NgZone)).toEqual(expect.any(NoopNgZone))
    })

    it('should not refresh a view nothing marked dirty', () => {
        const fixture = TestBed.createComponent(NbZonelessHostComponent)
        fixture.detectChanges()
        const child = fixture.debugElement.children[0].componentInstance as NbZonelessChildComponent

        child.value = 'changed'

        expect(() => fixture.detectChanges()).toThrow(/NG0100/)
    })
})
