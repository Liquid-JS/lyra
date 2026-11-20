import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, ViewEncapsulation } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { assert } from 'vitest'
import { userEvent } from 'vitest/browser'

import { NbButtonModule, NbInputModule, NbThemeModule } from '@liquid-js/lyr-core'

const appearances = ['filled', 'outline', 'ghost', 'hero'] as const
const statuses = ['basic', 'primary', 'success', 'info', 'warning', 'danger', 'control'] as const
const sizes = ['tiny', 'small', 'medium', 'large', 'giant'] as const
const shapes = ['rectangle', 'semi-round', 'round'] as const

interface ButtonLook {
    appearance: (typeof appearances)[number]
    status: (typeof statuses)[number]
    size: (typeof sizes)[number]
    shape: (typeof shapes)[number]
}

type InputLook = Omit<ButtonLook, 'appearance'>

/** Every appearance in every status, then every size and every shape, as `looks.spec.scss` writes them. */
const buttons: ButtonLook[] = [
    ...appearances.flatMap((appearance) =>
        statuses.map((status) => ({ appearance, status, size: 'medium' as const, shape: 'rectangle' as const }))
    ),
    ...sizes.map((size) => ({ appearance: 'filled' as const, status: 'basic' as const, size, shape: 'rectangle' as const })),
    ...shapes.map((shape) => ({ appearance: 'filled' as const, status: 'basic' as const, size: 'medium' as const, shape }))
]

const inputs: InputLook[] = [
    ...statuses.map((status) => ({ status, size: 'medium' as const, shape: 'rectangle' as const })),
    ...sizes.map((size) => ({ status: 'basic' as const, size, shape: 'rectangle' as const })),
    ...shapes.map((shape) => ({ status: 'basic' as const, size: 'medium' as const, shape }))
]

