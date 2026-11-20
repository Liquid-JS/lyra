import {
    AfterContentChecked,
    afterRenderEffect,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentRef,
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
    numberAttribute,
    OnDestroy,
    output,
    signal,
    untracked,
    viewChild
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { BehaviorSubject, EMPTY, merge, Observable } from 'rxjs'
import { filter, map, switchMap, take } from 'rxjs/operators'

import { injectNbDefaults, NbStatusService, ɵisComposing as isComposing, NbComponentSize, NbComponentShape, NbComponentOrCustomStatus, NB_DOCUMENT, NbLayoutDirectionService, ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput, ɵNbClassInput as NbClassInput, ɵenableTransitionsAfterRender as enableTransitionsAfterRender, injectNbTexts, NbLocalize, type NbSelectAppearance } from '@liquid-js/lyr-core/base'
import { NbAdjustableConnectedPositionStrategy, NbAdjustment, NbPosition, NbPositionBuilderService, NbOverlayRef, NbPortalDirective, NbScrollStrategy, NbOverlayService, NbTrigger, NbTriggerStrategy, NbTriggerStrategyBuilderService, NbFocusKeyManager, NbFocusKeyManagerFactoryService, ɵNbActiveDescendantKeyManager as NbActiveDescendantKeyManager, ɵNbActiveDescendantKeyManagerFactoryService as NbActiveDescendantKeyManagerFactoryService, NbFocusMonitor, NbScrollStrategies } from '@liquid-js/lyr-core/cdk'
import { NbInputDirective } from '@liquid-js/lyr-core/input'
import { NbValidationDirective } from '@liquid-js/lyr-core/validation'
import { NbFormFieldControl, NbFormFieldControlConfig } from '@liquid-js/lyr-core/form-field'
import { NbIconComponent } from '@liquid-js/lyr-core/icon'
import { NbOptionListComponent } from '../option/option-list.component'
import { NbTagComponent } from '../tag/tag.component'
import { NB_OPTION_LIST_ITEM, NbOptionListItem } from '../option/option-list-item'
import { NbOptionGroupComponent } from '../option/option-group.component'
import { NbOptionNestedComponent } from '../option/option-nested.component'
import { NbOptionComponent } from '../option/option.component'
import { NB_SELECT_INJECTION_TOKEN } from './select-injection-tokens'

/** @internal */
declare const $localize: NbLocalize

let lastSelectId = 0

// Case and accents don't count when searching, so "creme" finds "Crème".
const normalizeSearchText = (text: string) =>
    text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase().trim()

/**
 * Matches options whose text contains the query, ignoring case and accents.
 */
export function nbSelectSearchFn<T>(option: NbOptionComponent<T>, query: string): boolean {
    return normalizeSearchText(option.content ?? '').includes(normalizeSearchText(query))
}

// An option or nested option, of any value type, by where it is in the tree.
type NbNestedItem = Pick<NbOptionComponent | NbOptionNestedComponent, 'depth' | 'parentNested'>

export type NbSelectCompareFunction<T = unknown> = (v1: T, v2: T) => boolean

/**
 * Whether a select's `multiple` isn't given. Angular's template type checker doesn't apply a type parameter's default:
 * without a `multiple` binding it infers `M` as its whole constraint (or `any`), which no binding gives.
 */
type NbSelectMultipleUnset<M> = 0 extends 1 & M ? true : [NbBooleanInput] extends [M] ? true : false

/**
 * What a select gives in `selectedChange`, for options of value `T` and a `multiple` of `M`: one value, or `null` when
 * nothing is selected; with `multiple` (`true`, `''` or `'true'`), all selected values. A `multiple` bound to a
 * `boolean` that may be either gives either.
 */
export type NbSelectValue<T, M extends NbBooleanInput = NbBooleanInput> =
    NbSelectMultipleUnset<M> extends true ? T | null : M extends true | '' | 'true' ? T[] : T | null

@Component({
    selector: 'nb-select-label',
    template: '<ng-content />'
})
export class NbSelectLabelComponent {}

export function nbSelectFormFieldControlConfigFactory() {
    const config = new NbFormFieldControlConfig()
    config.supportsSuffix = false
    return config
}

/**
 * A dropdown that selects one of its `nb-option`s, or several with `multiple`.
 *
 * @stacked-example(Showcase, select/select-showcase.component)
 *
 * ### Installation
 *
 * Import `NbSelectComponent`, `NbOptionComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbSelectComponent, NbOptionComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbSelectModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbSelectModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * Marked `multiple`, the select works with arrays only: it accepts and emits arrays.
 *
 * Templates know which: `selectedChange` gives `T | null` for a single select and `T[]` for one marked `multiple`
 * (or `[multiple]="true"`), where `T` is the options' value type, so a handler can take exactly that. A `multiple`
 * bound to a `boolean` that may be either gives either. See `NbSelectValue`.
 * @stacked-example(Multiple, select/select-multiple.component)
 *
 * With `chips`, a multiple select shows its selected options as tags. The select keeps its background under the
 * pointer while it shows them, as a tag list with an input does, so the tags stay apart from the field:
 * @stacked-example(Chips, select/select-chips.component)
 *
 * With `searchable`, the open list has a search input that filters the options by their text, ignoring case and
 * accents; `searchFn` changes how options match. Focus stays in the input, and the arrow keys, Home, End and Enter
 * work the list:
 * @stacked-example(Search, select/select-search.component)
 *
 * In a multiple select, `<nb-option selectAll>` selects all enabled options (the ones a search shows), or clears them
 * when they're all selected; its checkbox shows when only some are. `maxSelections` caps how many options the user can
 * select, disabling the rest until one is deselected:
 * @stacked-example(Select all and limits, select/select-all.component)
 *
 * Long lists stay fast: with 100 or more options shown, the list lays out only the ones near its view, and the rest
 * keep their place in the scroll. Options are still written as usual, e.g. with `@for`, can differ in height, and work
 * with search, the keyboard and assistive technology; this applies to every list of `nb-option`s, including
 * autocomplete.
 *
 * An option without a value clears the selection, as writing `null` or `undefined` does.
 * @stacked-example(Clean selection, select/select-clean.component)
 *
 * With `nullable`, `null` is a value like any other: an option with a `null` value, e.g. "Auto", is selected and shown
 * when the value is `null`, and only options without a value clear the selection.
 * @stacked-example(Nullable, select/select-nullable.component)
 *
 * The `ghost` appearance shows no background or border until the select is hovered, focused or open:
 * @stacked-example(Ghost, input/input-ghost.component)
 *
 * The selection can be bound with the `selected` input:
 *
 * ```html
 * <nb-select [(selected)]="selected"></nb-select>
 * ```
 *
 * or with a form control or `ngModel`:
 * @stacked-example(Select form binding, select/select-form.component)
 *
 * `nb-option-group` groups options under a title:
 * @stacked-example(Grouping, select/select-groups.component)
 *
 * `nb-option-nested` puts options in a row that opens like a tree, as deep as needed; only options are selected, not
 * the nested options. The list shows up to `nestedLevels` levels at once (3 by default), and drills into deeper ones,
 * with a row to go back. The arrow keys move through the tree, Enter and Space open and close a row, and a search
 * shows the matching options with the nested options they're in:
 * @stacked-example(Nested options, select/select-nested.component)
 *
 * A `placeholder` shows while nothing is selected:
 * @stacked-example(Placeholder, select/select-placeholder.component)
 *
 * The select, single options and whole groups can be disabled:
 * @stacked-example(Disabled select, select/select-disabled.component)
 *
 * An `nb-select-label` in the content replaces the selected options' text while something is selected:
 * @stacked-example(Custom label, select/select-label.component)
 *
 * The `status` colours the select; it's `basic` by default:
 * @stacked-example(Select statuses, select/select-status.component)
 *
 * There are five sizes, `medium` by default:
 * @stacked-example(Select sizes, select/select-sizes.component)
 *
 * Besides `outline`, the `appearance` can be `filled`:
 * @stacked-example(Filled select, select/select-filled.component)
 *
 * and `hero`:
 * @stacked-example(Select colors, select/select-hero.component)
 *
 * The `shape` combines with the other properties:
 * @stacked-example(Select shapes, select/select-shapes.component)
 *
 * Options match the value by strict equality (`===`); `compareWith` changes how they match:
 * @stacked-example(Select custom comparator, select/select-compare-with.component)
 *
 * An `nb-form-field` adds an icon to the select:
 * @stacked-example(Select with icon, select/select-icon.component)
 * @additional-example(Interactive, select/select-interactive.component)
 * @styles
 *
 * select-cursor:
 * select-disabled-cursor:
 * select-ghost-background-color:
 * select-ghost-border-color:
 * select-tiny-width:
 * select-tiny-chips-margin:
 * select-small-width:
 * select-small-chips-margin:
 * select-medium-width:
 * select-medium-chips-margin:
 * select-large-width:
 * select-large-chips-margin:
 * select-giant-width:
 * select-giant-chips-margin:
 * select-icon-offset:
 * select-text-font-family:
 * select-placeholder-text-font-family:
 * select-tiny-text-font-size:
 * select-tiny-text-font-weight:
 * select-tiny-text-line-height:
 * select-tiny-placeholder-text-font-size:
 * select-tiny-placeholder-text-font-weight:
 * select-tiny-max-width:
 * select-small-text-font-size:
 * select-small-text-font-weight:
 * select-small-text-line-height:
 * select-small-placeholder-text-font-size:
 * select-small-placeholder-text-font-weight:
 * select-small-max-width:
 * select-medium-text-font-size:
 * select-medium-text-font-weight:
 * select-medium-text-line-height:
 * select-medium-placeholder-text-font-size:
 * select-medium-placeholder-text-font-weight:
 * select-medium-max-width:
 * select-large-text-font-size:
 * select-large-text-font-weight:
 * select-large-text-line-height:
 * select-large-placeholder-text-font-size:
 * select-large-placeholder-text-font-weight:
 * select-large-max-width:
 * select-giant-text-font-size:
 * select-giant-text-font-weight:
 * select-giant-text-line-height:
 * select-giant-placeholder-text-font-size:
 * select-giant-placeholder-text-font-weight:
 * select-giant-max-width:
 * select-rectangle-border-radius:
 * select-semi-round-border-radius:
 * select-round-border-radius:
 * select-outline-border-style:
 * select-outline-border-width:
 * select-outline-tiny-padding:
 * select-outline-small-padding:
 * select-outline-medium-padding:
 * select-outline-large-padding:
 * select-outline-giant-padding:
 * select-outline-basic-icon-color:
 * select-outline-basic-text-color:
 * select-outline-basic-placeholder-text-color:
 * select-outline-basic-background-color:
 * select-outline-basic-border-color:
 * select-outline-basic-focus-background-color:
 * select-outline-basic-focus-and-hover-background-color:
 * select-outline-basic-focus-and-hover-border-color:
 * select-outline-basic-focus-border-color:
 * select-outline-basic-hover-background-color:
 * select-outline-basic-hover-border-color:
 * select-outline-basic-disabled-background-color:
 * select-outline-basic-disabled-border-color:
 * select-outline-basic-disabled-icon-color:
 * select-outline-basic-disabled-text-color:
 * select-outline-primary-icon-color:
 * select-outline-primary-text-color:
 * select-outline-primary-placeholder-text-color:
 * select-outline-primary-background-color:
 * select-outline-primary-border-color:
 * select-outline-primary-focus-background-color:
 * select-outline-primary-focus-and-hover-background-color:
 * select-outline-primary-focus-and-hover-border-color:
 * select-outline-primary-focus-border-color:
 * select-outline-primary-hover-background-color:
 * select-outline-primary-hover-border-color:
 * select-outline-primary-disabled-background-color:
 * select-outline-primary-disabled-border-color:
 * select-outline-primary-disabled-icon-color:
 * select-outline-primary-disabled-text-color:
 * select-outline-success-icon-color:
 * select-outline-success-text-color:
 * select-outline-success-placeholder-text-color:
 * select-outline-success-background-color:
 * select-outline-success-border-color:
 * select-outline-success-focus-background-color:
 * select-outline-success-focus-and-hover-background-color:
 * select-outline-success-focus-and-hover-border-color:
 * select-outline-success-focus-border-color:
 * select-outline-success-hover-background-color:
 * select-outline-success-hover-border-color:
 * select-outline-success-disabled-background-color:
 * select-outline-success-disabled-border-color:
 * select-outline-success-disabled-icon-color:
 * select-outline-success-disabled-text-color:
 * select-outline-info-icon-color:
 * select-outline-info-text-color:
 * select-outline-info-placeholder-text-color:
 * select-outline-info-background-color:
 * select-outline-info-border-color:
 * select-outline-info-focus-background-color:
 * select-outline-info-focus-and-hover-background-color:
 * select-outline-info-focus-and-hover-border-color:
 * select-outline-info-focus-border-color:
 * select-outline-info-hover-background-color:
 * select-outline-info-hover-border-color:
 * select-outline-info-disabled-background-color:
 * select-outline-info-disabled-border-color:
 * select-outline-info-disabled-icon-color:
 * select-outline-info-disabled-text-color:
 * select-outline-warning-icon-color:
 * select-outline-warning-text-color:
 * select-outline-warning-placeholder-text-color:
 * select-outline-warning-background-color:
 * select-outline-warning-border-color:
 * select-outline-warning-focus-background-color:
 * select-outline-warning-focus-and-hover-background-color:
 * select-outline-warning-focus-and-hover-border-color:
 * select-outline-warning-focus-border-color:
 * select-outline-warning-hover-background-color:
 * select-outline-warning-hover-border-color:
 * select-outline-warning-disabled-background-color:
 * select-outline-warning-disabled-border-color:
 * select-outline-warning-disabled-icon-color:
 * select-outline-warning-disabled-text-color:
 * select-outline-danger-icon-color:
 * select-outline-danger-text-color:
 * select-outline-danger-placeholder-text-color:
 * select-outline-danger-background-color:
 * select-outline-danger-border-color:
 * select-outline-danger-focus-background-color:
 * select-outline-danger-focus-and-hover-background-color:
 * select-outline-danger-focus-and-hover-border-color:
 * select-outline-danger-focus-border-color:
 * select-outline-danger-hover-background-color:
 * select-outline-danger-hover-border-color:
 * select-outline-danger-disabled-background-color:
 * select-outline-danger-disabled-border-color:
 * select-outline-danger-disabled-icon-color:
 * select-outline-danger-disabled-text-color:
 * select-outline-control-icon-color:
 * select-outline-control-text-color:
 * select-outline-control-placeholder-text-color:
 * select-outline-control-background-color:
 * select-outline-control-border-color:
 * select-outline-control-focus-background-color:
 * select-outline-control-focus-and-hover-background-color:
 * select-outline-control-focus-and-hover-border-color:
 * select-outline-control-focus-border-color:
 * select-outline-control-hover-background-color:
 * select-outline-control-hover-border-color:
 * select-outline-control-disabled-background-color:
 * select-outline-control-disabled-border-color:
 * select-outline-control-disabled-icon-color:
 * select-outline-control-disabled-text-color:
 * select-outline-adjacent-border-style:
 * select-outline-adjacent-border-width:
 * select-outline-basic-open-border-color:
 * select-outline-basic-adjacent-border-color:
 * select-outline-primary-open-border-color:
 * select-outline-primary-adjacent-border-color:
 * select-outline-success-open-border-color:
 * select-outline-success-adjacent-border-color:
 * select-outline-info-open-border-color:
 * select-outline-info-adjacent-border-color:
 * select-outline-warning-open-border-color:
 * select-outline-warning-adjacent-border-color:
 * select-outline-danger-open-border-color:
 * select-outline-danger-adjacent-border-color:
 * select-outline-control-open-border-color:
 * select-outline-control-adjacent-border-color:
 * select-filled-border-style:
 * select-filled-border-width:
 * select-filled-tiny-padding:
 * select-filled-small-padding:
 * select-filled-medium-padding:
 * select-filled-large-padding:
 * select-filled-giant-padding:
 * select-filled-basic-background-color:
 * select-filled-basic-border-color:
 * select-filled-basic-icon-color:
 * select-filled-basic-text-color:
 * select-filled-basic-placeholder-text-color:
 * select-filled-basic-focus-background-color:
 * select-filled-basic-focus-and-hover-background-color:
 * select-filled-basic-focus-and-hover-border-color:
 * select-filled-basic-focus-border-color:
 * select-filled-basic-hover-background-color:
 * select-filled-basic-hover-border-color:
 * select-filled-basic-disabled-background-color:
 * select-filled-basic-disabled-border-color:
 * select-filled-basic-disabled-icon-color:
 * select-filled-basic-disabled-text-color:
 * select-filled-primary-background-color:
 * select-filled-primary-border-color:
 * select-filled-primary-icon-color:
 * select-filled-primary-text-color:
 * select-filled-primary-placeholder-text-color:
 * select-filled-primary-focus-background-color:
 * select-filled-primary-focus-and-hover-background-color:
 * select-filled-primary-focus-and-hover-border-color:
 * select-filled-primary-focus-border-color:
 * select-filled-primary-hover-background-color:
 * select-filled-primary-hover-border-color:
 * select-filled-primary-disabled-background-color:
 * select-filled-primary-disabled-border-color:
 * select-filled-primary-disabled-icon-color:
 * select-filled-primary-disabled-text-color:
 * select-filled-success-background-color:
 * select-filled-success-border-color:
 * select-filled-success-icon-color:
 * select-filled-success-text-color:
 * select-filled-success-placeholder-text-color:
 * select-filled-success-focus-background-color:
 * select-filled-success-focus-and-hover-background-color:
 * select-filled-success-focus-and-hover-border-color:
 * select-filled-success-focus-border-color:
 * select-filled-success-hover-background-color:
 * select-filled-success-hover-border-color:
 * select-filled-success-disabled-background-color:
 * select-filled-success-disabled-border-color:
 * select-filled-success-disabled-icon-color:
 * select-filled-success-disabled-text-color:
 * select-filled-info-background-color:
 * select-filled-info-border-color:
 * select-filled-info-icon-color:
 * select-filled-info-text-color:
 * select-filled-info-placeholder-text-color:
 * select-filled-info-focus-background-color:
 * select-filled-info-focus-and-hover-background-color:
 * select-filled-info-focus-and-hover-border-color:
 * select-filled-info-focus-border-color:
 * select-filled-info-hover-background-color:
 * select-filled-info-hover-border-color:
 * select-filled-info-disabled-background-color:
 * select-filled-info-disabled-border-color:
 * select-filled-info-disabled-icon-color:
 * select-filled-info-disabled-text-color:
 * select-filled-warning-background-color:
 * select-filled-warning-border-color:
 * select-filled-warning-icon-color:
 * select-filled-warning-text-color:
 * select-filled-warning-placeholder-text-color:
 * select-filled-warning-focus-background-color:
 * select-filled-warning-focus-and-hover-background-color:
 * select-filled-warning-focus-and-hover-border-color:
 * select-filled-warning-focus-border-color:
 * select-filled-warning-hover-background-color:
 * select-filled-warning-hover-border-color:
 * select-filled-warning-disabled-background-color:
 * select-filled-warning-disabled-border-color:
 * select-filled-warning-disabled-icon-color:
 * select-filled-warning-disabled-text-color:
 * select-filled-danger-background-color:
 * select-filled-danger-border-color:
 * select-filled-danger-icon-color:
 * select-filled-danger-text-color:
 * select-filled-danger-placeholder-text-color:
 * select-filled-danger-focus-background-color:
 * select-filled-danger-focus-and-hover-background-color:
 * select-filled-danger-focus-and-hover-border-color:
 * select-filled-danger-focus-border-color:
 * select-filled-danger-hover-background-color:
 * select-filled-danger-hover-border-color:
 * select-filled-danger-disabled-background-color:
 * select-filled-danger-disabled-border-color:
 * select-filled-danger-disabled-icon-color:
 * select-filled-danger-disabled-text-color:
 * select-filled-control-background-color:
 * select-filled-control-border-color:
 * select-filled-control-icon-color:
 * select-filled-control-text-color:
 * select-filled-control-placeholder-text-color:
 * select-filled-control-focus-background-color:
 * select-filled-control-focus-and-hover-background-color:
 * select-filled-control-focus-and-hover-border-color:
 * select-filled-control-focus-border-color:
 * select-filled-control-hover-background-color:
 * select-filled-control-hover-border-color:
 * select-filled-control-disabled-background-color:
 * select-filled-control-disabled-border-color:
 * select-filled-control-disabled-icon-color:
 * select-filled-control-disabled-text-color:
 * select-hero-tiny-padding:
 * select-hero-small-padding:
 * select-hero-medium-padding:
 * select-hero-large-padding:
 * select-hero-giant-padding:
 * select-hero-basic-left-background-color:
 * select-hero-basic-right-background-color:
 * select-hero-basic-icon-color:
 * select-hero-basic-text-color:
 * select-hero-basic-placeholder-text-color:
 * select-hero-basic-focus-left-background-color:
 * select-hero-basic-focus-right-background-color:
 * select-hero-basic-focus-and-hover-left-background-color:
 * select-hero-basic-focus-and-hover-right-background-color:
 * select-hero-basic-hover-left-background-color:
 * select-hero-basic-hover-right-background-color:
 * select-hero-basic-disabled-background-color:
 * select-hero-basic-disabled-icon-color:
 * select-hero-basic-disabled-text-color:
 * select-hero-primary-left-background-color:
 * select-hero-primary-right-background-color:
 * select-hero-primary-icon-color:
 * select-hero-primary-text-color:
 * select-hero-primary-placeholder-text-color:
 * select-hero-primary-focus-left-background-color:
 * select-hero-primary-focus-right-background-color:
 * select-hero-primary-focus-and-hover-left-background-color:
 * select-hero-primary-focus-and-hover-right-background-color:
 * select-hero-primary-hover-left-background-color:
 * select-hero-primary-hover-right-background-color:
 * select-hero-primary-disabled-background-color:
 * select-hero-primary-disabled-icon-color:
 * select-hero-primary-disabled-text-color:
 * select-hero-success-left-background-color:
 * select-hero-success-right-background-color:
 * select-hero-success-icon-color:
 * select-hero-success-text-color:
 * select-hero-success-placeholder-text-color:
 * select-hero-success-focus-left-background-color:
 * select-hero-success-focus-right-background-color:
 * select-hero-success-focus-and-hover-left-background-color:
 * select-hero-success-focus-and-hover-right-background-color:
 * select-hero-success-hover-left-background-color:
 * select-hero-success-hover-right-background-color:
 * select-hero-success-disabled-background-color:
 * select-hero-success-disabled-icon-color:
 * select-hero-success-disabled-text-color:
 * select-hero-info-left-background-color:
 * select-hero-info-right-background-color:
 * select-hero-info-icon-color:
 * select-hero-info-text-color:
 * select-hero-info-placeholder-text-color:
 * select-hero-info-focus-left-background-color:
 * select-hero-info-focus-right-background-color:
 * select-hero-info-focus-and-hover-left-background-color:
 * select-hero-info-focus-and-hover-right-background-color:
 * select-hero-info-hover-left-background-color:
 * select-hero-info-hover-right-background-color:
 * select-hero-info-disabled-background-color:
 * select-hero-info-disabled-icon-color:
 * select-hero-info-disabled-text-color:
 * select-hero-warning-left-background-color:
 * select-hero-warning-right-background-color:
 * select-hero-warning-icon-color:
 * select-hero-warning-text-color:
 * select-hero-warning-placeholder-text-color:
 * select-hero-warning-focus-left-background-color:
 * select-hero-warning-focus-right-background-color:
 * select-hero-warning-focus-and-hover-left-background-color:
 * select-hero-warning-focus-and-hover-right-background-color:
 * select-hero-warning-hover-left-background-color:
 * select-hero-warning-hover-right-background-color:
 * select-hero-warning-disabled-background-color:
 * select-hero-warning-disabled-icon-color:
 * select-hero-warning-disabled-text-color:
 * select-hero-danger-left-background-color:
 * select-hero-danger-right-background-color:
 * select-hero-danger-icon-color:
 * select-hero-danger-text-color:
 * select-hero-danger-placeholder-text-color:
 * select-hero-danger-focus-left-background-color:
 * select-hero-danger-focus-right-background-color:
 * select-hero-danger-focus-and-hover-left-background-color:
 * select-hero-danger-focus-and-hover-right-background-color:
 * select-hero-danger-hover-left-background-color:
 * select-hero-danger-hover-right-background-color:
 * select-hero-danger-disabled-background-color:
 * select-hero-danger-disabled-icon-color:
 * select-hero-danger-disabled-text-color:
 * select-hero-control-left-background-color:
 * select-hero-control-right-background-color:
 * select-hero-control-icon-color:
 * select-hero-control-text-color:
 * select-hero-control-placeholder-text-color:
 * select-hero-control-focus-left-background-color:
 * select-hero-control-focus-right-background-color:
 * select-hero-control-focus-and-hover-left-background-color:
 * select-hero-control-focus-and-hover-right-background-color:
 * select-hero-control-hover-left-background-color:
 * select-hero-control-hover-right-background-color:
 * select-hero-control-disabled-background-color:
 * select-hero-control-disabled-icon-color:
 * select-hero-control-disabled-text-color:
 * */
@Component({
    selector: 'nb-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NbSelectComponent),
            multi: true
        },
        { provide: NB_SELECT_INJECTION_TOKEN, useExisting: NbSelectComponent },
        { provide: NbFormFieldControl, useExisting: NbSelectComponent },
        { provide: NbFormFieldControlConfig, useFactory: nbSelectFormFieldControlConfigFactory }
    ],
    imports: [NbIconComponent, NbPortalDirective, NbOptionListComponent, NbTagComponent, NbInputDirective],
    host: {
        '[class]': 'hostClasses()',
        '[class.full-width]': 'fullWidth()',
        '[class.open]': 'isOpen()',
        // The label goes to the button, which is what screen readers focus.
        '[attr.aria-labelledby]': 'null'
    }
})
// `M` defaults to a mode that isn't known, as a query gives it: typed as a single select, as an unset `multiple` is.
// Code that holds a multiple select names it, e.g. `NbSelectComponent<City, true>`.
export class NbSelectComponent<T = unknown, M extends NbBooleanInput = NbBooleanInput>
implements AfterViewInit, AfterContentChecked, OnDestroy, ControlValueAccessor, NbFormFieldControl {
    // The app's defaults for this type, which the inputs below start from.
    protected readonly nbDefaults = injectNbDefaults('select')

    protected readonly document = inject(NB_DOCUMENT)
    protected readonly overlay = inject(NbOverlayService)
    protected readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef)
    protected readonly positionBuilder = inject(NbPositionBuilderService)
    protected readonly triggerStrategyBuilder = inject(NbTriggerStrategyBuilderService)
    protected readonly cd = inject(ChangeDetectorRef)
    protected readonly focusKeyManagerFactoryService = inject<NbFocusKeyManagerFactoryService<NbOptionComponent<T>>>(
        NbFocusKeyManagerFactoryService
    )
    protected readonly focusMonitor = inject(NbFocusMonitor)
    protected readonly statusService = inject(NbStatusService)
    protected readonly injector = inject(Injector)
    protected readonly destroyRef = inject(DestroyRef)

    /**
     * `tiny`, `small`, `medium` (default), `large` or `giant`.
     */
    readonly sizeInput = input<NbComponentSize | undefined>(undefined, { alias: 'size' })
    /** The size in use: the input's, the app's default, or 'medium'. */
    readonly size = linkedSignal<NbComponentSize>(() => this.sizeInput() ?? this.nbDefaults().size ?? 'medium')

    protected readonly validation = inject(NbValidationDirective, { self: true, optional: true })

    /**
     * `basic` (default), `primary`, `info`, `success`, `warning`, `danger`, `control` or a custom status. With
     * `nbValidation`, the status it gives takes over while the control shows errors or success.
     */
    readonly status = input<NbComponentOrCustomStatus>('basic')

    // With `nbValidation`, the status it gives while the control shows errors or success.
    protected readonly resolvedStatus = computed(() => this.validation?.status() ?? this.status())

    /**
     * `rectangle` (default), `round` or `semi-round`.
     */
    readonly shapeInput = input<NbComponentShape | undefined>(undefined, { alias: 'shape' })
    /** The shape in use: the input's, the app's default, or 'rectangle'. */
    readonly shape = linkedSignal<NbComponentShape>(() => this.shapeInput() ?? this.nbDefaults().shape ?? 'rectangle')

    /**
     * `outline` (default), `filled`, `hero` or `ghost` (no background or border at rest; like `outline` under the
     * pointer, with focus, and open). The `outline`, `filled`, `hero` and `ghost` attributes override it.
     */
    readonly appearanceInput = input<NbSelectAppearance | undefined>(undefined, { alias: 'appearance' })
    /** The appearance in use: the input's, the app's default, or 'outline'. */
    readonly appearance = linkedSignal<NbSelectAppearance>(() => this.appearanceInput() ?? this.nbDefaults().appearance ?? 'outline')

    /**
     * Class of the options list (`nb-option-list`).
     */
    readonly optionsListClass = input<NbClassInput>()

    /**
     * Class of the overlay pane the options open in.
     */
    readonly optionsPanelClass = input<string | string[]>()

    /**
     * Tab index of the select button.
     */
    readonly tabIndex = input<number, unknown>(0, { transform: numberAttribute })

    /**
     * Width of the options list in pixels; the select's width by default.
     */
    readonly optionsWidth = input<number>()

    /**
     * `appearance="outline"` as an attribute.
     */
    readonly outline = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * `appearance="filled"` as an attribute.
     */
    readonly filled = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * `appearance="hero"` as an attribute.
     */
    readonly hero = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * `appearance="ghost"` as an attribute.
     */
    readonly ghost = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * Disables the select, until a form sets its disabled state; see `isDisabled`.
     */
    readonly disabled = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * Stretches the select to its container's width.
     */
    readonly fullWidth = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * Text shown while nothing is selected.
     */
    readonly placeholder = input<string>('')

    /**
     * Id of the element that labels the select, e.g. a `<label>` next to it. Screen readers announce the label and then
     * the selected value.
     * Bind it as `[aria-labelledby]` (or set it as a plain attribute); `[attr.aria-labelledby]` bypasses the select.
     */
    readonly ariaLabelledBy = input<string>(undefined, { alias: 'aria-labelledby' })

    protected readonly buttonId = `nb-select-button-${lastSelectId++}`
    protected readonly listId = `${this.buttonId}-list`
    protected readonly buttonLabelledBy = computed(() => {
    // Its own label and an `nbLabel` of its `nbValidation`, then the selected value.
        const labelledBy = [this.ariaLabelledBy(), this.validation?.labelledBy()].filter(Boolean).join(' ')
        return labelledBy ? `${labelledBy} ${this.buttonId}` : null
    })

    /**
     * Compares an option's value with the select's; strict equality (`===`) by default. `null` and `undefined` never
     * reach it: they only match themselves.
     */
    readonly compareWith = input<NbSelectCompareFunction<T>>()

    /**
     * The selected value, or the selected values of a multiple select. It's written like a form value: a value whose
     * options aren't rendered yet is kept until they are.
     *
     * It's typed as either in any mode, so that the options' value type `T` is the item's: `City` for
     * `[selected]="city"` and for `[selected]="cities"` alike.
     */
    readonly selected = input<T | T[] | null>()

    /**
     * Lets several options be selected; the value is then an array, and the list stays open as options are picked.
     * Its type `M` sets the type of `selectedChange`; see `NbSelectValue`.
     */
    readonly multiple = input<boolean, M>(false, { transform: convertToBoolProperty })

    /**
     * Treats `null` as a value: an option with a `null` value is selected and shown like any other, e.g. "Auto" or
     * "None". Without it, `null` clears the selection and shows the placeholder. Options without a value (`undefined`)
     * clear the selection either way.
     */
    readonly nullable = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * In a multiple select, shows the selected options as tags instead of a comma-separated list.
     */
    readonly chips = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * In a multiple select, the most options the user can select; once reached, the others are disabled until one is
     * deselected. A value written with more is kept as it is.
     */
    readonly maxSelections = input<number>()

    /**
     * Whether a multiple select has as many options selected as `maxSelections` allows.
     */
    readonly isLimitReached = computed(() => {
        const max = this.maxSelections()
        return this.multiple() && max !== undefined && this.selectionModel().length >= max
    })

    /**
     * Adds a search input at the top of the open list that filters the options by their text. Focus stays in the
     * input; the arrow keys, Home and End move through the matching options and Enter selects one.
     */
    readonly searchable = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * Decides whether an option matches the search query; by default its text contains it, ignoring case and accents.
     */
    readonly searchFn = input<(option: NbOptionComponent<T>, query: string) => boolean>(nbSelectSearchFn)

    protected readonly texts = injectNbTexts('select', () => ({
        search: $localize`:@@nb.select.search:Search`,
        noMatches: $localize`:@@nb.select.noMatches:No matches`,
        back: (title) => $localize`:@@nb.select.back:Back to ${title}:title:`
    }))
    protected readonly searchKeyManagerFactory = inject(
        NbActiveDescendantKeyManagerFactoryService
    ) as NbActiveDescendantKeyManagerFactoryService<NbOptionListItem>
    protected readonly itemKeyManagerFactory = inject(
        NbFocusKeyManagerFactoryService
    ) as NbFocusKeyManagerFactoryService<NbOptionListItem>
    protected readonly query = signal('')
    protected readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput')
    protected readonly activeOptionId = signal<string | undefined>(undefined)
    // Moves the active option without taking focus from the search input.
    protected searchKeyManager?: NbActiveDescendantKeyManager<NbOptionListItem>

    // Tags one size smaller than the select fit in its line, so a row of them doesn't make it taller.
    protected readonly chipSize = computed<NbComponentSize>(() => {
        const sizes: NbComponentSize[] = ['tiny', 'tiny', 'small', 'medium', 'large']
        return sizes[['tiny', 'small', 'medium', 'large', 'giant'].indexOf(this.size())] ?? 'small'
    })

    /**
     * The options' distance from the select, in pixels.
     */
    readonly overlayOffset = input(8)

    /**
     * What scrolling the page does while the options are open: `block` (default) prevents it, `close` closes them,
     * `reposition` moves them along, and `noop` nothing.
     */
    readonly scrollStrategy = input<NbScrollStrategies>('block')

    /**
     * Emits when the user changes the selection, not when a value is written: the selected option's value (or `null`),
     * or with `multiple`, the values of all selected options. See `NbSelectValue`.
     */
    readonly selectedChange = output<NbSelectValue<T, M>>()

    /**
     * The options passed as content, at any depth.
     */
    // The options of a select carry values of the select's type.
    readonly options = contentChildren<NbOptionComponent<T>>(NbOptionComponent, { descendants: true })

    /**
     * The nested options passed as content.
     */
    readonly nestedOptions = contentChildren(NbOptionNestedComponent, { descendants: true })

    // The options and nested options, in the order they're in, which the keyboard moves through.
    protected readonly items = contentChildren(NB_OPTION_LIST_ITEM, { descendants: true })

    /**
     * How many levels of nested options the list shows at once; opening a deeper one drills into it.
     */
    readonly nestedLevels = input<number, unknown>(3, { transform: (value) => Math.max(1, numberAttribute(value, 3)) })

    /**
     * The nested option the list is drilled into: only the options in it show, and a row at the top goes back.
     */
    readonly nestedRoot = signal<NbOptionNestedComponent | undefined>(undefined)

    /**
     * Whether the select has nested options, which make its list a tree.
     */
    readonly isTree = computed(() => this.nestedOptions().length > 0)

    // A search shows the matching options in all nested options, wherever the list is drilled into.
    protected readonly isNestedSearch = computed(() => this.searchable() && !!this.query().trim())
    protected readonly directionService = inject(NbLayoutDirectionService)
    // The nested option the back row goes back from; a search shows all, without one.
    protected readonly backTo = computed(() => (this.isNestedSearch() ? undefined : this.nestedRoot()))

    /**
     * An `nb-select-label` passed as content, shown instead of the selected options' text.
     */
    readonly customLabel = contentChild(NbSelectLabelComponent)

    // The options list, which the overlay attaches.
    protected readonly portal = viewChild(NbPortalDirective)

    protected readonly button = viewChild.required('selectButton', { read: ElementRef<HTMLButtonElement> })

    protected readonly opened = signal(false)

    /**
     * Whether the options are open.
     */
    readonly isOpen = this.opened.asReadonly()

    /**
     * Whether the options are closed.
     */
    readonly isHidden = computed(() => !this.isOpen())

    /**
     * The selected options.
     */
    readonly selectionModel = signal<Array<NbOptionComponent<T>>>([])

    /**
     * The selected value, or the values of the selected options in a multiple select.
     */
    readonly selectedValue = computed(() => {
        const selection = this.selectionModel()
        return this.multiple() ? this.optionValues(selection) : selection[0]?.value()
    })

    /**
     * Whether the select is disabled: the `disabled` input, until a form changes it.
     */
    readonly isDisabled = linkedSignal(() => this.disabled())

    // The position strategy can be replaced while the options are open, e.g. by a subclass.
    protected readonly positionStrategy$ = new BehaviorSubject<NbAdjustableConnectedPositionStrategy | undefined>(
        undefined
    )

    get positionStrategy(): NbAdjustableConnectedPositionStrategy | undefined {
        return this.positionStrategy$.value
    }

    /**
     * Current overlay position, which the options list and the button render with.
     */
    readonly overlayPosition = signal<NbPosition>('' as NbPosition)

    protected readonly focused = signal(false)

    protected ref?: NbOverlayRef

    protected triggerStrategy?: NbTriggerStrategy

    protected alive = true

    protected keyManager?: NbFocusKeyManager<NbOptionListItem>

    // A value written before its options rendered, applied once they do; only the last one is kept.
    protected queue?: T | T[] | null
    // Whether `queue` holds a value; `null` can be a queued value when the select is `nullable`.
    protected queued = false
    protected lastSelectionView?: string

    protected onChange: (value: T | T[] | null) => void = () => {}
    protected onTouched: () => void = () => {}

    protected readonly compareFn = computed<NbSelectCompareFunction<T>>(() => {
        const compareWith = this.compareWith()
        return typeof compareWith === 'function' ? compareWith : (v1, v2) => v1 === v2
    })

    readonly controlState = computed(() => ({
        status: this.resolvedStatus(),
        size: this.size(),
        fullWidth: this.fullWidth(),
        focused: this.focused(),
        disabled: this.isDisabled()
    }))

    protected readonly resolvedAppearance = computed<NbSelectAppearance>(() => {
        if (this.ghost()) {
            return 'ghost'
        }
        if (this.hero()) {
            return 'hero'
        }
        if (this.filled()) {
            return 'filled'
        }
        if (this.outline()) {
            return 'outline'
        }
        return this.appearance()
    })

    protected readonly hostClasses = computed(() => [
        `size-${this.size()}`,
        this.statusService.getStatusClass(this.resolvedStatus()),
        `shape-${this.shape()}`,
        `appearance-${this.resolvedAppearance()}`
    ])

    readonly selectButtonClasses = computed(() => {
        const classes = new Array<string>()
        const empty = !this.selectionModel().length

        if (empty) {
            classes.push('placeholder')
        }
        if (empty && !this.placeholder()) {
            classes.push('empty')
        }
        if (this.isOpen()) {
            classes.push(this.overlayPosition())
        }

        return classes
    })

    constructor() {
    // The focusable element is inside: the button or the native input gets aria-invalid and aria-describedby.
        this.validation?.delegateAria()
        enableTransitionsAfterRender(this.hostRef.nativeElement)

        // Searching leaves out the options that don't match, and keeps the active option among the ones shown.
        effect(() => {
            const query = this.searchable() ? this.query().trim() : ''
            const matches = this.searchFn()
            const options = this.options()
            untracked(() => {
                const choices = options.filter((option) => !option.selectAll())
                choices.forEach((option) => option.filtered.set(!!query && !matches(option, query)))
                // A select-all option acts on the options the search shows, so it stays while there are any.
                const nothingShown = choices.every((option) => option.filtered())
                options
                    .filter((option) => option.selectAll())
                    .forEach((option) => option.filtered.set(!!query && nothingShown))
                const active = this.searchKeyManager?.activeItem
                if (this.isSearching() && (!active || active.hidden)) {
                    this.searchKeyManager?.setFirstItemActive()
                }
            })
        })

        // Options added, a search, or a nested option opened from the app change which options show.
        effect(() => {
            this.options()
            const nestedOptions = this.nestedOptions()
            this.nestedRoot()
            this.isNestedSearch()
            nestedOptions.forEach((nested) => nested.expanded())
            if (nestedOptions.length) {
                untracked(() => this.syncNested())
            }
        })

        this.destroyRef.onDestroy(() => (this.alive = false))

        // A bound `selected` is written like a form value; an unbound one doesn't clear a form's value.
        let firstSelected = true
        effect(() => {
            const selected = this.selected()
            untracked(() => {
                if (!firstSelected || selected !== undefined) {
                    this.writeValue(selected)
                }
                firstSelected = false
            })
        })

        // Select the current value again with a new compare function.
        effect(() => {
            this.compareFn()
            untracked(() => {
                if (this.selectionModel().length && this.canSelectValue()) {
                    this.setSelection(this.selectedValue())
                }
            })
        })

        // A queued value, or a selection of options that were replaced (e.g. options loaded again),
        // is selected among the current options once they render with their values bound.
        afterRenderEffect(() => {
            this.options().forEach((option) => option.value())
            untracked(() => {
                if ((this.queued || this.hasRemovedSelectedOptions()) && this.canSelectValue()) {
                    this.writeValue(this.queued ? this.queue : this.selectedValue())
                }
            })
        })

        // Options can change at runtime, so listen to the clicks of the current ones.
        toObservable(this.options)
            .pipe(
                switchMap((options) => merge(...options.map((option) => option.click))),
                takeUntilDestroyed()
            )
            .subscribe((clickedOption) => this.handleOptionClick(clickedOption))
    }

    /**
     * The select button's width, in pixels.
     */
    get hostWidth(): number {
        return this.button().nativeElement.getBoundingClientRect().width
    }

    /**
     * The text of the selected options, which the button shows; it's read from the DOM.
     */
    get selectionView() {
        const selection = this.selectionModel()
        if (selection.length > 1) {
            return selection.map((option) => option.content).join(', ')
        }

        return selection[0].content
    }

    ngAfterContentChecked() {
    // The label shows the text of the selected options, which their parent view renders (e.g. a translation).
        const label = this.selectionModel().length ? this.selectionView : undefined
        if (label !== this.lastSelectionView) {
            this.lastSelectionView = label
            this.cd.markForCheck()
        }
    }

    ngAfterViewInit() {
        this.triggerStrategy = this.createTriggerStrategy()

        this.subscribeOnButtonFocus()
        this.subscribeOnTriggers(this.triggerStrategy)
    }

    ngOnDestroy() {
        if (this.ref) {
            this.ref.dispose()
        }
        if (this.triggerStrategy) {
            this.triggerStrategy.destroy()
        }
    }

    show() {
        if (this.shouldShow()) {
            this.attachToOverlay()

            this.positionChanges()
                .pipe(take(1), takeUntilDestroyed(this.destroyRef))
                .subscribe(() => this.onPositioned())
        }
    }

    hide() {
        if (this.isOpen()) {
            this.ref?.detach()
            this.opened.set(false)
            // The list opens with all its options again.
            this.query.set('')
        }
    }

    registerOnChange(fn: (value: T | T[] | null) => void) {
        this.onChange = fn
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn
    }

    setDisabledState(isDisabled: boolean) {
        this.isDisabled.set(isDisabled)
    }

    writeValue(value?: T | T[] | null) {
        if (!this.alive) {
            return
        }

        if (this.canSelectValue()) {
            this.setSelection(value)
            // Keep a value whose options aren't all rendered yet (options loaded later), so they're selected once they
            // appear.
            this.queued = this.selectionModel().length < this.countValues(value)
            this.queue = this.queued ? value : undefined
        } else {
            this.queued = true
            this.queue = value
        }
    }

    /**
     * Selects the option; a select-all one toggles all, and one without a value clears the selection.
     */
    protected handleOptionClick(option: NbOptionComponent<T>) {
        this.queue = undefined
        this.queued = false
        if (option.selectAll()) {
            if (this.multiple()) {
                this.toggleAll()
            }
        } else if (this.isEmptyValue(option.value())) {
            this.reset()
        } else {
            this.selectOption(option)
        }
        // A multiple select stays open; searching goes on where it was.
        if (this.isSearching() && this.isOpen()) {
            this.searchKeyManager?.setActiveItem(option)
            this.searchInput()?.nativeElement.focus()
        }
    }

    /**
     * Clears the selection, closes the options and emits an empty value.
     */
    protected reset() {
        this.selectionModel().forEach((option) => option.deselect())
        this.selectionModel.set([])
        this.hide()
        this.focusButton()
        this.emitSelected(this.multiple() ? [] : null)
    }

    protected selectOption(option: NbOptionComponent<T>) {
        if (this.multiple()) {
            this.handleMultipleSelect(option)
        } else {
            this.handleSingleSelect(option)
        }
    }

    // Selects the option, closes the options and emits.
    protected handleSingleSelect(option: NbOptionComponent<T>) {
        const selected = this.selectionModel()[0]

        if (selected && !this.sameValue(selected.value(), option.value())) {
            selected.deselect()
        }

        this.selectionModel.set([option])
        option.select()
        this.hide()
        this.focusButton()

        // An option without a value clears the selection instead, so it has one here.
        this.emitSelected(option.value() ?? null)
    }

    // Toggles the option, unless `maxSelections` is reached; the options stay open.
    protected handleMultipleSelect(option: NbOptionComponent<T>) {
        if (this.isLimited(option)) {
            return
        }
        if (option.selected()) {
            this.selectionModel.update((selection) =>
                selection.filter((s) => !this.sameValue(s.value(), option.value()))
            )
            option.deselect()
        } else {
            this.selectionModel.update((selection) => [...selection, option])
            option.select()
        }

        this.emitSelected(this.optionValues(this.selectionModel()))
    }

    protected attachToOverlay() {
        let ref = this.ref
        if (!ref) {
            ref = this.createOverlay()
            this.subscribeOnPositionChange()
            this.createKeyManager()
            this.subscribeOnOverlayKeys(ref)
        }

        ref.attach(this.portal())
        this.opened.set(true)
    }

    /**
     * Runs once the open options are positioned.
     */
    protected onPositioned() {
        this.setActiveOption()
        if (this.isSearching()) {
            this.searchInput()?.nativeElement.focus()
        }
    }

    // Whether the open list is searched, with `searchable`.
    protected isSearching(): boolean {
        return this.searchable() && !!this.searchKeyManager
    }

    protected readonly noMatches = computed(
        () =>
            this.searchable() &&
            !!this.query().trim() &&
            this.options().every((option) => option.selectAll() || option.filtered())
    )

    protected onSearchInput(event: Event) {
        this.query.set((event.target as HTMLInputElement).value)
    }

    protected positionChanges() {
        return this.positionStrategy$.pipe(switchMap((positionStrategy) => positionStrategy?.positionChange ?? EMPTY))
    }

    protected focusButton() {
        this.button().nativeElement.focus()
    }

    protected setActiveOption() {
        const keyManager = this.isSearching() && this.searchKeyManager ? this.searchKeyManager : this.keyManager
        // A selected option in a collapsed nested option opens it.
        if (this.selectionModel().length) {
            this.revealNested(this.selectionModel()[0])
        }
        const selection = this.selectionModel().filter((option) => !option.hidden)
        if (selection.length) {
            keyManager?.setActiveItem(selection[0])
        } else {
            keyManager?.setFirstItemActive()
        }
    }

    protected createOverlay(): NbOverlayRef {
        const scrollStrategy = this.createScrollStrategy()
        this.positionStrategy$.next(this.createPositionStrategy())
        const ref = this.overlay.create({
            positionStrategy: this.positionStrategy,
            scrollStrategy,
            panelClass: this.optionsPanelClass()
        })
        this.ref = ref
        // The overlay can also detach itself, e.g. through its scroll strategy.
        ref.detachments().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.opened.set(false))
        return ref
    }

    protected createKeyManager() {
        this.keyManager = this.itemKeyManagerFactory
            .create(this.items, this.injector)
            .withTypeAhead(200)
        // Like a native select: Home, End, PageUp and PageDown move through the options.
            .withHomeAndEnd()
            .withPageUpDown()
        // Collapsed in a nested option.
            .skipPredicate((item) => item.disabled || item.hidden)

        this.searchKeyManager = this.searchKeyManagerFactory
            .create(this.items, this.injector)
            .withHomeAndEnd()
            .withPageUpDown()
            .skipPredicate((option) => option.disabled || option.hidden)
        this.searchKeyManager.change
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.activeOptionId.set(this.searchKeyManager?.activeItem?.id))
    }

    protected createPositionStrategy(): NbAdjustableConnectedPositionStrategy {
        return this.positionBuilder
            .connectedTo(this.button())
            .position(NbPosition.BOTTOM)
            .offset(this.overlayOffset())
            .adjustment(NbAdjustment.VERTICAL)
        // Where neither below nor above has room for the whole list, it gets the space there is and scrolls. The CDK
        // shifts the list by the offset after sizing it, so the margin includes the offset to keep 8px from the edge.
            .withFlexibleDimensions(true)
            .withViewportMargin(8 + this.overlayOffset())
    }

    protected createScrollStrategy(): NbScrollStrategy {
        return this.overlay.scrollStrategies[this.scrollStrategy()]()
    }

    protected createTriggerStrategy(): NbTriggerStrategy {
        return this.triggerStrategyBuilder
            .trigger(NbTrigger.CLICK)
            .host(this.hostRef.nativeElement)
            .container(() => this.getContainer())
            .build()
    }

    protected subscribeOnTriggers(triggerStrategy: NbTriggerStrategy) {
        triggerStrategy.show$.subscribe(() => this.show())
        triggerStrategy.hide$.pipe(filter(() => this.isOpen())).subscribe(($event: Event) => {
            this.hide()
            if (!this.isClickedWithinComponent($event)) {
                this.onTouched()
            }
        })
    }

    protected subscribeOnPositionChange() {
        this.positionChanges()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((position: NbPosition) => this.overlayPosition.set(position))
    }

    protected subscribeOnOverlayKeys(ref: NbOverlayRef) {
        ref
            .keydownEvents()
            .pipe(
                filter(() => this.isOpen()),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((event: KeyboardEvent) => {
                const keyManager = this.isSearching() && this.searchKeyManager ? this.searchKeyManager : this.keyManager
                if (event.key === 'Escape' && !isComposing(event)) {
                    // Only the options close, not a dialog or window the select is in.
                    event.preventDefault()
                    event.stopPropagation()
                    this.focusButton()
                    this.hide()
                } else if (this.onNestedKeydown(event, keyManager)) {
                    event.preventDefault()
                } else if (this.isSearching() && this.searchKeyManager) {
                    this.onSearchKeydown(event, this.searchKeyManager)
                } else {
                    this.keyManager?.onKeydown(event)
                }
            })

        const tabOuts = new Array<Observable<void>>()
        if (this.keyManager) {
            tabOuts.push(this.keyManager.tabOut)
        }
        if (this.searchKeyManager) {
            tabOuts.push(this.searchKeyManager.tabOut)
        }
        merge(...tabOuts)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.hide()
                this.onTouched()
            })
    }

    protected onSearchKeydown(event: KeyboardEvent, keyManager: NbActiveDescendantKeyManager<NbOptionListItem>) {
        if (event.key === 'Enter' && !isComposing(event)) {
            const active = keyManager.activeItem
            if (active instanceof NbOptionComponent) {
                event.preventDefault()
                this.handleOptionClick(active)
            }
        } else {
            // Arrows, Home and End move the active option; other keys type into the input.
            keyManager.onKeydown(event)
        }
    }

    /**
     * Opens or closes a nested option. Opening one deeper than `nestedLevels` drills into it.
     */
    toggleNested(nested: NbOptionNestedComponent) {
        if (nested.expanded()) {
            nested.expanded.set(false)
        } else {
            nested.expanded.set(true)
            // Its options would be one level too deep: start the list lower, so they're at the last level shown.
            if (this.nestedLevel(nested) + 1 > this.nestedLevels()) {
                this.setNestedRoot(this.nestedAncestor(nested, nested.depth + 1 - this.nestedLevels()))
            }
        }
        this.syncNested()
        // Clicking a row focuses it; searching goes on in the input.
        if (this.isSearching() && this.isOpen()) {
            this.searchInput()?.nativeElement.focus()
        }
        const keyManager = this.isSearching() && this.searchKeyManager ? this.searchKeyManager : this.keyManager
        if (nested.hidden) {
            // Drilled into it, with one level shown: its first option is in its place. Making it active would reveal it,
            // going back out.
            keyManager?.updateActiveItem(nested)
            keyManager?.setNextItemActive()
        } else if (keyManager?.activeItem !== nested) {
            keyManager?.setActiveItem(nested)
        }
    }

    /**
     * Opens the nested options an option or nested option is in, and drills in or back as needed, so it shows.
     */
    revealNested(item: NbNestedItem) {
        if (!this.isTree() || this.isNestedSearch()) {
            return
        }
        for (let nested = item.parentNested; nested; nested = nested.parentNested) {
            nested.expanded.set(true)
        }
        const root = this.nestedRoot()
        if (!this.isInNested(item, root) || this.nestedLevel(item) > this.nestedLevels()) {
            this.setNestedRoot(this.nestedAncestor(item, item.depth - this.nestedLevels()))
        }
        this.syncNested()
    }

    /**
     * Goes back from the nested option the list is drilled into, to the one it's in.
     */
    nestedBack() {
        const root = this.nestedRoot()
        if (root) {
            this.setNestedRoot(root.parentNested ?? undefined)
            this.syncNested()
            if (this.isSearching()) {
                this.searchInput()?.nativeElement.focus()
            }
            (this.isSearching() && this.searchKeyManager ? this.searchKeyManager : this.keyManager)?.setActiveItem(root)
        }
    }

    protected setNestedRoot(root?: NbOptionNestedComponent) {
        this.nestedRoot.set(root)
        // Nested options whose options would be deeper than the levels shown close.
        for (const nested of this.nestedOptions()) {
            if (nested.expanded() && this.nestedLevel(nested) >= this.nestedLevels() && this.isInNested(nested, root)) {
                nested.expanded.set(false)
            }
        }
    }

    // How deep an option or nested option is in the view: 1 at its top.
    protected nestedLevel(item: NbNestedItem): number {
        return item.depth - (this.nestedRoot()?.depth ?? 0)
    }

    // Whether an option or nested option is in a nested option, or anywhere for none.
    protected isInNested(item: NbNestedItem, root?: NbOptionNestedComponent) {
        for (let nested = item.parentNested; nested; nested = nested.parentNested) {
            if (nested === root) {
                return true
            }
        }
        return !root
    }

    // The nested option an item is in at a depth, or the item itself if it's there; none above the top.
    protected nestedAncestor(item: NbNestedItem, depth: number) {
        let nested = item instanceof NbOptionNestedComponent ? item : item.parentNested
        while (nested && nested.depth > depth) {
            nested = nested.parentNested
        }
        return depth > 0 ? (nested ?? undefined) : undefined
    }

    /**
     * Shows the options and nested options in view, and indents them by how deep they are in it. It sets them at once,
     * not on the next render, so an option can take focus and scroll into view as soon as it's revealed.
     */
    protected syncNested() {
        const root = this.nestedRoot()
        const search = this.isNestedSearch()
        const base = search ? 0 : (root?.depth ?? 0)
        const shows = (item: NbNestedItem) => {
            if (search) {
                return true
            }
            let nested = item.parentNested
            while (nested && nested !== root) {
                if (!nested.expanded()) {
                    return false
                }
                nested = nested.parentNested
            }
            return (nested ?? undefined) === root
        }
        // Groups with nothing in view hide, with their title; a group holding the nested option the list is drilled into
        // hides only its title.
        const groups = new Map<NbOptionGroupComponent, boolean>()
        const drilledGroups = new Set<NbOptionGroupComponent>()
        for (const option of this.options()) {
            const shown = shows(option)
            option.setNestedView(!shown, option.depth - base)
            if (option.group) {
                groups.set(option.group, shown || !!groups.get(option.group))
            }
        }
        for (const nested of this.nestedOptions()) {
            const shown = shows(nested)
            const drilledInto = !search && !!root && (nested === root || this.isInNested(root, nested))
            nested.setNestedView(!shown, nested.depth - base, search || nested.expanded(), drilledInto)
            if (nested.group) {
                groups.set(nested.group, shown || drilledInto || !!groups.get(nested.group))
                if (drilledInto) {
                    drilledGroups.add(nested.group)
                }
            }
        }
        groups.forEach((shown, group) => group.setNestedView(!shown, drilledGroups.has(group)))
    }

    /**
     * Moves through nested options like a tree: ArrowRight (ArrowLeft in RTL) opens one, or moves into it when it's
     * open; ArrowLeft closes one, moves to the one it's in, or goes back from where the list is drilled into; Enter and
     * Space open and close one. Typing into the search input keeps the arrows, so they move through the tree only while
     * it's empty.
     */
    protected onNestedKeydown(
        event: KeyboardEvent,
        keyManager?: NbFocusKeyManager<NbOptionListItem> | NbActiveDescendantKeyManager<NbOptionListItem>
    ): boolean {
        const active = keyManager?.activeItem
        if (!this.isTree() || !keyManager || !active || isComposing(event)) {
            return false
        }
        const searching = this.isSearching()
        if (event.key === 'Enter' || (event.key === ' ' && !searching)) {
            if (active instanceof NbOptionNestedComponent) {
                if (!active.disabled) {
                    this.toggleNested(active)
                }
                return true
            }
            return false
        }
        const rtl = this.directionService.isRtl()
        const forward = event.key === (rtl ? 'ArrowLeft' : 'ArrowRight')
        const backward = event.key === (rtl ? 'ArrowRight' : 'ArrowLeft')
        if ((!forward && !backward) || (searching && this.query())) {
            return false
        }
        if (!(active instanceof NbOptionComponent || active instanceof NbOptionNestedComponent)) {
            return false
        }
        if (forward) {
            if (active instanceof NbOptionNestedComponent && !active.disabled) {
                if (active.expanded()) {
                    keyManager.setNextItemActive()
                } else {
                    this.toggleNested(active)
                }
            }
        } else if (active instanceof NbOptionNestedComponent && active.expanded() && !active.hidden) {
            this.toggleNested(active)
        } else if (active.parentNested && active.parentNested !== this.nestedRoot()) {
            keyManager.setActiveItem(active.parentNested)
        } else {
            this.nestedBack()
        }
        return true
    }

    protected subscribeOnButtonFocus() {
        const button = this.button()
        this.focusMonitor
            .monitor(button)
            .pipe(
                map((origin) => !!origin),
                takeUntilDestroyed(this.destroyRef)
            )
        // Focus can change while the select renders: hiding a focused button blurs it once the layout is measured.
            .subscribe((focused) => untracked(() => this.focused.set(focused)))
        this.destroyRef.onDestroy(() => this.focusMonitor.stopMonitoring(button))
    }

    protected getContainer(): ComponentRef<unknown> | undefined {
        return this.ref && this.ref.hasAttached()
            ? <ComponentRef<unknown>>{
                location: {
                    nativeElement: this.ref.overlayElement
                }
            }
            : undefined
    }

    /**
     * Emits the value to the form and `selectedChange`.
     */
    protected emitSelected(selected: T | T[] | null) {
        this.onChange(selected)
        // An array in a multiple select, one value (or null) otherwise, which is what NbSelectValue says for `M`.
        this.selectedChange.emit(selected as NbSelectValue<T, M>)
    }

    protected countValues(value: unknown): number {
        if (this.isEmptyValue(value) || (this.multiple() && value === '')) {
            return 0
        }
        return this.multiple() && Array.isArray(value) ? value.length : 1
    }

    /**
     * Whether an option can't be selected because `maxSelections` is reached.
     */
    isLimited(option: Pick<NbOptionComponent, 'selected' | 'selectAll'>): boolean {
        return this.isLimitReached() && !option.selected() && !option.selectAll()
    }

    // The options a select-all option acts on: the enabled ones a search shows.
    protected readonly selectAllCandidates = computed(() =>
        this.options().filter((option) => !option.selectAll() && !option.ownDisabled() && !option.filtered())
    )

    /**
     * How many of the options a select-all option acts on are selected: `all`, `some` or `none`.
     */
    readonly selectAllState = computed<'all' | 'some' | 'none'>(() => {
        const candidates = this.selectAllCandidates()
        const selected = candidates.filter((option) => option.selected()).length
        if (selected && selected === candidates.length) {
            return 'all'
        }
        return selected ? 'some' : 'none'
    })

    // Selects the options it acts on, up to `maxSelections`, or clears them when all are selected or the limit is
    // reached.
    protected toggleAll() {
        const candidates = this.selectAllCandidates()
        if (this.selectAllState() === 'all' || this.isLimitReached()) {
            candidates.forEach((option) => option.deselect())
            this.selectionModel.update((selection) =>
                selection.filter((selected) => !candidates.some((option) => this.sameValue(option.value(), selected.value())))
            )
        } else {
            const room = (this.maxSelections() ?? Infinity) - this.selectionModel().length
            const added = candidates.filter((option) => !option.selected()).slice(0, room)
            added.forEach((option) => option.select())
            this.selectionModel.update((selection) => [...selection, ...added])
        }
        this.emitSelected(this.optionValues(this.selectionModel()))
    }

    /**
     * Whether a value means "nothing selected": `undefined`, and `null` unless the select is `nullable`.
     */
    isEmptyValue(value: unknown): boolean {
        return value === undefined || (value === null && !this.nullable())
    }

    // Compares values with `compareWith`; `null` and `undefined` only match themselves.
    protected sameValue(v1?: T | null, v2?: T | null): boolean {
        return v1 == null || v2 == null ? v1 === v2 : this.compareFn()(v1, v2)
    }

    // The values of options; options without a value clear the selection, so they aren't among them.
    protected optionValues(options: ReadonlyArray<NbOptionComponent<T>>): T[] {
        return options.map((option) => option.value()).filter((value): value is T => value !== undefined)
    }

    protected hasRemovedSelectedOptions(): boolean {
        const options = this.options()
        return this.selectionModel().some((option) => !options.includes(option))
    }

    /**
     * Selects the options matching the value and deselects the others. Throws when the value's shape doesn't match
     * `multiple`: an array for a single select, or a single value for a multiple one.
     */
    protected setSelection(value?: T | T[] | null) {
        const multiple = this.multiple()
        // A bare `ngModel` writes '' initially; a multiple select treats it like no value.
        const isResetValue = this.isEmptyValue(value) || (multiple && value === '')
        let safeValue = value

        if (multiple) {
            safeValue = isResetValue ? [] : value
        }

        const isArray: boolean = Array.isArray(safeValue)

        if (multiple && !isArray && !isResetValue) {
            throw new Error("Can't assign single value if select is marked as multiple")
        }
        if (!multiple && isArray) {
            throw new Error("Can't assign array if select is not marked as multiple")
        }

        const previouslySelectedOptions = this.selectionModel()
        const selection = new Array<NbOptionComponent<T>>()

        // A multiple select has an array by now, and a single one doesn't.
        if (Array.isArray(safeValue)) {
            safeValue.forEach((option) => this.selectValue(option, selection))
        } else {
            this.selectValue(safeValue, selection)
        }
        this.selectionModel.set(selection)

        // find options which were selected before and trigger deselect
        previouslySelectedOptions
            .filter((option) => !selection.includes(option))
            .forEach((option) => option.deselect())
    }

    /**
     * Adds the option matching the value to the selection, if there is one.
     */
    protected selectValue(value: T | null | undefined, selection: Array<NbOptionComponent<T>>) {
        if (this.isEmptyValue(value)) {
            return
        }

        const corresponding = this.options().find((option) => this.sameValue(option.value(), value))

        if (corresponding) {
            corresponding.select()
            selection.push(corresponding)
        }
    }

    protected shouldShow(): boolean {
    // A disabled select, or one inside a disabled <fieldset>, stays closed.
        const disabled = this.isDisabled() || !!this.button()?.nativeElement.matches(':disabled')
        return !disabled && this.isHidden() && this.options().length > 0
    }

    /**
     * Marks the control touched when the button loses focus while the options are closed; focus moving into the
     * open options doesn't count.
     */
    trySetTouched() {
        if (this.isHidden()) {
            this.onTouched()
        }
    }

    protected isClickedWithinComponent($event: Event) {
        return this.hostRef.nativeElement === $event.target || this.hostRef.nativeElement.contains($event.target as Node)
    }

    protected canSelectValue(): boolean {
        return this.options().length > 0
    }
}
