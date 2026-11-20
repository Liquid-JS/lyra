import { isPlatformBrowser } from '@angular/common'
import {
    afterRenderEffect,
    Component,
    computed,
    DestroyRef,
    ElementRef,
    inject,
    input,
    linkedSignal,
    PLATFORM_ID,
    resource,
    signal,
    viewChild
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { NbThemeService, NbThemeStyleChanges } from '@liquid-js/lyr-core'
import { EMPTY } from 'rxjs'
import type { FileExtension, Options, RecursivePartial } from '@liquid-js/qr-code-styling'

export type NbQrCodeOptions = RecursivePartial<Options>

export interface NbQrCodeDownload {
    /** The file name without the extension, `qr-code` by default. */
    name?: string
    /** `svg` by default. */
    extension?: `${FileExtension}`
}

// The modules take the text colour, so `color` styles the code like text, and the background is the element's. The
// margin is the blank border scanners need around the code.
const defaults: NbQrCodeOptions = {
    qrOptions: { errorCorrectionLevel: 'Q' },
    dotsOptions: { color: 'currentColor' },
    backgroundOptions: { color: 'transparent', margin: 2 }
}

function isObject(value: unknown): value is Record<string, unknown> {
    return !!value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Blob)
}

function merge<T>(target: T, source: unknown): T {
    if (!isObject(target) || !isObject(source)) {
        return (source === undefined ? target : source) as T
    }
    const result: Record<string, unknown> = { ...target }
    for (const [key, value] of Object.entries(source)) {
        result[key] = merge(result[key], value)
    }
    return result as T
}

/** Replaces `currentColor` with the given colour, e.g. for a downloaded file. */
function resolveColor<T>(value: T, color: string): T {
    if (value === 'currentColor') {
        return color as T
    }
    if (isObject(value)) {
        return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, resolveColor(entry, color)])) as T
    }
    return value
}

/**
 * Shows `data` as a QR code, e.g. a link to open on a phone:
 *
 * ```html
 * <nb-qr-code data="https://liquid-js.github.io/lyra/" />
 * ```
 *
 * @stacked-example(Showcase, qr-code/qr-code-showcase.component)
 *
 * ### Installation
 *
 * Install [`@liquid-js/qr-code-styling`](https://www.npmjs.com/package/@liquid-js/qr-code-styling), which draws the
 * code, and import `NbQrCodeComponent` from `@liquid-js/lyr-extras/qr-code`:
 *
 * ```bash
 * npm install @liquid-js/qr-code-styling @liquid-js/qrcode-generator
 * ```
 *
 * The library loads when the first code shows. The code also renders on the server, e.g. when a page is
 * prerendered, so it's in the page as an SVG before scripts run; the library's Node build draws it there and needs:
 *
 * ```bash
 * npm install @xmldom/xmldom
 * ```
 *
 * The server leaves out a logo set by `options.image`, which the browser then adds.
 *
 * ### Usage
 *
 * The code is 10rem wide and scales with its width. It's dark on white, which phones read most reliably, also in
 * dark themes: set `color` and `background-color` to change that, keeping a strong contrast.
 *
 * `options` takes the [library's options](https://www.npmjs.com/package/@liquid-js/qr-code-styling), e.g. the dot
 * shapes, a logo in the middle or a gradient, over the defaults. `download()` saves the code as an SVG or an
 * image in the colours it shows with:
 * @stacked-example(Styles and download, qr-code/qr-code-download.component)
 *
 * It's an image named by `aria-label`, or by its data without one. In the browser it's drawn on a canvas by the
 * library, aligned to the screen's pixels and scaled down from a larger drawing, so the modules don't show seams
 * where their edges fall between pixels; it's drawn again when its size or the theme changes.
 */
@Component({
    selector: 'nb-qr-code',
    template: `
    <span class="svg" [innerHTML]="markup()" [hidden]="drawn()"></span>
    <canvas #canvas aria-hidden="true" [hidden]="!drawn()"></canvas>
  `,
    styles: `
    :host {
      display: inline-block;
      width: 10rem;
      aspect-ratio: 1;
      color: #000;
      background-color: #fff;
    }

    .svg,
    .svg ::ng-deep > svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    canvas {
      display: block;
    }

    [hidden] {
      display: none;
    }
  `,
    host: {
        'role': 'img',
        '[attr.aria-label]': 'ariaLabel() || data()'
    }
})
export class NbQrCodeComponent {
    protected readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement

    /**
     * The text the code holds, e.g. a URL.
     */
    readonly data = input.required<string>()

    /**
     * Options of `@liquid-js/qr-code-styling`, over the defaults.
     */
    readonly options = input<NbQrCodeOptions>({})

    /**
     * Names the image for screen readers; the data by default.
     */
    readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' })

    protected readonly sanitizer = inject(DomSanitizer)
    protected readonly browser = isPlatformBrowser(inject(PLATFORM_ID))
    protected readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas')

