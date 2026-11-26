import {
    Component,
    computed,
    contentChild,
    contentChildren,
    DestroyRef,
    effect,
    ElementRef,
    forwardRef,
    inject,
    Injector,
    input,
    linkedSignal,
    model,
    numberAttribute,
    output,
    signal,
    untracked,
    viewChildren
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { outputToObservable, takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { EMPTY, fromEvent, merge } from 'rxjs'
import { filter, map, switchMap } from 'rxjs/operators'

import { injectNbDefaults, NbLayoutDirectionService, NbStatusService, ɵisComposing as isComposing, ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput, NbComponentSize, ɵenableTransitionsAfterRender as enableTransitionsAfterRender, ɵsameControlValue as sameControlValue } from '@liquid-js/lyr-core/base'
import { NbFocusMonitor, ɵNbActiveDescendantKeyManager as NbActiveDescendantKeyManager, ɵNbActiveDescendantKeyManagerFactoryService as NbActiveDescendantKeyManagerFactoryService } from '@liquid-js/lyr-core/cdk'
import { COMMA, ENTER, SEMICOLON, SPACE, TAB } from '@angular/cdk/keycodes'
import { NbValidationDirective } from '@liquid-js/lyr-core/validation'
import { NbAutocompleteRef } from '../autocomplete/autocomplete-ref'
import { NbTagComponent } from './tag.component'
import { NB_TAG_LIST_SIZE } from './tag-list-size'
import { NbTagInputDirective } from './tag-input.directive'

// The characters separator keys type, which also split pasted or blurred text into tags.
const SEPARATOR_CHARACTERS: Record<number, string> = { [COMMA]: ',', [SEMICOLON]: ';', [SPACE]: ' ', [TAB]: '\t', [ENTER]: '\n' }

/**
 * A list of `nb-tag`s, placed in it or managed from a value, with an optional `nbTagInput` to add more.
 *
 * @stacked-example(Tag List Showcase, tag/tag-showcase.component)
 *
 * Bound to a form control, `ngModel` or `[(value)]`, the tag list manages its tags: it shows one for each string of
 * the value, adds what's typed into its `nbTagInput` when a separator key is pressed, the input loses focus, or a
 * list is pasted, and removes tags with their cross or the Backspace or Delete key. Duplicates are skipped, and text
 * `tagValidator` rejects stays in the input to be corrected.
 *
 * Focused, the list moves through its tags with the arrow keys; Space selects the active tag (one at a time, unless
 * `multiple`), and Backspace or Delete removes it. Backspace in an empty input moves to the last tag.
 * @stacked-example(Form control, tag/tag-form.component)
 *
 * The input's `fieldSize`, `status` and `shape` style the whole list, as an `nbInput`'s style its field, and tags
 * placed in the list take its size unless they set their own. The list has a field's colours, but keeps its
 * background under the pointer, and a filled basic tag in it darkens under the pointer rather than lightening, so
 * the tags never match the field:
 * @stacked-example(Sizes, tag/tag-list-sizes.component)
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
 * tag-list-with-input-max-border-radius:
 */
@Component({
    selector: 'nb-tag-list',
    templateUrl: './tag-list.component.html',
    exportAs: 'nbTagList',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NbTagListComponent), multi: true },
        // Tags placed in the list take its size.
        { provide: NB_TAG_LIST_SIZE, useFactory: () => inject(NbTagListComponent).tagSize }
    ],
    imports: [NbTagComponent],
    host: {
        '[class]': '_inputClasses()',
        '[class.nb-tag-list-with-input]': '_hasInput()',
        '[class.focus]': '_isFocused()',
        '[class.disabled]': 'isDisabled()',
        '[class.input-full-width]': '_isFullWidth()',
        '[attr.tabindex]': 'tabIndex()',
        '[attr.role]': 'role()',
        '[attr.aria-multiselectable]': 'multiple()',
        '[attr.aria-activedescendant]': 'activeTagId()',
        '(keydown)': '_onKeydown($event)',
        '(click)': '_onClick($event)'
    }
})
export class NbTagListComponent implements ControlValueAccessor {
    // The app's defaults for this type, which the inputs below start from.
    protected readonly nbDefaults = injectNbDefaults('tag')

