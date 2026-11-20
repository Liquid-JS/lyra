import { Component, computed, ElementRef, inject, input, model, viewChildren } from '@angular/core'

import { NbStatusService, injectNbTexts, NbLocalize, NbComponentOrCustomStatus, ɵfocusOnClick as focusOnClick } from '@liquid-js/lyr-core/base'

/** @internal */
declare const $localize: NbLocalize

/** @internal */
function injectNbPageIndicatorTexts() {
    return injectNbTexts('pageIndicator', () => ({
        pages: $localize`:@@nb.pageIndicator.pages:Pages`,
        page: (page: number, count: number) => $localize`:@@nb.pageIndicator.page:Page ${page}:page: of ${count}:count:`
    }))
}

/**
 * A row of dots for the pages of a pager, such as slides, onboarding screens or the steps of a form, with the current
 * page's dot drawn long. The app shows the pages; the dots show and change which one:
 *
 * ```html
 * <nb-page-indicator [count]="slides.length" [(page)]="page" />
 * ```
 *
 * @stacked-example(Showcase, page-indicator/page-indicator-showcase.component)
 *
 * `page` counts from 0. Each dot is a button, named e.g. "Page 2 of 5", and the current one is `aria-current`; the
 * group is named "Pages", or by `aria-label`. One dot is in the tab order: arrow keys, Home and End move to another
 * page, and the focus with it.
 * @styles
 *
 * page-indicator-gap:
 * page-indicator-dot-size:
 * page-indicator-dot-padding:
 * page-indicator-active-dot-width:
 * page-indicator-dot-color:
 * page-indicator-dot-hover-color:
 * page-indicator-basic-active-color:
 * page-indicator-primary-active-color:
 * page-indicator-success-active-color:
 * page-indicator-info-active-color:
 * page-indicator-warning-active-color:
 * page-indicator-danger-active-color:
 * page-indicator-control-active-color:
 * page-indicator-outline-width:
 * page-indicator-outline-color:
 * page-indicator-animation-duration:
 */
@Component({
    selector: 'nb-page-indicator',
    template: `
    @for (dot of dots(); track $index) {
      <button
        #dot
        type="button"
        class="page-dot"
        [class.active]="$index === current()"
        [attr.tabindex]="$index === current() ? 0 : -1"
        [attr.aria-current]="$index === current() ? 'true' : null"
        [attr.aria-label]="texts().page($index + 1, dots().length)"
        (click)="focusOnClick($event); select($index)"
        (keydown)="onKeydown($event, $index)"
      ></button>
    }
  `,
    styleUrls: ['./page-indicator.component.scss'],
    host: {
        'role': 'group',
        '[attr.aria-label]': 'ariaLabel() ?? texts().pages',
        '[class]': 'statusClass()'
    }
})
export class NbPageIndicatorComponent {
    protected readonly statusService = inject(NbStatusService)
    protected readonly texts = injectNbPageIndicatorTexts()
    protected readonly focusOnClick = focusOnClick

    /** How many pages there are. */
    readonly count = input(0, { transform: (value: number | string) => Math.max(0, Math.floor(Number(value)) || 0) })

    /** The current page, from 0. */
    readonly page = model(0)

    /** The current dot's colour: `basic`, `primary` (default), `success`, `info`, `warning`, `danger` or `control`. */
    readonly status = input<NbComponentOrCustomStatus>('primary')

    /** Names the group of dots; "Pages" without it. */
    readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' })

    protected readonly dots = computed(() => Array.from({ length: this.count() }))
    /** The current page, within the pages there are. */
    protected readonly current = computed(() => Math.min(Math.max(0, this.page()), this.count() - 1))
    protected readonly statusClass = computed(() => this.statusService.getStatusClass(this.status()))
    protected readonly buttons = viewChildren<ElementRef<HTMLButtonElement>>('dot')

    /** @internal */
    select(index: number) {
        if (index !== this.page()) {
            this.page.set(index)
        }
    }

    /** @internal */
    onKeydown(event: KeyboardEvent, index: number) {
        const last = this.count() - 1
        const rtl = getComputedStyle(event.currentTarget as HTMLElement).direction === 'rtl'
        const next = {
            ArrowRight: index + (rtl ? -1 : 1),
            ArrowLeft: index + (rtl ? 1 : -1),
            ArrowDown: index + 1,
            ArrowUp: index - 1,
            Home: 0,
            End: last
        }[event.key]
        if (next === undefined) {
            return
        }
        event.preventDefault()
        const target = Math.min(last, Math.max(0, next))
        this.select(target)
        this.buttons()[target]?.nativeElement.focus()
    }
}