    /** Whether the canvas shows the code; until then, and on the server, the SVG does. */
    protected readonly drawn = signal(false)
    protected readonly width = signal(0)
    /** Counts window resizes, e.g. a zoom that changes the pixel ratio or the element's position on the screen. */
    protected readonly layout = signal(0)
    protected readonly theme = toSignal(inject(NbThemeService, { optional: true })?.onThemeChange() ?? EMPTY)
    // The theme's variables, which may change without another theme, e.g. as an app sets one.
    protected readonly themeStyle = inject(NbThemeStyleChanges).changes
    protected drawing = 0

    /**
     * The code's SVG. A resource, so a server render waits for it and the page has the code.
     */
    protected readonly svg = resource({
    // Without the logo on the server, where loading and measuring it would need more of the library's peers.
        params: () => (this.browser ? this.qrOptions() : { ...this.qrOptions(), image: undefined }),
        loader: async ({ params }) => {
            const { QRCodeStyling } = await import('@liquid-js/qr-code-styling')
            return new QRCodeStyling(params).serialize()
        }
    })

    /** The last code drawn, which stays while the next one is drawn. */
    protected readonly lastSvg = linkedSignal<string | undefined, string | undefined>({
        source: () => (this.svg.error() ? undefined : this.svg.value()),
        computation: (svg, previous) => svg ?? previous?.value
    })

    // The library draws the SVG; trusting it lets its elements through, which the sanitizer would strip.
    protected readonly markup = computed<SafeHtml | undefined>(() => {
        const svg = this.lastSvg()?.replace(/^<\?xml[^>]*>\s*/, '')
        return svg ? this.sanitizer.bypassSecurityTrustHtml(svg) : undefined
    })

    constructor() {
        if (!this.browser) {
            return
        }
        if (typeof ResizeObserver !== 'undefined') {
            const observer = new ResizeObserver(([entry]) => this.width.set(entry.contentRect.width))
            observer.observe(this.element)
            inject(DestroyRef).onDestroy(() => observer.disconnect())
        }
        const relayout = () => this.layout.update((count) => count + 1)
        window.addEventListener('resize', relayout, { passive: true })
        inject(DestroyRef).onDestroy(() => window.removeEventListener('resize', relayout))
        afterRenderEffect(() => {
            // Drawn again for a new code, size, zoom or theme.
            this.lastSvg()
            this.theme()
            this.themeStyle()
            this.layout()
            if (this.width()) {
                void this.draw()
            }
        })
    }

    /**
     * Saves the code as a file, in the colours it shows with.
     */
    async download({ name = 'qr-code', extension = 'svg' }: NbQrCodeDownload = {}) {
        const library = await import('@liquid-js/qr-code-styling')
        const style = getComputedStyle(this.element)
        let options = resolveColor(this.qrOptions(), style.color)
        // A file has no element behind it, so the background gets the element's colour.
        if (options.backgroundOptions && options.backgroundOptions.color === 'transparent') {
            options = merge(options, { backgroundOptions: { color: style.backgroundColor } })
        }
        await library.browserUtils?.download(new library.QRCodeStyling(options), { name, extension })
    }

    protected async draw() {
        const drawing = ++this.drawing
        const library = await import('@liquid-js/qr-code-styling')
        const ratio = window.devicePixelRatio || 1
        const rect = this.element.getBoundingClientRect()
        // A whole number of the screen's pixels, so the canvas isn't scaled again to fit.
        const size = Math.floor(Math.min(rect.width, rect.height) * ratio)
        if (!size || !library.browserUtils) {
            return
        }

        // A drawing doesn't inherit the text colour, so it gets the colour the code shows with.
        const qrCode = new library.QRCodeStyling(resolveColor(this.qrOptions(), getComputedStyle(this.element).color))
        const { canvas: drawn, canvasDrawingPromise } =
            library.browserUtils.drawToCanvas(qrCode, { width: size, height: size, margin: 0 }) ?? {}
        await canvasDrawingPromise
        if (!drawn || drawing !== this.drawing) {
            return
        }

        const canvas = this.canvas().nativeElement
        canvas.width = canvas.height = size
        canvas.style.width = canvas.style.height = `${size / ratio}px`
        // Moved by the part of a pixel the element starts at, so the canvas's pixels are the screen's.
        const offset = (position: number) => -((((position * ratio) % 1) + 1) % 1) / ratio
        canvas.style.transform = `translate(${offset(rect.left)}px, ${offset(rect.top)}px)`
        const context = canvas.getContext('2d')
        context?.clearRect(0, 0, size, size)
        context?.drawImage(drawn, 0, 0)
        this.drawn.set(true)
    }

    protected readonly qrOptions = computed<NbQrCodeOptions>(() =>
        merge(merge(defaults, this.options()), { data: this.data() })
    )
}