    protected readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef)
    protected readonly focusMonitor = inject(NbFocusMonitor)
    protected readonly activeDescendantKeyManagerFactory = inject(
        NbActiveDescendantKeyManagerFactoryService
    ) as NbActiveDescendantKeyManagerFactoryService<NbTagComponent>
    protected readonly directionService = inject(NbLayoutDirectionService)
    protected readonly statusService = inject(NbStatusService)
    protected readonly destroyRef = inject(DestroyRef)
    protected readonly validation = inject(NbValidationDirective, { self: true, optional: true })

    protected readonly contentTags = contentChildren(NbTagComponent)
    protected readonly valueTags = viewChildren(NbTagComponent)

    /**
     * All tags of the list: the ones it shows for its value, then the ones placed in it.
     */
    readonly tags = computed(() => [...this.valueTags(), ...this.contentTags()])
    readonly tagInput = contentChild(NbTagInputDirective)
    readonly autocompleteDirective = contentChild(NbAutocompleteRef)

    /**
     * The size of the tags and their spacing. With an `nbTagInput`, the input's `fieldSize` sizes the list and its tags
     * instead, as its `status` and `shape` style it.
     */
    readonly sizeInput = input<NbComponentSize | undefined>(undefined, { alias: 'size' })
    /** The size in use: the input's, the app's default, or 'medium'. */
    readonly size = linkedSignal<NbComponentSize>(() => this.sizeInput() ?? this.nbDefaults().size ?? 'medium')

    /** Tabindex of the list, e.g. `tabIndex="-1"`, as a select's. */
    readonly tabIndex = input<number, unknown>(0, { transform: numberAttribute })

    readonly role = input<string>('listbox')

    /** Lets several tags be selected at once; otherwise selecting a tag deselects the others. */
    readonly multiple = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * The tags, when the list manages them; usually bound through a form control or `ngModel` instead.
     * Leave it unset to place `nb-tag`s in the list yourself.
     */
    readonly value = model<string[]>()

    /**
     * Decides whether typed text can become a tag; rejected text stays in the input.
     */
    readonly tagValidator = input<(tag: string) => boolean>(() => true)

    /**
     * Whether text left in the input becomes tags when the input loses focus.
     */
    readonly addOnBlur = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty })

    /**
     * Whether the list shows and edits the tags of its value.
     */
    readonly managed = computed(() => this.value() !== undefined)

    /** Disables the list: its input, and removing its tags. */
    readonly disabled = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * Whether it's disabled: the `disabled` input, or the form's disabled state, whichever changed last. A managed list
     * sets its input's disabled state from this.
     */
    readonly isDisabled = linkedSignal(() => this.disabled())

    /**
     * Emits a tag the user removes, with its cross or the Backspace or Delete key. A managed list also takes it out of
     * its value; otherwise the app does.
     */
    readonly tagRemove = output<NbTagComponent>()

    protected readonly focused = signal(false)

    readonly activeTagId = signal<string | undefined>(undefined)

    protected readonly keyManager: NbActiveDescendantKeyManager<NbTagComponent> = this.activeDescendantKeyManagerFactory
        .create(this.tags, inject(Injector))
        .withHorizontalOrientation(this.directionService.getDirection())
        .withWrap()

    readonly _hasInput = computed(() => !!this.tagInput())

    readonly _isFocused = this.focused.asReadonly()

    readonly _isFullWidth = computed(() => !!this.tagInput()?.fullWidth())

    readonly _inputClasses = computed(() => {
        const tagInput = this.tagInput()
        if (tagInput) {
            return [
                `shape-${tagInput.shape()}`,
                `size-${tagInput.fieldSize()}`,
                // With `nbValidation`, the status it gives while the list shows errors or success.
                this.statusService.getStatusClass(this.validation?.status() ?? tagInput.status())
            ]
        }

        return [`size-${this.size()}`]
    })

    /** The size of the list's tags: its input's `fieldSize`, or its `size` without an input. */
    readonly tagSize = computed(() => this.tagInput()?.fieldSize() ?? this.size())

    protected onChange: (value: string[]) => void = () => undefined
    protected onTouched = () => {}

    constructor() {
        enableTransitionsAfterRender(this.hostElement.nativeElement)
        this.validation?.delegateAria()

        // The input carries the field's state for forms and assistive technology.
        effect(() => {
            const element = this.tagInput()?._hostElement.nativeElement
            if (element && this.managed()) {
                element.disabled = this.isDisabled()
            }
            if (element && this.validation) {
                setOrRemoveAttribute(element, 'aria-invalid', this.validation.ariaInvalid())
                setOrRemoveAttribute(element, 'aria-describedby', this.validation.describedBy())
                // An `nbLabel` names the input; without one, it keeps a name of its own.
                const labelledBy = this.validation.labelledBy()
                if (labelledBy) {
                    element.setAttribute('aria-labelledby', labelledBy)
                }
                setOrRemoveAttribute(element, 'aria-required', this.validation.ariaRequired())
            }
        })

        toObservable(this.tagInput)
            .pipe(
                switchMap((tagInput) => {
                    if (!tagInput) {
                        return EMPTY
                    }
                    const element = tagInput._hostElement.nativeElement
                    return merge(
                        outputToObservable(tagInput.tagAdd).pipe(map(() => 'separator')),
                        fromEvent(element, 'blur').pipe(
                            filter(() => this.addOnBlur()),
                            map(() => 'blur')
                        ),
                        // Pasted lists become tags once the text is in the input.
                        fromEvent(element, 'paste').pipe(map(() => 'paste'))
                    ).pipe(map((trigger) => ({ tagInput, trigger })))
                }),
                filter(() => this.managed() && !this.isDisabled()),
                takeUntilDestroyed()
            )
            .subscribe(({ tagInput, trigger }) => {
                if (trigger === 'paste') {
                    setTimeout(() => this.addFromInput(tagInput, true))
                } else {
                    this.addFromInput(tagInput, false)
                }
            })

        this.focusMonitor
            .monitor(this.hostElement, true)
            .pipe(
                map((origin) => !!origin),
                takeUntilDestroyed()
            )
            .subscribe((isFocused: boolean) => untracked(() => this.onFocusChange(isFocused)))
        this.destroyRef.onDestroy(() => this.focusMonitor.stopMonitoring(this.hostElement))

        this.keyManager.change
            .pipe(takeUntilDestroyed())
            .subscribe(() => this.activeTagId.set(this.keyManager.activeItem?._id))

        effect(() => this.keyManager.withHorizontalOrientation(this.directionService.direction()))

        // The autocomplete options open below the whole list, not just the input.
        effect(() => this.autocompleteDirective()?.overlayHost.set(this.hostElement))

        effect(() => {
            if (this.tags().length === 0) {
                untracked(() => this.focusInputIfActive())
            }
        })

        const tags$ = toObservable(this.tags)
        tags$
            .pipe(
                switchMap((tags) => merge(...tags.map((tag) => outputToObservable(tag.remove)))),
                takeUntilDestroyed()
            )
            .subscribe((tagToRemove: NbTagComponent) => {
                this.tagRemove.emit(tagToRemove)
                if (this.managed() && !this.isDisabled() && this.valueTags().includes(tagToRemove)) {
                    this.setValue((this.value() ?? []).filter((tag) => tag !== tagToRemove.text()))
                }
            })

        tags$
            .pipe(
                switchMap((tags) => merge(...tags.map((tag) => tag.destroy$))),
                filter((destroyedTag: NbTagComponent) => destroyedTag === this.keyManager.activeItem),
                map((destroyedTag: NbTagComponent) => destroyedTag === this.tags().at(-1)),
                takeUntilDestroyed()
            )
            .subscribe((isLastTagDestroyed: boolean) => {
                if (isLastTagDestroyed) {
                    this.keyManager.setPreviousItemActive()
                } else {
                    this.keyManager.setNextItemActive()
                }
            })
    }

    _onKeydown(event: KeyboardEvent) {
        const tagInput = this.tagInput()
        if (event.target === this.hostElement.nativeElement) {
            this.handleListKeydown(event)
        } else if (tagInput && event.target === tagInput._hostElement.nativeElement) {
            this.handleInputKeydown(event, tagInput)
        }
    }

    _onClick({ target }: MouseEvent) {
    // The tag clicked anywhere in, e.g. on its text, but not on its remove button, which removes it.
        const element = target instanceof Element ? target : null
        const clickedTag = element?.closest('.nb-tag-remove')
            ? undefined
            : this.tags().find((tag: NbTagComponent) => tag._hostElement.nativeElement.contains(element))
        if (clickedTag) {
            this.toggleTag(clickedTag)
            this.keyManager.setActiveItem(clickedTag)
        }
    }

    protected handleListKeydown(event: KeyboardEvent) {
        this.keyManager.onKeydown(event)

        const activeTag = this.keyManager.activeItem
        if (!activeTag) {
            return
        }
        if (event.key === ' ') {
            this.toggleTag(activeTag)
            // Prevents page scroll.
            event.preventDefault()
        } else if (this.isBackspaceOrDelete(event.key)) {
            activeTag._remove()
            // Backspace's default action outside a text field is going back, in Safari and others.
            event.preventDefault()
        }
    }

    protected handleInputKeydown(event: KeyboardEvent, tagInput: NbTagInputDirective) {
        if (tagInput._value === '' && this.isBackspaceOrDelete(event.key) && !isComposing(event) && this.tags().length > 0) {
            // Focus moves to the list before the key's default action runs, which there would be going back.
            event.preventDefault()
            this.hostElement.nativeElement.focus()
            this.keyManager.setLastItemActive()
        }
    }

    // Untracked, as forms write values from wherever the app sets them, e.g. an effect that mustn't come to depend
    // on the control.
    writeValue(value?: string[] | null) {
        untracked(() => {
            const next = value ?? []
            if (!sameControlValue(this.value(), next)) {
                this.value.set(next)
            }
        })
    }

    registerOnChange(fn: (value: string[]) => void) {
        this.onChange = fn
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn
    }

    setDisabledState(isDisabled: boolean) {
        this.isDisabled.set(isDisabled)
    }

    /**
     * Adds tags to a managed list, skipping empty ones and ones it already has.
     */
    addTags(tags: string[]) {
        const value = this.value() ?? []
        const added = tags
            .map((tag) => tag.trim())
            .filter((tag, i, all) => tag && !value.includes(tag) && all.indexOf(tag) === i)
        if (added.length) {
            this.setValue([...value, ...added])
        }
    }

    protected setValue(value: string[]) {
        this.value.set(value)
        this.onChange(value)
    }

    // Turns the input's text into tags; with `whenSeparated`, only when it holds separated parts, as a pasted list does.
    protected addFromInput(tagInput: NbTagInputDirective, whenSeparated: boolean) {
        const separators = [...new Set([...tagInput.separatorKeys().map((key) => SEPARATOR_CHARACTERS[key]), '\n'])]
            .filter(Boolean)
        const parts = this.split(tagInput._value, separators)
        if (whenSeparated && parts.length < 2) {
            return
        }
        const validator = this.tagValidator()
        const value = this.value() ?? []
        const rejected = parts.filter((part) => !value.includes(part) && !validator(part))
        this.addTags(parts.filter((part) => validator(part)))
        // Rejected parts stay in the input, separated as they were typed.
        const separator = separators.find((candidate) => candidate.trim()) ?? ''
        tagInput._hostElement.nativeElement.value = rejected.join(`${separator} `)
    }

    protected split(text: string, separators: string[]): string[] {
        let parts = [text]
        for (const separator of separators) {
            parts = parts.flatMap((part) => part.split(separator))
        }
        return parts.map((part) => part.trim()).filter(Boolean)
    }

    protected onFocusChange(isFocused: boolean) {
        this.focused.set(isFocused)
        if (!isFocused) {
            this.onTouched()
        }

        if (!isFocused || this.tagInput()?.focused()) {
            this.keyManager.setActiveItem(-1)
            return
        }

        // Focus input when focusing tag list without tags. Otherwise select first tag.
        if (this.tags().length === 0 && this._hasInput()) {
            this.focusInput()
        } else {
            this.keyManager.setFirstItemActive()
        }
    }

    protected isBackspaceOrDelete(key: string): boolean {
        return key === 'Backspace' || key === 'Delete'
    }

    protected toggleTag(tagToToggle: NbTagComponent) {
        tagToToggle._toggleSelection()

        if (tagToToggle.isSelected() && !this.multiple()) {
            this.tags().forEach((tag: NbTagComponent) => {
                if (tag !== tagToToggle) {
                    tag.setSelected(false)
                }
            })
        }
    }

    protected focusInput() {
        this.tagInput()?._hostElement.nativeElement.focus()
    }

    protected focusInputIfActive() {
        if (this._isFocused()) {
            this.focusInput()
        }
    }
}

function setOrRemoveAttribute(element: HTMLElement, name: string, value: string | null) {
    if (value === null) {
        element.removeAttribute(name)
    } else {
        element.setAttribute(name, value)
    }
}
