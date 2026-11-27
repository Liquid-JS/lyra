import { Component, signal, ViewEncapsulation } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'

import { NbFormFieldModule, NbInputModule, NbThemeModule } from '@liquid-js/lyr-core'

@Component({
    // The theme applies in an element with its class.
    template: `
    <div class="nb-theme-default" style="width: 16rem">
      <textarea class="bare" nbInput fullWidth nbAutosize maxRows="5" [(ngModel)]="text"></textarea>
      <nb-form-field>
        <textarea class="field" nbInput nbAutosize [minRows]="1" [(ngModel)]="text"></textarea>
      </nb-form-field>
      <textarea class="hint" nbInput fullWidth nbAutosize minRows="1" placeholder="One\nTwo\nThree"></textarea>
      <textarea class="sized" nbInput nbAutosize [(ngModel)]="text"></textarea>
      <textarea class="plain" nbInput></textarea>
    </div>
  `,
    styleUrl: './input-alignment.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbInputModule, NbFormFieldModule, FormsModule]
})
class AutosizeHostComponent {
    readonly text = signal('One line')
}

// Lines of the medium size are 24 px; a one-line field is 40 px, its padding and border the other 16.
const rows = (count: number) => count * 24 + 16

describe('NbTextareaAutosizeDirective', () => {
    afterEach(() => vi.restoreAllMocks())

    const create = async () => {
        const fixture = TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] }).createComponent(AutosizeHostComponent)
        await fixture.whenStable()
        const element = fixture.nativeElement as HTMLElement
        const height = (selector: string) => (element.querySelector(selector) as HTMLTextAreaElement).offsetHeight
        const type = async (text: string) => {
            fixture.componentInstance.text.set(text)
            await fixture.whenStable()
        }
        return { height, type, element }
    }

    const lines = (count: number) => Array.from({ length: count }, (_, index) => `Line ${index + 1}`).join('\n')

    for (const supported of [true, false]) {
        describe(supported ? 'with field-sizing' : 'measured, without field-sizing', () => {
            beforeEach(() => {
                if (!supported) {
                    const supports = CSS.supports.bind(CSS) as (property: string, value?: string) => boolean
                    vi.spyOn(CSS, 'supports').mockImplementation(((property: string, value?: string) =>
                        property === 'field-sizing' ? false : supports(property, value)) as typeof CSS.supports)
                }
            })

            it('should grow and shrink with its value, from its rows up to maxRows', async () => {
                const { height, type } = await create()
                // Its rows, 2 unless set, or minRows.
                expect(height('.bare')).toBe(rows(2))
                expect(height('.field')).toBe(rows(1))

                await type(lines(4))
                expect(height('.bare')).toBe(rows(4))
                expect(height('.field')).toBe(rows(4))

                // Past maxRows it scrolls.
                await type(lines(8))
                expect(height('.bare')).toBe(rows(5))
                expect(height('.field')).toBe(rows(8))

                await type('One line')
                expect(height('.bare')).toBe(rows(2))
                expect(height('.field')).toBe(rows(1))
            })

            it('should grow as it\'s typed in', async () => {
                const { height, element } = await create()
                const field = element.querySelector('.field') as HTMLTextAreaElement
                field.value = lines(3)
                field.dispatchEvent(new Event('input'))
                await new Promise((resolve) => requestAnimationFrame(resolve))
                expect(height('.field')).toBe(rows(3))
            })
        })
    }

    it('should fit its placeholder while it\'s empty, where the browser can', async () => {
        const { height } = await create()
        expect(height('.hint')).toBe(rows(3))
    })

    it('should keep the input\'s width, whatever its value', async () => {
        const { element, type } = await create()
        const width = (selector: string) => (element.querySelector(selector) as HTMLTextAreaElement).offsetWidth
        expect(width('.sized')).toBe(width('.plain'))
        await type('A line much longer than the field is wide, which wraps rather than widening it')
        expect(width('.sized')).toBe(width('.plain'))
    })
})
