import {
    Component,
    computed,
    ElementRef,
    inject,
    input,
    linkedSignal,
    OnDestroy,
    output,
    signal
} from '@angular/core'
import { Observable, Subject } from 'rxjs'

import { injectNbDefaults, NbStatusService, ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput, NbComponentOrCustomStatus, NbComponentSize, ɵenableTransitionsAfterRender as enableTransitionsAfterRender, injectNbTexts, NbLocalize, type NbTagAppearance } from '@liquid-js/lyr-core/base'
import { ɵNbHighlightableOption as NbHighlightableOption } from '@liquid-js/lyr-core/cdk'
import { NbIconComponent } from '@liquid-js/lyr-core/icon'
import { NB_TAG_LIST_SIZE } from './tag-list-size'

/** @internal */
declare const $localize: NbLocalize
export interface NbTagSelectionChange {
    tag: NbTagComponent
    selected: boolean
}

let tagUniqueId = 0

/**
 * A small label with a status, on its own or in an `nb-tag-list`, where it can be selected and removed.
 *
 * With `removable`, the tag shows a cross and emits `remove` when the cross is clicked or Backspace or Delete is
 * pressed on it:
 *
 * @stacked-example(Removable tags, tag/tag-removable.component)
 *
 * The `appearance` is `filled` (default), `outline` or `hero`, the hero button's gradient:
 * @stacked-example(Tag Appearance, tag/tag-appearance.component)
 *
 * The `status` colours it:
 * @stacked-example(Tag Status, tag/tag-status.component)
 * @styles
 *
 * tag-text-font-family:
 * tag-text-transform:
 * tag-border-width:
 * tag-border-style:
 * tag-border-radius:
 * tag-tiny-text-font-size:
 * tag-tiny-text-font-weight:
 * tag-tiny-text-line-height:
 * tag-tiny-padding:
 * tag-tiny-close-offset:
 * tag-small-text-font-size:
 * tag-small-text-font-weight:
 * tag-small-text-line-height:
 * tag-small-padding:
 * tag-small-close-offset:
 * tag-medium-text-font-size:
 * tag-medium-text-font-weight:
 * tag-medium-text-line-height:
 * tag-medium-padding:
 * tag-medium-close-offset:
 * tag-large-text-font-size:
 * tag-large-text-font-weight:
 * tag-large-text-line-height:
 * tag-large-padding:
 * tag-large-close-offset:
 * tag-giant-text-font-size:
 * tag-giant-text-font-weight:
 * tag-giant-text-line-height:
 * tag-giant-padding:
 * tag-giant-close-offset:
 * tag-filled-basic-background-color:
 * tag-filled-basic-border-color:
 * tag-filled-basic-text-color:
 * tag-filled-basic-active-background-color:
 * tag-filled-basic-active-border-color:
 * tag-filled-basic-hover-background-color:
 * tag-filled-basic-hover-border-color:
 * tag-filled-basic-selected-background-color:
 * tag-filled-basic-selected-border-color:
 * tag-filled-primary-background-color:
 * tag-filled-primary-border-color:
 * tag-filled-primary-text-color:
 * tag-filled-primary-active-background-color:
 * tag-filled-primary-active-border-color:
 * tag-filled-primary-hover-background-color:
 * tag-filled-primary-hover-border-color:
 * tag-filled-primary-selected-background-color:
 * tag-filled-primary-selected-border-color:
 * tag-filled-success-background-color:
 * tag-filled-success-border-color:
 * tag-filled-success-text-color:
 * tag-filled-success-active-background-color:
 * tag-filled-success-active-border-color:
 * tag-filled-success-hover-background-color:
 * tag-filled-success-hover-border-color:
 * tag-filled-success-selected-background-color:
 * tag-filled-success-selected-border-color:
 * tag-filled-info-background-color:
 * tag-filled-info-border-color:
 * tag-filled-info-text-color:
 * tag-filled-info-active-background-color:
 * tag-filled-info-active-border-color:
 * tag-filled-info-hover-background-color:
 * tag-filled-info-hover-border-color:
 * tag-filled-info-selected-background-color:
 * tag-filled-info-selected-border-color:
 * tag-filled-warning-background-color:
 * tag-filled-warning-border-color:
 * tag-filled-warning-text-color:
 * tag-filled-warning-active-background-color:
 * tag-filled-warning-active-border-color:
 * tag-filled-warning-hover-background-color:
 * tag-filled-warning-hover-border-color:
 * tag-filled-warning-selected-background-color:
 * tag-filled-warning-selected-border-color:
 * tag-filled-danger-background-color:
 * tag-filled-danger-border-color:
 * tag-filled-danger-text-color:
 * tag-filled-danger-active-background-color:
 * tag-filled-danger-active-border-color:
 * tag-filled-danger-hover-background-color:
 * tag-filled-danger-hover-border-color:
 * tag-filled-danger-selected-background-color:
 * tag-filled-danger-selected-border-color:
 * tag-filled-control-background-color:
 * tag-filled-control-border-color:
 * tag-filled-control-text-color:
 * tag-filled-control-active-background-color:
 * tag-filled-control-active-border-color:
 * tag-filled-control-hover-background-color:
 * tag-filled-control-hover-border-color:
 * tag-filled-control-selected-background-color:
 * tag-filled-control-selected-border-color:
 * tag-outline-basic-background-color:
 * tag-outline-basic-border-color:
 * tag-outline-basic-text-color:
 * tag-outline-basic-active-background-color:
 * tag-outline-basic-active-border-color:
 * tag-outline-basic-active-text-color:
 * tag-outline-basic-hover-background-color:
 * tag-outline-basic-hover-border-color:
 * tag-outline-basic-hover-text-color:
 * tag-outline-basic-selected-background-color:
 * tag-outline-basic-selected-border-color:
 * tag-outline-basic-selected-text-color:
 * tag-outline-primary-background-color:
 * tag-outline-primary-border-color:
 * tag-outline-primary-text-color:
 * tag-outline-primary-active-background-color:
 * tag-outline-primary-active-border-color:
 * tag-outline-primary-active-text-color:
 * tag-outline-primary-hover-background-color:
 * tag-outline-primary-hover-border-color:
 * tag-outline-primary-hover-text-color:
 * tag-outline-primary-selected-background-color:
 * tag-outline-primary-selected-border-color:
 * tag-outline-primary-selected-text-color:
 * tag-outline-success-background-color:
 * tag-outline-success-border-color:
 * tag-outline-success-text-color:
 * tag-outline-success-active-background-color:
 * tag-outline-success-active-border-color:
 * tag-outline-success-active-text-color:
 * tag-outline-success-hover-background-color:
 * tag-outline-success-hover-border-color:
 * tag-outline-success-hover-text-color:
 * tag-outline-success-selected-background-color:
 * tag-outline-success-selected-border-color:
 * tag-outline-success-selected-text-color:
 * tag-outline-info-background-color:
 * tag-outline-info-border-color:
 * tag-outline-info-text-color:
 * tag-outline-info-active-background-color:
 * tag-outline-info-active-border-color:
 * tag-outline-info-active-text-color:
 * tag-outline-info-hover-background-color:
 * tag-outline-info-hover-border-color:
 * tag-outline-info-hover-text-color:
 * tag-outline-info-selected-background-color:
 * tag-outline-info-selected-border-color:
 * tag-outline-info-selected-text-color:
 * tag-outline-warning-background-color:
 * tag-outline-warning-border-color:
 * tag-outline-warning-text-color:
 * tag-outline-warning-active-background-color:
 * tag-outline-warning-active-border-color:
 * tag-outline-warning-active-text-color:
 * tag-outline-warning-hover-background-color:
 * tag-outline-warning-hover-border-color:
 * tag-outline-warning-hover-text-color:
 * tag-outline-warning-selected-background-color:
 * tag-outline-warning-selected-border-color:
 * tag-outline-warning-selected-text-color:
 * tag-outline-danger-background-color:
 * tag-outline-danger-border-color:
 * tag-outline-danger-text-color:
 * tag-outline-danger-active-background-color:
 * tag-outline-danger-active-border-color:
 * tag-outline-danger-active-text-color:
 * tag-outline-danger-hover-background-color:
 * tag-outline-danger-hover-border-color:
 * tag-outline-danger-hover-text-color:
 * tag-outline-danger-selected-background-color:
 * tag-outline-danger-selected-border-color:
 * tag-outline-danger-selected-text-color:
 * tag-outline-control-background-color:
 * tag-outline-control-border-color:
 * tag-outline-control-text-color:
 * tag-outline-control-active-background-color:
 * tag-outline-control-active-border-color:
 * tag-outline-control-active-text-color:
 * tag-outline-control-hover-background-color:
 * tag-outline-control-hover-border-color:
 * tag-outline-control-hover-text-color:
 * tag-outline-control-selected-background-color:
 * tag-outline-control-selected-border-color:
 * tag-outline-control-selected-text-color:
 * tag-hero-text-shadow:
 * tag-hero-basic-text-color:
 * tag-hero-basic-left-background-color:
 * tag-hero-basic-right-background-color:
 * tag-hero-basic-active-left-background-color:
 * tag-hero-basic-active-right-background-color:
 * tag-hero-basic-hover-left-background-color:
 * tag-hero-basic-hover-right-background-color:
 * tag-hero-basic-selected-left-background-color:
 * tag-hero-basic-selected-right-background-color:
 * tag-hero-primary-text-color:
 * tag-hero-primary-left-background-color:
 * tag-hero-primary-right-background-color:
 * tag-hero-primary-active-left-background-color:
 * tag-hero-primary-active-right-background-color:
 * tag-hero-primary-hover-left-background-color:
 * tag-hero-primary-hover-right-background-color:
 * tag-hero-primary-selected-left-background-color:
 * tag-hero-primary-selected-right-background-color:
 * tag-hero-success-text-color:
 * tag-hero-success-left-background-color:
 * tag-hero-success-right-background-color:
 * tag-hero-success-active-left-background-color:
 * tag-hero-success-active-right-background-color:
 * tag-hero-success-hover-left-background-color:
 * tag-hero-success-hover-right-background-color:
 * tag-hero-success-selected-left-background-color:
 * tag-hero-success-selected-right-background-color:
 * tag-hero-info-text-color:
 * tag-hero-info-left-background-color:
 * tag-hero-info-right-background-color:
 * tag-hero-info-active-left-background-color:
 * tag-hero-info-active-right-background-color:
 * tag-hero-info-hover-left-background-color:
 * tag-hero-info-hover-right-background-color:
 * tag-hero-info-selected-left-background-color:
 * tag-hero-info-selected-right-background-color:
 * tag-hero-warning-text-color:
 * tag-hero-warning-left-background-color:
 * tag-hero-warning-right-background-color:
 * tag-hero-warning-active-left-background-color:
 * tag-hero-warning-active-right-background-color:
 * tag-hero-warning-hover-left-background-color:
 * tag-hero-warning-hover-right-background-color:
 * tag-hero-warning-selected-left-background-color:
 * tag-hero-warning-selected-right-background-color:
 * tag-hero-danger-text-color:
 * tag-hero-danger-left-background-color:
 * tag-hero-danger-right-background-color:
 * tag-hero-danger-active-left-background-color:
 * tag-hero-danger-active-right-background-color:
 * tag-hero-danger-hover-left-background-color:
 * tag-hero-danger-hover-right-background-color:
 * tag-hero-danger-selected-left-background-color:
 * tag-hero-danger-selected-right-background-color:
 * tag-hero-control-text-color:
 * tag-hero-control-left-background-color:
 * tag-hero-control-right-background-color:
 * tag-hero-control-active-left-background-color:
 * tag-hero-control-active-right-background-color:
 * tag-hero-control-hover-left-background-color:
 * tag-hero-control-hover-right-background-color:
 * tag-hero-control-selected-left-background-color:
 * tag-hero-control-selected-right-background-color:
 */
