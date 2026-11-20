import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'

import { NbThemeModule, NbProgressBarModule, NbProgressBarComponent } from '@liquid-js/lyr-core'

describe('Component: NbProgressBar', () => {

    let fixture: ComponentFixture<NbProgressBarComponent>

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbProgressBarModule]
        })

        fixture = TestBed.createComponent(NbProgressBarComponent)
    })

    it('Setting value 50 should set width to 50%', () => {
        fixture.componentRef.setInput('value', 50)
        fixture.detectChanges()
        expect(
            fixture
                .debugElement
                .query(By.css('.progress-value')).nativeElement.style.width)
            .toBe('50%')
    })

    it('should be a progressbar with its value, within 0 and 100', () => {
        const host: HTMLElement = fixture.nativeElement
        fixture.componentRef.setInput('value', 40)
        fixture.detectChanges()
        expect(host.getAttribute('role')).toBe('progressbar')
        expect(host.getAttribute('aria-valuemin')).toBe('0')
        expect(host.getAttribute('aria-valuemax')).toBe('100')
        expect(host.getAttribute('aria-valuenow')).toBe('40')

        fixture.componentRef.setInput('value', 140)
        fixture.detectChanges()
        expect(host.getAttribute('aria-valuenow')).toBe('100')
    })

    it('should be named "Progress", or by its aria-label', () => {
        const host: HTMLElement = fixture.nativeElement
        fixture.detectChanges()
        expect(host.getAttribute('aria-label')).toBe('Progress')
        fixture.componentRef.setInput('aria-label', 'Upload')
        fixture.detectChanges()
        expect(host.getAttribute('aria-label')).toBe('Upload')
    })

    it('Setting status danger should set class danger', () => {
        fixture.componentRef.setInput('status', 'danger')
        fixture.detectChanges()
        expect(fixture.nativeElement.classList).toContain('status-danger')
    })

    it('Setting size should set class', () => {
        fixture.componentRef.setInput('size', 'small')
        fixture.detectChanges()
        expect((fixture.nativeElement as HTMLElement).classList).toContain('size-small')
    })

    it('Setting displayValue should create span with value label', () => {
        fixture.componentRef.setInput('value', 40)
        fixture.componentRef.setInput('displayValue', true)
        fixture.detectChanges()
        expect(
            fixture
                .debugElement
                .query(By.css('.progress-value span')).nativeElement.innerHTML)
            .toContain('40%')
    })

})
