import { Component, signal, ViewEncapsulation } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { userEvent } from 'vitest/browser'

import { NbSwatchModule, NbThemeModule } from '@liquid-js/lyr-core'

@Component({
    // The theme applies in an element with its class.
    template: `
    <div class="nb-theme-default">
      <nb-swatch-group aria-label="Colour" [multiple]="multiple()" [max]="max()" [formControl]="control">
        <nb-swatch value="navy" label="Navy" color="#1f2a44" />
        <nb-swatch value="black-white" label="Black/White" [color]="['#111111', '#ffffff']" />
        <nb-swatch value="tricolour" label="Tricolour" [color]="['red', 'white', 'blue']" />
        <nb-swatch value="tartan" label="Tartan" image="/swatches/tartan.jpg" unavailable />
        <nb-swatch value="sand" label="Sand" color="#d8c6a5" />
      </nb-swatch-group>
    </div>
  `,
    styleUrl: './swatch.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbSwatchModule, ReactiveFormsModule]
})
class SwatchHostComponent {
    readonly multiple = signal(false)
    readonly max = signal<number | undefined>(undefined)
    readonly control = new FormControl<string | string[] | null>(null)
}

describe('nb-swatch-group', () => {
    let fixture: ComponentFixture<SwatchHostComponent>

    async function render(change?: (host: SwatchHostComponent) => void) {
        fixture = TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] }).createComponent(SwatchHostComponent)
        change?.(fixture.componentInstance)
        document.body.appendChild(fixture.nativeElement)
        fixture.detectChanges()
        await fixture.whenStable()
    }

    afterEach(() => fixture.destroy())

    const group = () => fixture.nativeElement.querySelector('nb-swatch-group') as HTMLElement
    const buttons = () => Array.from(fixture.nativeElement.querySelectorAll('nb-swatch .swatch')) as HTMLButtonElement[]
    const fills = () => Array.from(fixture.nativeElement.querySelectorAll('.swatch-fill')) as HTMLElement[]

    it('should choose one swatch at a time, as a radio group', async () => {
        await render()
        expect(group().getAttribute('role')).toBe('radiogroup')
        await userEvent.click(buttons()[1])
        await userEvent.click(buttons()[0])
        expect(fixture.componentInstance.control.value).toBe('navy')
        expect(buttons().map((button) => button.getAttribute('aria-checked'))).toEqual(['true', 'false', 'false', 'false', 'false'])
    })

    it('should move between swatches with the arrow keys, choosing as it moves, from one tab stop', async () => {
        await render()
        expect(buttons().map((button) => button.tabIndex)).toEqual([0, -1, -1, -1, -1])
        buttons()[0].focus()
        await userEvent.keyboard('{ArrowRight}{ArrowRight}')
        fixture.detectChanges()
        expect(document.activeElement).toBe(buttons()[2])
        expect(fixture.componentInstance.control.value).toBe('tricolour')
        expect(buttons()[2].tabIndex).toBe(0)
        await userEvent.keyboard('{End}')
        expect(fixture.componentInstance.control.value).toBe('sand')
    })

    it('should let any number be chosen with multiple, as toggle buttons', async () => {
        await render((host) => host.multiple.set(true))
        expect(group().getAttribute('role')).toBe('group')
        await userEvent.click(buttons()[0])
        await userEvent.click(buttons()[2])
        await userEvent.click(buttons()[0])
        expect(fixture.componentInstance.control.value).toEqual(['tricolour'])
        expect(buttons()[2].getAttribute('aria-pressed')).toBe('true')
        buttons()[2].focus()
        await userEvent.keyboard('{ArrowRight}')
        expect(fixture.componentInstance.control.value).toEqual(['tricolour'])
    })

    it('should show its value from the form, and be disabled with it', async () => {
        await render()
        fixture.componentInstance.control.setValue('sand')
        fixture.detectChanges()
        expect(buttons()[4].getAttribute('aria-checked')).toBe('true')
        expect(buttons()[4].tabIndex).toBe(0)
        fixture.componentInstance.control.disable()
        fixture.detectChanges()
        expect(buttons().every((button) => button.disabled)).toBe(true)
    })

    it('should fill a swatch with its colour, its colours side by side, or its picture', async () => {
        await render()
        const styles = fills().map((fill) => getComputedStyle(fill))
        expect(styles[0].backgroundColor).toBe('rgb(31, 42, 68)')
        expect(styles[1].backgroundImage).toContain('linear-gradient')
        expect(styles[2].backgroundImage).toContain('conic-gradient')
        expect(styles[3].backgroundImage).toContain('tartan.jpg')
    })

    it('should name each swatch, and say which is unavailable', async () => {
        await render()
        expect(buttons().map((button) => button.getAttribute('aria-label'))).toEqual(['Navy', 'Black/White', 'Tricolour', 'Tartan, unavailable', 'Sand'])
        expect(buttons()[0].title).toBe('Navy')
        expect(getComputedStyle(buttons()[3], '::after').backgroundImage).toContain('linear-gradient')
        expect(getComputedStyle(fills()[3]).opacity).toBe('0.4')
        // Over the swatch, just as big.
        const strike = getComputedStyle(buttons()[3], '::after')
        expect([strike.width, strike.height]).toEqual(['32px', '32px'])
    })

    it('should show max swatches and the chosen ones, and the others on demand', async () => {
        await render((host) => {
            host.max.set(2)
            host.control.setValue('sand')
        })
        const shown = () => (Array.from(fixture.nativeElement.querySelectorAll('nb-swatch')) as HTMLElement[]).map((swatch) => !swatch.hidden)
        expect(shown()).toEqual([true, true, false, false, true])
        const more = fixture.nativeElement.querySelector('.swatch-more') as HTMLButtonElement
        expect(more.textContent?.trim()).toBe('+2')
        expect(more.getAttribute('aria-label')).toBe('Show 2 more')
        await userEvent.click(more)
        fixture.detectChanges()
        await expect.poll(() => document.activeElement).toBe(buttons()[2])
        expect(shown()).toEqual([true, true, true, true, true])
        expect(fixture.nativeElement.querySelector('.swatch-more')).toBeNull()
    })

    it('should ring the chosen swatch', async () => {
        await render()
        await userEvent.click(buttons()[0])
        fixture.detectChanges()
        expect(getComputedStyle(buttons()[0]).borderTopStyle).toBe('solid')
        // Once its transition is over.
        await expect.poll(() => getComputedStyle(buttons()[0]).borderTopColor).not.toBe('rgba(0, 0, 0, 0)')
        expect(getComputedStyle(buttons()[1]).borderTopColor).toBe('rgba(0, 0, 0, 0)')
        // The ring is apart from the swatch, inside the button's box.
        expect(fills()[0].getBoundingClientRect().width).toBe(32)
        expect(buttons()[0].getBoundingClientRect().width).toBe(40)
    })
})
