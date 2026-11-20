import { Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NbThemeModule, NbSpinnerModule, NbSpinnerComponent } from '@liquid-js/lyr-core'

describe('Component: NbSpinner', () => {

    let spinner: NbSpinnerComponent
    let fixture: ComponentFixture<NbSpinnerComponent>

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbSpinnerModule]
        })

        fixture = TestBed.createComponent(NbSpinnerComponent)
        spinner = fixture.componentInstance
    })

    it('should set class danger', () => {
        fixture.componentRef.setInput('status', 'danger')
        fixture.detectChanges()
        expect(
            fixture
                .debugElement.nativeElement.classList.contains('status-danger'))
            .toBeTruthy()
    })

    it('should set size small', () => {
        fixture.componentRef.setInput('size', 'small')
        fixture.detectChanges()
        expect(
            fixture
                .debugElement.nativeElement.classList.contains('size-small'))
            .toBeTruthy()
    })

    it('should set message', () => {
        fixture.componentRef.setInput('message', 'Loading your content...')
        fixture.detectChanges()
        expect(
            fixture
                .debugElement.nativeElement.querySelector('.message').textContent)
            .toEqual(spinner.message())
    })

    it('should announce its message, or "Loading..." without one', () => {
        const host: HTMLElement = fixture.nativeElement
        fixture.componentRef.setInput('message', 'Saving')
        fixture.detectChanges()
        expect(host.getAttribute('role')).toBe('status')
        expect(host.getAttribute('aria-label')).toBeNull()
        expect(host.querySelector('.spin-circle')?.getAttribute('aria-hidden')).toBe('true')

        fixture.componentRef.setInput('message', '')
        fixture.detectChanges()
        expect(host.getAttribute('aria-label')).toBe('Loading...')
    })

    it('should not have message tab when no message', () => {
        fixture.componentRef.setInput('message', '')
        fixture.detectChanges()
        expect(
            fixture
                .debugElement.nativeElement.querySelector('.message'))
            .toBeNull()
    })
})

@Component({
    template: '<div [nbSpinner]="loading()" [nbSpinnerMessage]="message()" nbSpinnerStatus="danger"></div>',
    imports: [NbSpinnerModule]
})
class NbSpinnerDirectiveTestComponent {
    readonly loading = signal(true)
    readonly message = signal<string | undefined>('Loading')
}

describe('Directive: NbSpinner', () => {
    it('should apply inputs bound after nbSpinner and follow later changes', () => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbSpinnerModule, NbSpinnerDirectiveTestComponent]
        })
        const fixture = TestBed.createComponent(NbSpinnerDirectiveTestComponent)
        fixture.detectChanges()
        const spinner: HTMLElement = fixture.nativeElement.querySelector('nb-spinner')
        expect(spinner.textContent).toContain('Loading')
        expect(spinner.classList).toContain('status-danger')

        fixture.componentInstance.message.set('Almost there')
        fixture.detectChanges()
        expect(spinner.textContent).toContain('Almost there')
    })

    it('should show no message without one', () => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbSpinnerModule, NbSpinnerDirectiveTestComponent]
        })
        const fixture = TestBed.createComponent(NbSpinnerDirectiveTestComponent)
        fixture.componentInstance.message.set(undefined)
        fixture.detectChanges()

        expect(fixture.nativeElement.querySelector('nb-spinner .message')).toBeNull()
    })

    it('should mark what it covers as busy while it shows', () => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbSpinnerModule, NbSpinnerDirectiveTestComponent]
        })
        const fixture = TestBed.createComponent(NbSpinnerDirectiveTestComponent)
        fixture.detectChanges()
        const container: HTMLElement = fixture.nativeElement.querySelector('div')
        expect(container.getAttribute('aria-busy')).toBe('true')

        fixture.componentInstance.loading.set(false)
        fixture.detectChanges()
        expect(container.hasAttribute('aria-busy')).toBe(false)
    })
})
