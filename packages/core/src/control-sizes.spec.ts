import { Component, ViewEncapsulation } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import {
    NbCheckboxComponent,
    NbComponentSize,
    NbRadioComponent,
    NbRadioGroupComponent,
    NbThemeModule,
    NbToggleComponent
} from '@liquid-js/lyr-core'

const sizes: NbComponentSize[] = ['tiny', 'small', 'medium', 'large', 'giant']

@Component({
    // The theme applies in an element with its class, and its direction-dependent rules in one with `dir`.
    template: `
    <div class="nb-theme-default" dir="ltr">
      @for (size of sizes; track size) {
        <nb-toggle [size]="size" checked [attr.data-size]="size">Toggle</nb-toggle>
        <nb-checkbox [size]="size" [attr.data-size]="size">Checkbox</nb-checkbox>
        <nb-radio-group [size]="size" [attr.data-size]="size">
          <nb-radio value="a" size="giant">Radio</nb-radio>
        </nb-radio-group>
      }
      <nb-toggle class="default" />
      <nb-checkbox class="default" />
      <nb-radio class="default" />
    </div>
  `,
    styleUrl: './control-sizes.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbToggleComponent, NbCheckboxComponent, NbRadioGroupComponent, NbRadioComponent]
})
class ControlSizesHostComponent {
    readonly sizes = sizes
}

describe('toggle, checkbox and radio sizes', () => {
    let fixture: ComponentFixture<ControlSizesHostComponent>

    const rect = (selector: string) => {
        const element = fixture.nativeElement.querySelector(selector) as HTMLElement
        return element.getBoundingClientRect()
    }
    const fontSize = (selector: string) =>
        parseFloat(getComputedStyle(fixture.nativeElement.querySelector(selector)).fontSize)

    beforeEach(async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        fixture = TestBed.createComponent(ControlSizesHostComponent)
        fixture.detectChanges()
        await fixture.whenStable()
    })

    it('should be medium by default, at the size they had before', () => {
    // A 1px border around the toggle.
        expect(rect('nb-toggle.default .toggle').height).toBe(32)
        expect(rect('nb-toggle.default .toggle').width).toBe(52)
        expect(rect('nb-checkbox.default .custom-checkbox').height).toBe(20)
        expect(rect('nb-radio.default .outer-circle').height).toBe(20)
        expect(fixture.nativeElement.querySelector('nb-toggle.default').classList).toContain('size-medium')
    })

    it('should grow with the size', () => {
        const heights = (selector: string) => sizes.map((size) => rect(`[data-size="${size}"] ${selector}`).height)

        expect(heights('.toggle')).toEqual([20, 24, 32, 38, 44])
        expect(heights('.custom-checkbox')).toEqual([14, 16, 20, 24, 28])
        expect(heights('.outer-circle')).toEqual([14, 16, 20, 24, 28])
        for (const control of ['nb-toggle', 'nb-checkbox', 'nb-radio-group']) {
            // caption-2, subtitle-2 for small and medium as before, subtitle and heading-6, as inputs of the size.
            expect(sizes.map((size) => fontSize(`${control}[data-size="${size}"] .text`))).toEqual([12, 13, 13, 15, 18])
        }
    })

    it('should keep a checked toggle switcher inside the track at every size', () => {
        for (const size of sizes) {
            const track = rect(`nb-toggle[data-size="${size}"] .toggle`)
            const switcher = rect(`nb-toggle[data-size="${size}"] .toggle-switcher`)

            expect(switcher.height).toBe(track.height - 4)
            expect(switcher.right).toBeCloseTo(track.right - 2, 1)
        }
    })

    it("should give radios their group's size", () => {
        expect(rect('nb-radio-group[data-size="tiny"] .outer-circle').height).toBe(14)
        expect(fixture.nativeElement.querySelector('nb-radio-group[data-size="tiny"] nb-radio').classList).toContain('size-tiny')
    })

    it('should start the radio text where the circle ends, at every size', () => {
        for (const size of sizes) {
            const circle = rect(`nb-radio-group[data-size="${size}"] .outer-circle`)
            const text = rect(`nb-radio-group[data-size="${size}"] .text`)

            expect(text.left).toBeCloseTo(circle.right, 1)
        }
    })
})
