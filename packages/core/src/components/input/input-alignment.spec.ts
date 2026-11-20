import { Component, signal, ViewEncapsulation } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { assert } from 'vitest'

import {
    NbButtonGroupModule,
    NbButtonModule,
    NbInputModule,
    NbSelectModule,
    NbThemeModule
} from '@liquid-js/lyr-core'

@Component({
    // The theme applies in an element with its class; the controls of each size in a line of text.
    template: `
    <div class="nb-theme-default" dir="ltr" [style]="variables()" [class.text-spacing]="textSpacing()">
      @for (size of sizes; track size) {
      <p [attr.data-size]="size">
        Label
        <input nbInput [fieldSize]="size" placeholder="Name" />
        <button nbButton [size]="size">Save</button>
        <nb-select [size]="size" placeholder="Pick" />
        <nb-button-group [size]="size"><button nbButtonToggle>One</button></nb-button-group>
        <nb-select [size]="size" appearance="filled" placeholder="Pick" />
        <nb-select [size]="size" appearance="hero" placeholder="Pick" />
        <button nbButton hero [size]="size">Go</button>
      </p>
      }
    </div>
  `,
    styleUrl: './input-alignment.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbInputModule, NbButtonModule, NbSelectModule, NbButtonGroupModule]
})
class AlignmentHostComponent {
    readonly sizes = ['tiny', 'small', 'medium', 'large', 'giant'] as const
    /** Theme variables over the theme's, e.g. bigger text. */
    readonly variables = signal<Record<string, string>>({})
    readonly textSpacing = signal(false)
}

describe('Fields and buttons in a line', () => {
    async function render(change?: (host: AlignmentHostComponent) => void) {
        const fixture = TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] }).createComponent(
            AlignmentHostComponent
        )
        change?.(fixture.componentInstance)
        fixture.detectChanges()
        await fixture.whenStable()
        return fixture.nativeElement as HTMLElement
    }

    /** Each size's controls, as boxes: the field, the button, the select's button and the button group. */
    function lines(element: HTMLElement) {
        return [...element.querySelectorAll<HTMLElement>('p')].map((line) => ({
            size: line.dataset['size'],
            boxes: ['input', 'button[nbButton]', 'nb-select .select-button', 'nb-button-group'].map((selector) =>
                (line.querySelector(selector) as HTMLElement).getBoundingClientRect()
            )
        }))
    }

    function expectAligned(element: HTMLElement) {
        for (const { boxes } of lines(element)) {
            const [first] = boxes
            for (const box of boxes) {
                expect(box.height).toBeCloseTo(first.height, 0)
                expect(box.top + box.height / 2).toBeCloseTo(first.top + first.height / 2, 0)
            }
        }
    }

    it('should line up by their middles, with the height of their size', async () => {
        const element = await render()
        expectAligned(element)
        expect(lines(element).map(({ boxes }) => Math.round(boxes[0].height))).toEqual([24, 32, 40, 48, 56])
    })

    /** Where a box's text starts, from its start edge. */
    function textStart(box: HTMLElement): number {
        const left = box.getBoundingClientRect().left
        if (box instanceof HTMLInputElement) {
            const style = getComputedStyle(box)
            return parseFloat(style.borderLeftWidth) + parseFloat(style.paddingLeft)
        }
        const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT, {
            acceptNode: (node) => (node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP)
        })
        const text = walker.nextNode()
        assert(text)
        const range = document.createRange()
        range.selectNodeContents(text)
        return range.getBoundingClientRect().left - left
    }

    it('should start their text at their size\'s inset, whatever their border', async () => {
        const element = await render()
        const insets = [...element.querySelectorAll<HTMLElement>('p')].map((line) => {
            const start = textStart(line.querySelector('input') as HTMLElement)
            const boxes = line.querySelectorAll<HTMLElement>('nb-select .select-button, button[nbButton], [nbButtonToggle]')
            for (const box of boxes) {
                expect(textStart(box)).toBeCloseTo(start, 0)
            }
            return Math.round(start)
        })
        expect(insets).toEqual([11, 15, 19, 19, 23])
    })

    it('should grow together with bigger text', async () => {
        const element = await render((host) =>
            host.variables.set({
                '--text-subtitle-line-height': '1.875rem',
                '--text-button-medium-line-height': '1.25rem',
                '--text-button-medium-font-size': '1.125rem'
            })
        )
        expectAligned(element)
        const medium = lines(element).find(({ size }) => size === 'medium')
        expect(medium?.boxes[0].height).toBeCloseTo(46, 0)
    })

    it('should stay lined up when a readability tool spaces the text', async () => {
        const element = await render((host) => host.textSpacing.set(true))
        expectAligned(element)
    })
})
