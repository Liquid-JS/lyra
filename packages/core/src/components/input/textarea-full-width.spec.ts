import { Component, ViewEncapsulation } from '@angular/core'
import { TestBed } from '@angular/core/testing'

import { NbInputModule, NbThemeModule } from '@liquid-js/lyr-core'

@Component({
    // The theme applies in an element with its class; a field's parts, each on its own line.
    template: `
    <div class="nb-theme-default" style="width: 16rem">
      <textarea nbInput fullWidth placeholder="Notes"></textarea>
      <p class="hint">Shown to the lender.</p>
    </div>
  `,
    styleUrl: './input-alignment.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbInputModule]
})
class TextareaHostComponent {}

describe('A full-width textarea', () => {
    it('should leave no room under it before the next line', async () => {
        const fixture = TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] }).createComponent(TextareaHostComponent)
        fixture.detectChanges()
        await fixture.whenStable()
        const element = fixture.nativeElement as HTMLElement
        const textarea = (element.querySelector('textarea') as HTMLElement).getBoundingClientRect()
        const hint = element.querySelector('.hint') as HTMLElement
        hint.style.margin = '0'
        expect(hint.getBoundingClientRect().top).toBeCloseTo(textarea.bottom, 0)
    })
})
