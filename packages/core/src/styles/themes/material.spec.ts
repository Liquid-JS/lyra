import { Component, ViewEncapsulation } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NbButtonModule, NbThemeModule } from '@liquid-js/lyr-core'

const themes = ['material-light', 'material-dark']
const statuses = ['primary', 'success', 'info', 'warning', 'danger']

@Component({
    template: `
    @for (theme of themes; track theme) {
      <div [class]="'nb-theme-' + theme" [attr.data-theme]="theme">
        @for (status of statuses; track status) {
          <button nbButton [status]="status">Save</button>
          <button nbButton shape="round" [status]="status" class="round">Save</button>
        }
      </div>
    }
  `,
    styleUrl: './material.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbButtonModule]
})
class MaterialHostComponent {
    readonly themes = themes
    readonly statuses = statuses
}

const luminance = (color: string) => {
    const [r, g, b] = (color.match(/[\d.]+/g) ?? []).slice(0, 3).map((value) => {
        const channel = Number(value) / 255
        return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contrast = (a: string, b: string) => {
    const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
    return (light + 0.05) / (dark + 0.05)
}

describe('Material themes', () => {
    let fixture: ComponentFixture<MaterialHostComponent>

    beforeEach(async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        fixture = TestBed.createComponent(MaterialHostComponent)
        fixture.detectChanges()
        await fixture.whenStable()
    })

    for (const theme of themes) {
        it(`should give status buttons readable labels in sentence case, in ${theme}`, () => {
            const buttons = [...fixture.nativeElement.querySelectorAll(`[data-theme=${theme}] button`)] as HTMLElement[]
            for (const button of buttons) {
                const style = getComputedStyle(button)
                const status = statuses.find((name) => button.classList.contains(`status-${name}`))
                expect(contrast(style.color, style.backgroundColor), status).toBeGreaterThanOrEqual(4.5)
                expect(style.textTransform).toBe('none')
                expect(style.fontFamily).toContain('Roboto')
            }
        })

        // M3's full-round buttons are the round shape; the others follow the theme's border radius, as in every theme.
        it(`should give buttons the theme's corners for their shape, pills when round, in ${theme}`, () => {
            const buttons = [...fixture.nativeElement.querySelectorAll(`[data-theme=${theme}] button`)] as HTMLElement[]
            for (const button of buttons) {
                const radius = parseFloat(getComputedStyle(button).borderTopLeftRadius)
                if (button.classList.contains('round')) {
                    expect(radius).toBeGreaterThanOrEqual(button.offsetHeight / 2)
                } else {
                    expect(radius).toBe(4)
                }
            }
        })
    }
})