@Component({
    selector: 'nb-tag',
    templateUrl: './tag.component.html',
    exportAs: 'nbTag',
    imports: [NbIconComponent],
    host: {
        '[class]': 'hostClasses()',
        '[class.selected]': 'isSelected()',
        '[attr.aria-selected]': "role() === 'option' ? isSelected() : null",
        '[class.active]': '_isActive()',
        '[attr.role]': 'role()',
        '[attr.id]': '_id',
        '(keydown.delete)': '_remove()',
        '(keydown.backspace)': '_remove()'
    }
})
export class NbTagComponent implements OnDestroy, NbHighlightableOption {
    // The app's defaults for this type, which the inputs below start from.
    protected readonly nbDefaults = injectNbDefaults('tag')

    readonly _hostElement = inject(ElementRef)
    protected readonly statusService = inject(NbStatusService)

    private _destroy$: Subject<NbTagComponent> = new Subject<NbTagComponent>()

    get destroy$(): Observable<NbTagComponent> {
        return this._destroy$.asObservable()
    }

    /**
     * Tag text.
     */
    readonly text = input<string>()

    /**
     * Selects the tag, until a click or its list changes that; see `isSelected`.
     */
    readonly selected = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * Shows a cross and lets the user remove the tag; see `remove`.
     */
    readonly removable = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * Icon of the cross.
     */
    readonly removeIcon = input<string>('close-outline')

