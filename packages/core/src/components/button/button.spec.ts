import { Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NbThemeModule, NbButtonModule, NbButtonComponent, NbIconComponent } from '@liquid-js/lyr-core'

describe('Component: NbButton', () => {

    let fixture: ComponentFixture<NbButtonComponent>

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbButtonModule]
        })

        fixture = TestBed.createComponent(NbButtonComponent)
    })

    it('should set class danger', () => {
        fixture.componentRef.setInput('status', 'danger')
        fixture.detectChanges()
        expect(fixture.nativeElement.classList).toContain('status-danger')
    })

    it('should set size small', () => {
        fixture.componentRef.setInput('size', 'small')
        fixture.detectChanges()
        expect(fixture.nativeElement.classList).toContain('size-small')
    })

    it('should set outline class', () => {
        fixture.componentRef.setInput('outline', true)
        fixture.detectChanges()
        expect(fixture.nativeElement.classList).toContain('appearance-outline')
    })

    it('should set hero class', () => {
        fixture.componentRef.setInput('hero', true)
        fixture.detectChanges()
        expect(fixture.nativeElement.classList).toContain('appearance-hero')
    })

    it('should set shape class', () => {
        fixture.componentRef.setInput('shape', 'semi-round')
        fixture.detectChanges()
        expect(fixture.nativeElement.classList).toContain('shape-semi-round')
    })

    it('should set full-width class', () => {
        fixture.componentRef.setInput('fullWidth', true)
        fixture.detectChanges()
        expect(fixture.nativeElement.classList).toContain('full-width')
    })
})

@Component({
    template: `
    <form (submit)="submitted = submitted + 1; $event.preventDefault()">
      <input name="query" />
      <button nbButton type="submit" [loading]="loading()" (click)="clicks = clicks + 1">
        <nb-icon icon="search" pack="essentials" />
        Search
      </button>
    </form>
  `,
    imports: [NbButtonComponent, NbIconComponent]
})
class LoadingButtonHostComponent {
    readonly loading = signal(false)
    clicks = 0
    submitted = 0
}

describe('Component: NbButton loading', () => {
    let fixture: ComponentFixture<LoadingButtonHostComponent>
    let button: HTMLButtonElement

    const render = async () => {
        fixture.detectChanges()
        await fixture.whenStable()
    }

    beforeEach(async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        fixture = TestBed.createComponent(LoadingButtonHostComponent)
        await render()
        button = fixture.nativeElement.querySelector('button')
    })

    it('should show a spinner and mark the button busy', async () => {
        expect(button.querySelector('.nb-button-spinner')).toBeNull()
        expect(button.hasAttribute('aria-busy')).toBe(false)
        expect(button.getAttribute('aria-disabled')).toBe('false')

        fixture.componentInstance.loading.set(true)
        await render()

        expect(button.querySelector('.nb-button-spinner')?.getAttribute('aria-hidden')).toBe('true')
        expect(button.classList).toContain('btn-loading')
        expect(button.getAttribute('aria-busy')).toBe('true')
        expect(button.getAttribute('aria-disabled')).toBe('true')
    })

    it('should stay enabled and keep focus', async () => {
        button.focus()
        fixture.componentInstance.loading.set(true)
        await render()

        expect(button.disabled).toBe(false)
        expect(button.classList).not.toContain('btn-disabled')
        expect(document.activeElement).toBe(button)
    })

    it('should ignore clicks and not submit its form', async () => {
        fixture.componentInstance.loading.set(true)
        await render()

        // Pressing Enter in a field submits the form the same way, by clicking its submit button.
        button.click()

        expect(fixture.componentInstance.clicks).toBe(0)
        expect(fixture.componentInstance.submitted).toBe(0)
    })

    it('should handle clicks again once loaded', async () => {
        fixture.componentInstance.loading.set(true)
        await render()
        fixture.componentInstance.loading.set(false)
        await render()

        button.click()

        expect(fixture.componentInstance.clicks).toBe(1)
        expect(fixture.componentInstance.submitted).toBe(1)
    })

    it('should not count the spinner as a leading icon', async () => {
        fixture.componentInstance.loading.set(true)
        await render()

        expect(button.classList).toContain('icon-start')
    })
})
