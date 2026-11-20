import { Directive, ElementRef, inject, input, output } from '@angular/core'

import { ENTER } from '@angular/cdk/keycodes'
import { NbFormFieldControl } from '@liquid-js/lyr-core/form-field'
import { NbInputDirective } from '@liquid-js/lyr-core/input'
import { NbAutocompleteDirective } from '../autocomplete/autocomplete.directive'

export interface NbTagInputAddEvent {
    input: ElementRef<HTMLInputElement>
    value: string
}

/**
 * An input in an `nb-tag-list` that adds tags: it emits `tagAdd` on a separator key, and a managed list turns its
 * text into tags. It's an `nbInput`, and its `fieldSize`, `status` and `shape` style the whole list.
 *
 * @stacked-example(Tag Input, tag/tag-input.component)
 * @additional-example(Tag Input with Autocomplete, tag/tag-input-with-autocomplete.component)
 * @styles
 *
 * tag-list-tiny-tag-offset:
 * tag-list-small-tag-offset:
 * tag-list-medium-tag-offset:
 * tag-list-large-tag-offset:
 * tag-list-giant-tag-offset:
 * tag-list-with-input-tiny-padding:
 * tag-list-with-input-small-padding:
 * tag-list-with-input-medium-padding:
 * tag-list-with-input-large-padding:
 * tag-list-with-input-giant-padding:
 * tag-list-with-input-rectangle-border-radius:
 * tag-list-with-input-semi-round-border-radius:
 * tag-list-with-input-round-border-radius:
 * tag-input-min-width:
 * tag-input-text-font-family:
 * tag-input-placeholder-text-font-family:
 * tag-input-basic-background-color:
 * tag-input-basic-border-color:
 * tag-input-basic-text-color:
 * tag-input-basic-placeholder-text-color:
 * tag-input-basic-focus-background-color:
 * tag-input-basic-focus-border-color:
 * tag-input-basic-hover-background-color:
 * tag-input-basic-hover-border-color:
 * tag-input-basic-focus-and-hover-background-color:
 * tag-input-basic-focus-and-hover-border-color:
 * tag-input-basic-disabled-background-color:
 * tag-input-basic-disabled-border-color:
 * tag-input-basic-disabled-text-color:
 * tag-input-basic-disabled-placeholder-text-color:
 * tag-input-primary-background-color:
 * tag-input-primary-border-color:
 * tag-input-primary-text-color:
 * tag-input-primary-placeholder-text-color:
 * tag-input-primary-focus-background-color:
 * tag-input-primary-focus-border-color:
 * tag-input-primary-hover-background-color:
 * tag-input-primary-hover-border-color:
 * tag-input-primary-focus-and-hover-background-color:
 * tag-input-primary-focus-and-hover-border-color:
 * tag-input-primary-disabled-background-color:
 * tag-input-primary-disabled-border-color:
 * tag-input-primary-disabled-text-color:
 * tag-input-primary-disabled-placeholder-text-color:
 * tag-input-success-background-color:
 * tag-input-success-border-color:
 * tag-input-success-text-color:
 * tag-input-success-placeholder-text-color:
 * tag-input-success-focus-background-color:
 * tag-input-success-focus-border-color:
 * tag-input-success-hover-background-color:
 * tag-input-success-hover-border-color:
 * tag-input-success-focus-and-hover-background-color:
 * tag-input-success-focus-and-hover-border-color:
 * tag-input-success-disabled-background-color:
 * tag-input-success-disabled-border-color:
 * tag-input-success-disabled-text-color:
 * tag-input-success-disabled-placeholder-text-color:
 * tag-input-info-background-color:
 * tag-input-info-border-color:
 * tag-input-info-text-color:
 * tag-input-info-placeholder-text-color:
 * tag-input-info-focus-background-color:
 * tag-input-info-focus-border-color:
 * tag-input-info-hover-background-color:
 * tag-input-info-hover-border-color:
 * tag-input-info-focus-and-hover-background-color:
 * tag-input-info-focus-and-hover-border-color:
 * tag-input-info-disabled-background-color:
 * tag-input-info-disabled-border-color:
 * tag-input-info-disabled-text-color:
 * tag-input-info-disabled-placeholder-text-color:
 * tag-input-warning-background-color:
 * tag-input-warning-border-color:
 * tag-input-warning-text-color:
 * tag-input-warning-placeholder-text-color:
 * tag-input-warning-focus-background-color:
 * tag-input-warning-focus-border-color:
 * tag-input-warning-hover-background-color:
 * tag-input-warning-hover-border-color:
 * tag-input-warning-focus-and-hover-background-color:
 * tag-input-warning-focus-and-hover-border-color:
 * tag-input-warning-disabled-background-color:
 * tag-input-warning-disabled-border-color:
 * tag-input-warning-disabled-text-color:
 * tag-input-warning-disabled-placeholder-text-color:
 * tag-input-danger-background-color:
 * tag-input-danger-border-color:
 * tag-input-danger-text-color:
 * tag-input-danger-placeholder-text-color:
 * tag-input-danger-focus-background-color:
 * tag-input-danger-focus-border-color:
 * tag-input-danger-hover-background-color:
 * tag-input-danger-hover-border-color:
 * tag-input-danger-focus-and-hover-background-color:
 * tag-input-danger-focus-and-hover-border-color:
 * tag-input-danger-disabled-background-color:
 * tag-input-danger-disabled-border-color:
 * tag-input-danger-disabled-text-color:
 * tag-input-danger-disabled-placeholder-text-color:
 * tag-input-control-background-color:
 * tag-input-control-border-color:
 * tag-input-control-text-color:
 * tag-input-control-placeholder-text-color:
 * tag-input-control-focus-background-color:
 * tag-input-control-focus-border-color:
 * tag-input-control-hover-background-color:
 * tag-input-control-hover-border-color:
 * tag-input-control-focus-and-hover-background-color:
 * tag-input-control-focus-and-hover-border-color:
 * tag-input-control-disabled-background-color:
 * tag-input-control-disabled-border-color:
 * tag-input-control-disabled-text-color:
 * tag-input-control-disabled-placeholder-text-color:
 * tag-input-tiny-text-font-size:
 * tag-input-tiny-text-font-weight:
 * tag-input-tiny-text-line-height:
 * tag-input-tiny-placeholder-text-font-size:
 * tag-input-tiny-placeholder-text-font-weight:
 * tag-input-tiny-placeholder-text-line-height:
 * tag-input-tiny-padding:
 * tag-input-small-text-font-size:
 * tag-input-small-text-font-weight:
 * tag-input-small-text-line-height:
 * tag-input-small-placeholder-text-font-size:
 * tag-input-small-placeholder-text-font-weight:
 * tag-input-small-placeholder-text-line-height:
 * tag-input-small-padding:
 * tag-input-medium-text-font-size:
 * tag-input-medium-text-font-weight:
 * tag-input-medium-text-line-height:
 * tag-input-medium-placeholder-text-font-size:
 * tag-input-medium-placeholder-text-font-weight:
 * tag-input-medium-placeholder-text-line-height:
 * tag-input-medium-padding:
 * tag-input-large-text-font-size:
 * tag-input-large-text-font-weight:
 * tag-input-large-text-line-height:
 * tag-input-large-placeholder-text-font-size:
 * tag-input-large-placeholder-text-font-weight:
 * tag-input-large-placeholder-text-line-height:
 * tag-input-large-padding:
 * tag-input-giant-text-font-size:
 * tag-input-giant-text-font-weight:
 * tag-input-giant-text-line-height:
 * tag-input-giant-placeholder-text-font-size:
 * tag-input-giant-placeholder-text-font-weight:
 * tag-input-giant-placeholder-text-line-height:
 * tag-input-giant-padding:
 */