    /**
     * Pack of the cross's icon.
     */
    readonly removeIconPack = input<string>('essentials')

    /**
     * `filled` (default), `outline` or `hero`.
     */
    readonly appearanceInput = input<NbTagAppearance | undefined>(undefined, { alias: 'appearance' })
    /** The appearance in use: the input's, the app's default, or 'filled'. */
    readonly appearance = linkedSignal<NbTagAppearance>(() => this.appearanceInput() ?? this.nbDefaults().appearance ?? 'filled')

    /**
     * `basic` (default), `primary`, `info`, `success`, `warning`, `danger`, `control` or a custom status.
     */
    readonly status = input<NbComponentOrCustomStatus>('basic')

    /**
     * Tag size: `tiny`, `small`, `medium`, `large`, `giant`. A tag in an `nb-tag-list` takes the list's size unless it
     * sets one; others are `medium`.
     */
    readonly sizeInput = input<NbComponentSize | undefined>(undefined, { alias: 'size' })

    protected readonly listSize = inject(NB_TAG_LIST_SIZE, { optional: true })
    // A tag in a tag list is one of its options; one on its own has a remove button the keyboard reaches.
    protected readonly inList = this.listSize !== null
    protected readonly texts = injectNbTexts('tag', () => ({
        remove: (text) => $localize`:@@nb.tag.remove:Remove ${text}:text:`
    }))

