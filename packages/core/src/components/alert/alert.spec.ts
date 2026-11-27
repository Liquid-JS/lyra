import { Component } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NbAlertComponent, NbAlertModule, NbThemeModule } from '@liquid-js/lyr-core'

describe('Component: NbAlert', () => {

    let fixture: ComponentFixture<NbAlertComponent>

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbAlertModule]
        })

        fixture = TestBed.createComponent(NbAlertComponent)
    })

    it('should set class danger', () => {
        fixture.componentRef.setInput('status', 'danger')
        fixture.detectChanges()
        expect(
            fixture
                .debugElement.nativeElement.classList.contains('status-danger'))
            .toBeTruthy()
    })

    it('should be filled by default', () => {
        fixture.detectChanges()
        expect(fixture.nativeElement.classList).toContain('appearance-filled')
    })

    it('should set the appearance', () => {
        fixture.componentRef.setInput('status', 'success')
        fixture.componentRef.setInput('appearance', 'outline')
        fixture.detectChanges()
        expect(fixture.nativeElement.classList).toContain('status-success')
        expect(fixture.nativeElement.classList).toContain('appearance-outline')
    })

    it('should set the appearance with the boolean inputs first', () => {
        fixture.componentRef.setInput('appearance', 'outline')
        fixture.componentRef.setInput('accent', true)
        fixture.detectChanges()
        expect(fixture.nativeElement.classList).toContain('appearance-accent')
        expect(fixture.nativeElement.classList).not.toContain('appearance-outline')

        fixture.componentRef.setInput('outline', true)
        fixture.detectChanges()
        expect(fixture.nativeElement.classList).toContain('appearance-outline')
    })

    it('should set size class', () => {
        fixture.componentRef.setInput('size', 'small')
        fixture.detectChanges()
        expect(
            fixture
                .debugElement.nativeElement.classList.contains('size-small'))
            .toBeTruthy()
    })

    it('should keep inline markup in its line of text', () => {
        TestBed.resetTestingModule()
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot(), NbAlertModule, InlineAlertComponent] })
        const host = TestBed.createComponent(InlineAlertComponent)
        document.body.appendChild(host.nativeElement)
        host.detectChanges()
        const alert = host.nativeElement.querySelector('nb-alert') as HTMLElement
        const strong = alert.querySelector('strong') as HTMLElement
        // One line: the emphasis is as tall as a line of the alert's text, and inside it, not a row of its own.
        expect(alert.getBoundingClientRect().height).toBeLessThan(strong.getBoundingClientRect().height * 2 + 32)
        expect(strong.offsetLeft).toBeGreaterThan(0)
        host.destroy()
    })
})

@Component({
    template: '<nb-alert size="tiny" style="height: auto; width: 40rem">Check <strong>your email</strong> and the safety rules.</nb-alert>',
    imports: [NbAlertModule]
})
class InlineAlertComponent {}