@Directive({
    selector: 'input[nbTagInput]',
    exportAs: 'nbTagInput',
    providers: [
        { provide: NbFormFieldControl, useExisting: NbTagInputDirective }
    ],
    host: {
        'class': 'nb-tag-input',
        '(keydown)': '_onKeydown($event)'
    }
})
export class NbTagInputDirective extends NbInputDirective {
    readonly _hostElement = inject<ElementRef<HTMLInputElement>>(ElementRef)
    protected readonly autocomplete = inject<NbAutocompleteDirective<unknown>>(
        NbAutocompleteDirective, { optional: true, self: true }
    )

    get _value(): string {
        return this._hostElement.nativeElement.value
    }

    /**
     * Key codes that emit `tagAdd`; Enter by default. A managed list also splits pasted text by the characters they
     * type.
     */
    readonly separatorKeys = input<number[]>([ENTER])

    /**
     * Emits the input's text when a separator key is pressed; an Enter that picks an autocomplete option doesn't.
     */
    readonly tagAdd = output<NbTagInputAddEvent>()

    // eslint-disable-next-line @typescript-eslint/no-deprecated -- separatorKeys are key codes, as Angular Material's separatorKeyCodes; a code also leaves out the Enter that ends an IME composition in Safari (229).
    _onKeydown({ keyCode }: KeyboardEvent) {
    // An Enter key that selects an autocomplete option adds that option rather than the typed text.
        if (this.isSeparatorKey(keyCode) && !(keyCode === ENTER && this.autocomplete?.hasActiveOption)) {
            this.tagAdd.emit({ value: this._value, input: this._hostElement })
        }
    }

    protected isSeparatorKey(keyCode: number): boolean {
        return this.separatorKeys().includes(keyCode)
    }
}