@Component({
    // Each pair is a Lyra control and a plain element with its look, from `nb-button()`, `nb-input()` or `nb-panel()`.
    // The option list and popover are their elements, with the styles of their themes.
    template: `
    <div class="nb-theme-default looks">
      <div class="away">Away</div>
      @for (look of buttons; track $index) {
      <div class="pair button-pair">
        <button nbButton
          [appearance]="look.appearance"
          [status]="look.status"
          [size]="look.size"
          [shape]="look.shape"
          [disabled]="disabled()">Label</button>
        <button type="button"
          [attr.data-look]="'button ' + look.appearance + ' ' + look.status + ' ' + look.size + ' ' + look.shape"
          [disabled]="disabled()">Label</button>
      </div>
      }
      @for (look of inputs; track $index) {
      <div class="pair input-pair">
        <input nbInput
          placeholder="Placeholder"
          [status]="look.status"
          [fieldSize]="look.size"
          [shape]="look.shape"
          [disabled]="disabled()" />
        <input placeholder="Placeholder"
          [attr.data-look]="'input ' + look.status + ' ' + look.size + ' ' + look.shape"
          [disabled]="disabled()" />
      </div>
      }
      <div class="pair input-pair">
        <textarea nbInput shape="round" placeholder="Placeholder" [disabled]="disabled()"></textarea>
        <textarea data-look="input basic medium round" placeholder="Placeholder" [disabled]="disabled()"></textarea>
      </div>
      <div class="pair">
        <nb-option-list class="option-list-panel"><nb-option>Option</nb-option></nb-option-list>
        <div data-look="panel option-list">Option</div>
      </div>
      <div class="pair">
        <nb-popover><div class="primitive-overlay">Text</div></nb-popover>
        <div data-look="panel popover">Text</div>
      </div>
    </div>
  `,
    styleUrl: './looks.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbButtonModule, NbInputModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
class LooksHostComponent {
    readonly buttons = buttons
    readonly inputs = inputs
    readonly disabled = signal(false)
}

const borders = ['top', 'right', 'bottom', 'left'].flatMap((side) => [
    `border-${side}-width`,
    `border-${side}-style`,
    `border-${side}-color`
])
const corners = ['top-left', 'top-right', 'bottom-right', 'bottom-left'].map((corner) => `border-${corner}-radius`)
const paddings = ['top', 'right', 'bottom', 'left'].map((side) => `padding-${side}`)
const fonts = ['font-family', 'font-size', 'font-weight', 'line-height']
const colors = ['background-color', 'background-image', 'color', 'box-shadow']

const buttonProperties = [
    ...['appearance', 'display', 'align-items', 'justify-content', 'white-space', 'vertical-align', 'user-select'],
    ...['cursor', 'position', 'outline-style', 'text-transform', 'text-shadow', 'min-height'],
    ...fonts,
    ...paddings,
    ...borders,
    ...corners,
    ...colors
]
const inputProperties = ['appearance', 'outline-style', 'min-height', ...fonts, ...paddings, ...borders, ...corners, ...colors]
const placeholderProperties = ['color', 'font-family', 'font-size', 'font-weight', 'text-overflow']

function styles(element: Element, properties: string[], pseudo?: string) {
    const style = getComputedStyle(element, pseudo)
    return Object.fromEntries(properties.map((property) => [property, style.getPropertyValue(property)]))
}

/** An element's styles, its placeholder's for a field, and its height, which its size and padding make. */
function look(element: HTMLElement) {
    const field = element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
    return {
        ...styles(element, field ? inputProperties : buttonProperties),
        ...(field ? { placeholder: styles(element, placeholderProperties, '::placeholder') } : {}),
        height: element.getBoundingClientRect().height
    }
}

describe('Lyra looks for other elements', () => {
    async function render(disabled = false) {
        const fixture = TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot()]
        }).createComponent(LooksHostComponent)
        fixture.componentInstance.disabled.set(disabled)
        fixture.detectChanges()
        await fixture.whenStable()
        return fixture.nativeElement as HTMLElement
    }

    /** Each pair's Lyra control and the plain element with its look. */
    function pairs(element: HTMLElement, selector: string) {
        return [...element.querySelectorAll(selector)].map((pair) => {
            const [lyra, other] = [...pair.children] as HTMLElement[]
            assert(lyra && other)
            return { lyra, other, name: other.dataset['look'] }
        })
    }

    /** Each pair's looks in a state, which `enter` puts an element in. */
    async function compare(pairList: ReturnType<typeof pairs>, enter: (element: HTMLElement) => Promise<void>) {
        for (const { lyra, other, name } of pairList) {
            await enter(lyra)
            const expected = look(lyra)
            await enter(other)
            expect(look(other), name).toEqual(expected)
        }
    }

    const rest = async () => {}

    it('should give a button and a field the look of Lyra\'s at rest', async () => {
        const element = await render()
        await compare(pairs(element, '.button-pair, .input-pair'), rest)
    })

    it('should give them the look of Lyra\'s under the pointer', async () => {
        const element = await render()
        // Sizes and shapes have no colours of their own.
        const statusPairs = [
            ...pairs(element, '.button-pair').slice(0, appearances.length * statuses.length),
            ...pairs(element, '.input-pair').slice(0, statuses.length)
        ]
        await compare(statusPairs, (target) => userEvent.hover(target))
    })

    it('should give them the look of Lyra\'s with the keyboard\'s focus', async () => {
        const element = await render()
        const away = element.querySelector<HTMLElement>('.away')
        assert(away)
        await userEvent.hover(away)
        await userEvent.keyboard('{Shift}')
        const statusPairs = [
            ...pairs(element, '.button-pair').slice(0, appearances.length * statuses.length),
            ...pairs(element, '.input-pair').slice(0, statuses.length)
        ]
        await compare(statusPairs, async (target) => {
            target.focus()
            expect(target.matches(':focus-visible')).toBe(true)
        })
    })

    it('should give a field the look of Lyra\'s with the focus, under the pointer', async () => {
        const element = await render()
        await compare(pairs(element, '.input-pair').slice(0, statuses.length), async (target) => {
            target.focus()
            await userEvent.hover(target)
        })
    })

    it('should give them the look of Lyra\'s disabled', async () => {
        const element = await render(true)
        await compare(pairs(element, '.button-pair, .input-pair'), rest)
    })

    it('should take aria-disabled for disabled', async () => {
        const element = await render()
        const statusPairs = [
            ...pairs(element, '.button-pair').slice(0, appearances.length * statuses.length),
            ...pairs(element, '.input-pair').slice(0, statuses.length)
        ]
        for (const { lyra, other, name } of statusPairs) {
            lyra.setAttribute('disabled', '')
            other.setAttribute('aria-disabled', 'true')
            expect(look(other), name).toEqual(look(lyra))
        }
    })

    it('should give an element the look of an option list or a popover', async () => {
        const element = await render()
        const surface = [...borders, ...corners, 'background-color', 'box-shadow']

        const list = element.querySelector('nb-option-list')
        const option = element.querySelector('nb-option')
        const listLook = element.querySelector('[data-look="panel option-list"]')
        assert(list && option && listLook)
        expect(styles(listLook, surface)).toEqual(styles(list, surface))
        expect(styles(listLook, ['color', 'font-family'])).toEqual(styles(option, ['color', 'font-family']))

        const popover = element.querySelector('nb-popover')
        const popoverText = element.querySelector('nb-popover .primitive-overlay')
        const popoverLook = element.querySelector('[data-look="panel popover"]')
        assert(popover && popoverText && popoverLook)
        expect(styles(popoverLook, [...surface, 'color'])).toEqual(styles(popover, [...surface, 'color']))
        expect(styles(popoverLook, fonts)).toEqual(styles(popoverText, fonts))
    })
})
