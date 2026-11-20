import { Component, PLATFORM_ID, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NbThemeModule, NbThemeService } from '@liquid-js/lyr-core'
import { NbQrCodeComponent, NbQrCodeOptions } from '@liquid-js/lyr-extras/qr-code'

@Component({
    template: `
    <div [style.padding-left.px]="offset()" [style.padding-top.px]="offset()">
      <nb-qr-code [data]="data()" [options]="options()" [aria-label]="label()" style="color: rgb(20, 40, 60)" />
    </div>
  `,
    imports: [NbQrCodeComponent]
})
class QrCodeHostComponent {
    readonly data = signal('https://liquid-js.github.io/lyra/')
    readonly options = signal<NbQrCodeOptions>({})
    readonly label = signal<string | undefined>(undefined)
    readonly offset = signal(0.3)
}

describe('NbQrCodeComponent', () => {
    let fixture: ComponentFixture<QrCodeHostComponent>
    let host: QrCodeHostComponent
    let element: HTMLElement

    const svg = () => element.querySelector('.svg > svg') as SVGSVGElement
    const canvas = () => element.querySelector('canvas') as HTMLCanvasElement
    const render = async () => {
        fixture.detectChanges()
        await fixture.whenStable()
        await vi.waitFor(() => expect(svg()).toBeTruthy())
    }

    beforeEach(async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        fixture = TestBed.createComponent(QrCodeHostComponent)
        host = fixture.componentInstance
        element = fixture.nativeElement.querySelector('nb-qr-code')
        await render()
    })

    it('should show the data as a code in the text colour, scaled to its width', () => {
        expect(element.querySelectorAll('svg').length).toBe(1)
        expect(svg().innerHTML.toLowerCase()).toContain('fill="currentcolor"')
        // 10rem
        expect(element.getBoundingClientRect().width).toBe(160)
        expect(element.getBoundingClientRect().height).toBe(160)
    })

    it('should draw the code on a canvas at its size, in the text colour, instead of the SVG', async () => {
        await vi.waitFor(() => expect(canvas().hidden).toBe(false))
        expect(element.querySelector<HTMLElement>('.svg')?.hidden).toBe(true)
        expect(canvas().getAttribute('aria-hidden')).toBe('true')
        expect(canvas().width).toBe(Math.round(160 * devicePixelRatio))
        expect(canvas().getBoundingClientRect().width).toBe(160)

        // The top left finder pattern starts after the 2 modules of blank border, of 29 + 4 modules across.
        const context = canvas().getContext('2d') as CanvasRenderingContext2D
        const module = canvas().width / 33
        const [r, g, b, a] = context.getImageData(Math.round(module * 2.5), Math.round(module * 2.5), 1, 1).data
        expect([r, g, b, a]).toEqual([20, 40, 60, 255])
        // The blank border is transparent, so the element's background shows.
        expect(context.getImageData(1, 1, 1, 1).data[3]).toBe(0)
    })

    it("should line the canvas up with the screen's pixels, also where the element starts between them", async () => {
        await vi.waitFor(() => expect(canvas().hidden).toBe(false))
        const rect = canvas().getBoundingClientRect()
        const position = element.getBoundingClientRect()
        expect((position.left * devicePixelRatio) % 1).not.toBeCloseTo(0, 2)
        expect((rect.left * devicePixelRatio) % 1).toBeCloseTo(0, 5)
        expect((rect.top * devicePixelRatio) % 1).toBeCloseTo(0, 5)
        expect(rect.width * devicePixelRatio).toBe(canvas().width)
    })

    it('should draw the code again when the theme changes, e.g. its colour', async () => {
        await vi.waitFor(() => expect(canvas().hidden).toBe(false))
        const context = canvas().getContext('2d') as CanvasRenderingContext2D
        const point = Math.round((canvas().width / 33) * 2.5)

        element.style.color = 'rgb(200, 0, 0)'
        TestBed.inject(NbThemeService).changeTheme('dark')
        await vi.waitFor(() => expect([...context.getImageData(point, point, 1, 1).data]).toEqual([200, 0, 0, 255]))
    })

    it('should be an image named by its label, or by its data', async () => {
        expect(element.getAttribute('role')).toBe('img')
        expect(element.getAttribute('aria-label')).toBe('https://liquid-js.github.io/lyra/')

        host.label.set('Lyra documentation')
        await render()
        expect(element.getAttribute('aria-label')).toBe('Lyra documentation')
    })

    it('should update the code in place when the data or options change', async () => {
        const before = svg().innerHTML

        host.data.set('https://github.com/Liquid-JS/lyra')
        await render()
        await vi.waitFor(() => expect(svg().innerHTML).not.toBe(before))
        const withData = svg().innerHTML
        expect(element.querySelectorAll('svg').length).toBe(1)

        host.options.set({ dotsOptions: { type: 'dot' } })
        await render()
        await vi.waitFor(() => expect(svg().innerHTML).not.toBe(withData))
        // The defaults stay under the options.
        expect(svg().innerHTML.toLowerCase()).toContain('fill="currentcolor"')
    })

    it('should download the code in the colours it shows with', async () => {
        const links: HTMLAnchorElement[] = []
        const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
            links.push(this)
        })

        const component = fixture.debugElement.query((node) => node.name === 'nb-qr-code').componentInstance as NbQrCodeComponent
        await component.download({ name: 'lyra' })
        click.mockRestore()

        expect(links.length).toBe(1)
        expect(links[0].download).toBe('lyra.svg')
        const file = await (await fetch(links[0].href)).text()
        // rgb(20, 40, 60) on white
        expect(file.toLowerCase()).not.toContain('currentcolor')
        expect(file).toContain('fill="#14283c"')
        expect(file).toContain('fill="#ffffff"')
    })
})

describe('NbQrCodeComponent with a logo', () => {
    // A 1×1 PNG.
    const logo =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='

    const render = async (platform: 'browser' | 'server') => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot()],
            providers: [{ provide: PLATFORM_ID, useValue: platform }]
        })
        const fixture = TestBed.createComponent(QrCodeHostComponent)
        fixture.componentInstance.options.set({ image: logo })
        fixture.detectChanges()
        await fixture.whenStable()
        const element: HTMLElement = fixture.nativeElement
        await vi.waitFor(() => expect(element.querySelector('.svg > svg')).toBeTruthy())
        return element.querySelector('.svg > svg') as SVGSVGElement
    }

    it('should show the logo in the browser', async () => {
        expect((await render('browser')).querySelector('image')).toBeTruthy()
    })

    it("should leave the logo out on the server, so the library's Node build needs only @xmldom/xmldom", async () => {
        expect((await render('server')).querySelector('image')).toBeNull()
    })
})
