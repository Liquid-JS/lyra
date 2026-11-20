import { Component, computed, DestroyRef, inject, input, linkedSignal, output } from '@angular/core'

import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base'
import { NbAccordionComponent, NbAccordionItem } from './accordion.component'

/**
 * A section of an `nb-accordion`, with an `nb-accordion-item-header` and an `nb-accordion-item-body`.
 */
@Component({
    selector: 'nb-accordion-item',
    styleUrls: ['./accordion-item.component.scss'],
    templateUrl: './accordion-item.component.html',
    host: {
        '[class.collapsed]': 'isCollapsed()',
        '[class.expanded]': 'isExpanded()',
        '[class.disabled]': 'disabled()'
    }
})
export class NbAccordionItemComponent implements NbAccordionItem {
    private readonly accordion = inject(NbAccordionComponent, { host: true })

    /**
     * Whether the item is collapsed (`true` by default); `expanded` wins over it.
     */
    readonly collapsed = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty })

    /**
     * Expands the item, whatever `collapsed` says.
     */
    readonly expanded = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * Item is disabled and cannot be opened.
     */
    readonly disabled = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * Emits when a user or the accordion opens or closes the item.
     */
    readonly collapsedChange = output<boolean>()

    /**
     * Whether the item is collapsed: the `collapsed` and `expanded` inputs, until the item is toggled.
     */
    readonly isCollapsed = linkedSignal(() => this.collapsed() && !this.expanded())

    readonly isExpanded = computed(() => !this.isCollapsed())

    constructor() {
        inject(DestroyRef).onDestroy(this.accordion.register(this))
    }

    /**
     * Toggles an enabled item; outside `multi` mode it closes the other items first.
     */
    toggle() {
        if (!this.disabled()) {
            const collapsed = !this.isCollapsed()

            if (!this.accordion.multi()) {
                this.accordion.closeAll()
            }
            this.setCollapsed(collapsed)
        }
    }

    open() {
        this.setCollapsed(false)
    }

    close() {
        this.setCollapsed(true)
    }

    /**
     * Opens or closes an enabled item and emits `collapsedChange` when that changes its state.
     */
    setCollapsed(collapsed: boolean) {
        if (!this.disabled() && this.isCollapsed() !== collapsed) {
            this.isCollapsed.set(collapsed)
            this.collapsedChange.emit(collapsed)
        }
    }
}
