import { afterEveryRender, DestroyRef, Directive, ElementRef, inject, input, numberAttribute } from '@angular/core'

const optionalNumber = (value: unknown) => (value == null || value === '' ? undefined : numberAttribute(value))

/**
 * Grows an `nbInput` textarea with its value, from its `rows`, or `minRows`, up to `maxRows`, after which it scrolls:
 *
 * ```html
 * <textarea nbInput fullWidth nbAutosize maxRows="6" placeholder="Notes"></textarea>
 * ```
 *
 * Its rows are lines of the field's size, with its padding and border around them, so a one-row textarea is as tall as
 * a one-line input. An empty one fits its placeholder. It can't be resized by hand, as its value sets its height.
 *
 * @stacked-example(Growing textarea, input/input-autosize.component)
 *
 * The CDK's `cdkTextareaAutosize` measures its lines before `nbInput` gives the field its size, and sets the height of
 * the text without the field's padding, so a field it sizes is too short: use `nbAutosize` instead.
 */
@Directive({
    selector: 'textarea[nbAutosize]',
    host: {
        'class': 'input-autosize',
        '[style.--nb-input-min-rows]': 'minRows() ?? element.rows',
        '[style.--nb-input-max-rows]': 'maxRows() ?? null',
        '(input)': 'fit?.()'
    }
})
export class NbTextareaAutosizeDirective {
    protected readonly element = inject<ElementRef<HTMLTextAreaElement>>(ElementRef).nativeElement

    /** The fewest rows it shows, empty or not. By default, its `rows`, which is 2 unless it's set. */
    readonly minRows = input<number | undefined, unknown>(undefined, { transform: optionalNumber })

    /** The most rows it grows to; a longer value scrolls. Unset by default, so it grows with any value. */
    readonly maxRows = input<number | undefined, unknown>(undefined, { transform: optionalNumber })

    /** Sets the height where the browser can't, without `field-sizing: content`. */
    protected readonly fit?: () => void

    constructor() {
        // The theme fits it with `field-sizing: content`, between the rows' heights; where that isn't supported, it's
        // measured as the value, its rows or its width change. The server lays nothing out.
        if (typeof CSS === 'undefined' || CSS.supports('field-sizing', 'content')) {
            return
        }
        const field = this.element
        this.fit = () => {
            field.style.height = ''
            const borders = field.offsetHeight - field.clientHeight
            field.style.height = `${field.scrollHeight + borders}px`
        }
        let fitted: string | undefined
        afterEveryRender(() => {
            const state = `${this.minRows()} ${this.maxRows()} ${field.value}`
            if (state !== fitted) {
                fitted = state
                this.fit?.()
            }
        })
        let width = field.clientWidth
        const observer = new ResizeObserver(() => {
            if (field.clientWidth !== width) {
                width = field.clientWidth
                this.fit?.()
            }
        })
        observer.observe(field)
        inject(DestroyRef).onDestroy(() => observer.disconnect())
    }
}