    /** The tag's size: its own, its list's, or `medium`. */
    readonly size = computed(() => this.sizeInput() ?? this.listSize?.() ?? this.nbDefaults().size ?? 'medium')

    /** The tag's role: `option` in a tag list, none on its own. */
    readonly roleInput = input<string | undefined>(undefined, { alias: 'role' })
    readonly role = computed(() => this.roleInput() ?? (this.inList ? 'option' : null))

    /**
     * Emits when the user removes a `removable` tag, with its cross or the Backspace or Delete key. The tag stays until
     * the app, or a managed `nb-tag-list`, takes it out.
     */
    readonly remove = output<NbTagComponent>()

    readonly selectedChange = output<NbTagSelectionChange>()

    /**
     * Whether the tag is selected: the `selected` input, until a user or the tag list changes it.
     */
    readonly isSelected = linkedSignal(() => this.selected())

    protected readonly activeState = signal(false)
    readonly _isActive = this.activeState.asReadonly()

    readonly _id: string = `nb-tag-${tagUniqueId++}`

    protected readonly hostClasses = computed(() => [
        `appearance-${this.appearance()}`,
        this.statusService.getStatusClass(this.status()),
        `size-${this.size()}`
    ])

    _remove() {
        if (this.removable()) {
            this.remove.emit(this)
        }
    }

    constructor() {
        enableTransitionsAfterRender(this._hostElement.nativeElement)
    }

    ngOnDestroy() {
        this._destroy$.next(this)
    }

    /**
     * Selects or deselects the tag and emits `selectedChange` when that changes its state.
     */
    setSelected(selected: boolean) {
        if (this.isSelected() !== selected) {
            this.isSelected.set(selected)
            this.selectedChange.emit({ tag: this, selected })
        }
    }

    _toggleSelection() {
        this.setSelected(!this.isSelected())
    }

    setActiveStyles() {
        this.activeState.set(true)
    }

    setInactiveStyles() {
        this.activeState.set(false)
    }
}
