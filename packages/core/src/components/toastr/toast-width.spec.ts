import { Component, inject, ViewEncapsulation } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { page } from 'vitest/browser'

import { NbThemeModule, NbToastrModule, NbToastrService } from '@liquid-js/lyr-core'

@Component({
    // The theme applies in an element with its class: here the body's, as the toasts' overlay is outside the host.
    template: '',
    styleUrl: './toast-width.spec.scss',
    encapsulation: ViewEncapsulation.None
})
class ToastWidthHostComponent {
    readonly toastr = inject(NbToastrService)
}

describe('A toast on a phone', () => {
    afterEach(async () => {
        document.body.classList.remove('nb-theme-default', 'toast-width-host')
        await page.viewport(1280, 800)
    })

    it('should stay inside the window, beside the toasts\' offset from its sides', async () => {
        await page.viewport(390, 844)
        document.body.classList.add('nb-theme-default', 'toast-width-host')
        const fixture = TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot(), NbToastrModule.forRoot()] }).createComponent(ToastWidthHostComponent)
        fixture.detectChanges()
        fixture.componentInstance.toastr.show('You\'re in with Priya and Sam. Cancel up to 2 hours before.', 'Booked: Saturday, 6:30 PM', { status: 'success', duration: 0 })
        fixture.detectChanges()
        await fixture.whenStable()
        await expect.poll(() => document.querySelector('nb-toast')).toBeTruthy()
        const box = (document.querySelector('nb-toast') as HTMLElement).getBoundingClientRect()
        expect(box.right).toBeLessThanOrEqual(390 - 24 + 0.5)
        expect(box.left).toBeGreaterThanOrEqual(24 - 0.5)
        fixture.destroy()
    })
    it('should keep its width on a wider screen', async () => {
        document.body.classList.add('nb-theme-default', 'toast-width-host')
        const fixture = TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot(), NbToastrModule.forRoot()] }).createComponent(ToastWidthHostComponent)
        fixture.detectChanges()
        fixture.componentInstance.toastr.show('Saved.', 'Done', { duration: 0 })
        fixture.detectChanges()
        await fixture.whenStable()
        await expect.poll(() => document.querySelector('nb-toast')).toBeTruthy()
        expect((document.querySelector('nb-toast') as HTMLElement).getBoundingClientRect().width).toBeCloseTo(434, 0)
        fixture.destroy()
    })
})
