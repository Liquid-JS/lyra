import { Component, computed, ElementRef, inject, input, OnInit, signal, viewChild } from '@angular/core'

import { injectNbTexts, NbLocalize, ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base'

import { NB_SWATCH_GROUP } from './swatch-group-token'

/** @internal */
declare const $localize: NbLocalize

/** @internal */
export function injectNbSwatchTexts() {
    return injectNbTexts('swatch', () => ({
        unavailable: $localize`:@@nb.swatch.unavailable:unavailable`,
        more: (count: number) => $localize`:@@nb.swatch.more:Show ${count}:count: more`
    }))
}

/** A CSS `url()` of an address, with what would end it escaped. */
const cssUrl = (address: string) => `url("${address.replace(/["\\\n\r]/g, (char) => encodeURIComponent(char))}")`

/**
 * One option of an `nb-swatch-group`: a colour, colours side by side, a picture, e.g. a fabric's, or content of its
 * own, named by its `label`. See `NbSwatchGroupComponent`.
 */
@Component({
    selector: 'nb-swatch',
    template: `
    <button
      #button
      type="button"
      class="swatch"
      [attr.role]="group.multiple() ? null : 'radio'"
      [attr.aria-checked]="group.multiple() ? null : selected()"
      [attr.aria-pressed]="group.multiple() ? selected() : null"
      [attr.aria-label]="name()"
      [attr.title]="label()"
      [attr.tabindex]="group.isTabStop(this) ? 0 : -1"
      [disabled]="isDisabled()"
      (click)="group.choose(this)"
      (keydown)="group.onKeydown($event, this)"
    >
      <span class="swatch-fill" [style.background]="fill()"><ng-content /></span>
    </button>
  `,
    styleUrls: ['./swatch.component.scss'],
    host: {
        '[class]': "'size-' + group.size() + ' shape-' + group.shape()",
        '[class.selected]': 'selected()',
        '[class.unavailable]': 'unavailable()',
        '[class.disabled]': 'isDisabled()',
        '[hidden]': '!group.isShown(this)'
    }
})
export class NbSwatchComponent<T = unknown> implements OnInit {
    protected readonly group = inject(NB_SWATCH_GROUP)
    protected readonly texts = injectNbSwatchTexts()
    protected readonly button = viewChild.required<ElementRef<HTMLButtonElement>>('button')

    /** The value the group's value holds while the swatch is chosen. */
    readonly value = input.required<T>()

    /** The swatch's name, e.g. "Black/White", which assistive technologies read and its tooltip shows. */
    readonly label = input.required<string>()

    /**
     * Its colour, any CSS colour, or its colours, side by side: two split corner to corner, more in equal slices around
     * its middle.
     */
    readonly color = input<string | string[]>()

    /** A picture that fills it, by its address, e.g. a fabric's or a finish's; over `color`. */
    readonly image = input<string>()

    /** Its option is out of stock, or otherwise unavailable: it's faded and struck through, and can still be chosen. */
    readonly unavailable = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /** It can't be chosen; the group's `disabled` disables every swatch. */
    readonly disabled = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /** Whether its inputs are set: the group reads a swatch's value once they are. */
    readonly ready = signal(false)

    readonly selected = computed(() => this.group.isSelected(this))
    readonly isDisabled = computed(() => this.disabled() || this.group.isDisabled())

    protected readonly name = computed(() => (this.unavailable() ? `${this.label()}, ${this.texts().unavailable}` : this.label()))

    /** What fills it: the picture, or the colours. */
    protected readonly fill = computed(() => {
        const image = this.image()
        if (image) {
            return `center / cover no-repeat ${cssUrl(image)}`
        }
        const colors = [this.color() ?? []].flat().filter(Boolean)
        if (colors.length < 2) {
            return colors[0] ?? null
        }
        if (colors.length === 2) {
            return `linear-gradient(135deg, ${colors[0]} 50%, ${colors[1]} 50%)`
        }
        const slice = 360 / colors.length
        return `conic-gradient(${colors.map((color, index) => `${color} ${index * slice}deg ${(index + 1) * slice}deg`).join(', ')})`
    })

    ngOnInit() {
        this.ready.set(true)
    }

    /** Moves the keyboard focus to the swatch. */
    focus() {
        this.button().nativeElement.focus()
    }
}
