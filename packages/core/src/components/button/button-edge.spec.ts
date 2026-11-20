import { Component, signal, ViewEncapsulation } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { assert } from 'vitest'

import { NbButtonModule, NbIconModule, NbThemeModule } from '@liquid-js/lyr-core'

@Component({
    // The theme applies in an element with its class; a row of each size and appearance, its padding the content's edge.
    template: `
    <div class="nb-theme-default" [attr.dir]="dir()">
      @for (size of sizes; track size) {
      @for (appearance of appearances; track appearance) {
      <div class="edge-row" [attr.data-size]="size">
        <button nbButton [size]="size" [appearance]="appearance" edge="start">Back</button>
        <button nbButton [size]="size" [appearance]="appearance" edge="end" aria-label="Close">
          <nb-icon icon="close-outline" pack="essentials" />
        </button>
      </div>
      }
      }
      @for (size of sizes; track size) {
      <div class="inline-row">
        <span class="title">Title</span>
        <button nbButton ghost inline [size]="size">See all</button>
        <button nbButton ghost inline [size]="size" aria-label="Close">
          <nb-icon icon="close-outline" pack="essentials" />
        </button>
      </div>
      }
    </div>
  `,
    styleUrl: './button-edge.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbButtonModule, NbIconModule]
})
class EdgeHostComponent {
    readonly sizes = ['tiny', 'small', 'medium', 'large', 'giant'] as const
    readonly appearances = ['ghost', 'filled', 'hero'] as const
    readonly dir = signal<'ltr' | 'rtl'>('ltr')
}

describe('A button with an edge', () => {
    async function render(dir: 'ltr' | 'rtl') {
        const fixture = TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbIconModule]
        }).createComponent(EdgeHostComponent)
        fixture.componentInstance.dir.set(dir)
        fixture.detectChanges()
        await fixture.whenStable()
        return fixture.nativeElement as HTMLElement
    }

    /** Each row's content edges, its label's box and its icon's. */
    function rows(element: HTMLElement) {
        return [...element.querySelectorAll<HTMLElement>('.edge-row')].map((row) => {
            const box = row.getBoundingClientRect()
            const style = getComputedStyle(row)
            const [label, close] = row.querySelectorAll('button')
            const text = document
                .createTreeWalker(label, NodeFilter.SHOW_TEXT, {
                    acceptNode: (node) => (node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP)
                })
                .nextNode()
            assert(text)
            const range = document.createRange()
            range.selectNodeContents(text)
            const icon = close.querySelector('nb-icon')
            assert(icon)
            return {
                size: row.dataset['size'],
                start: box.left + parseFloat(style.paddingLeft),
                end: box.right - parseFloat(style.paddingRight),
                label: range.getBoundingClientRect(),
                icon: icon.getBoundingClientRect()
            }
        })
    }

    it('should line up its label or icon with the content, whatever its size and border', async () => {
        for (const { start, end, label, icon } of rows(await render('ltr'))) {
            expect(label.left).toBeCloseTo(start, 0)
            expect(icon.right).toBeCloseTo(end, 0)
        }
    })

    it('should take no more room in a row than its label when inline, its box still its size\'s', async () => {
        const element = await render('ltr')
        const heights = [24, 32, 40, 48, 56];
        [...element.querySelectorAll<HTMLElement>('.inline-row')].forEach((row, index) => {
            const title = row.querySelector('.title') as HTMLElement
            expect(row.getBoundingClientRect().height).toBeCloseTo(title.getBoundingClientRect().height, 0)
            for (const button of row.querySelectorAll('button')) {
                expect(button.getBoundingClientRect().height).toBeCloseTo(heights[index], 0)
            }
        })
    })

    it('should follow the page\'s direction', async () => {
        for (const { start, end, label, icon } of rows(await render('rtl'))) {
            // In a right-to-left page, the start is on the right.
            expect(label.right).toBeCloseTo(end, 0)
            expect(icon.left).toBeCloseTo(start, 0)
        }
    })
})
