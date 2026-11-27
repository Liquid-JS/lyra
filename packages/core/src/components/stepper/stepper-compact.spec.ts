import { Component, signal, ViewEncapsulation } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { page } from 'vitest/browser'

import { NbStepperModule, NbThemeModule } from '@liquid-js/lyr-core'

@Component({
    // The theme applies in an element with its class.
    template: `
    <div class="nb-theme-default">
      <nb-stepper [compact]="compact()">
        <nb-step label="Problem">One</nb-step>
        <nb-step label="Attempt">Two</nb-step>
        <nb-step label="Notes">Three</nb-step>
      </nb-stepper>
    </div>
  `,
    styleUrl: './stepper-compact.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbStepperModule]
})
class CompactHostComponent {
    readonly compact = signal(true)
}

describe('A stepper on a phone', () => {
    afterEach(() => page.viewport(1280, 800))

    async function render(compact: boolean) {
        await page.viewport(390, 844)
        const fixture = TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] }).createComponent(CompactHostComponent)
        fixture.componentInstance.compact.set(compact)
        fixture.detectChanges()
        await fixture.whenStable()
        const labels = Array.from(fixture.nativeElement.querySelectorAll('.step .label')) as HTMLElement[]
        return labels.map((label) => label.getBoundingClientRect().width > 1)
    }

    it('should show the current step\'s label alone by default', async () => {
        expect(await render(true)).toEqual([true, false, false])
    })

    it('should show every label when it isn\'t compact', async () => {
        expect(await render(false)).toEqual([true, true, true])
    })
})
