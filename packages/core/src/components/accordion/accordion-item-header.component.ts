import { Component, computed, inject } from '@angular/core'
import { NbIconComponent } from '@liquid-js/lyr-core/icon'
import { NbAccordionItemComponent } from './accordion-item.component'

/**
 * The header of an `nb-accordion-item`: a button that toggles the item with a click, Space or Enter, and shows a
 * chevron unless the item is disabled.
 */
@Component({
    selector: 'nb-accordion-item-header',
    styleUrls: ['./accordion-item-header.component.scss'],
    templateUrl: './accordion-item-header.component.html',
    imports: [NbIconComponent],
    host: {
        'role': 'button',
        '[class.accordion-item-header-collapsed]': 'isCollapsed()',
        '[class.accordion-item-header-expanded]': 'expanded()',
        '[attr.aria-expanded]': 'expanded()',
        // A disabled header is skipped by Tab.
        '[attr.tabindex]': 'tabbable()',
        '[attr.aria-disabled]': 'disabled()',
        '(click)': 'toggle()',
        // As a button's: Space doesn't scroll the page.
        '(keydown.space)': '$event.preventDefault(); toggle()',
        '(keydown.enter)': '$event.preventDefault(); toggle()'
    }
})
export class NbAccordionItemHeaderComponent {
    private readonly accordionItem = inject(NbAccordionItemComponent, { host: true })

    readonly isCollapsed = computed(() => this.accordionItem.isCollapsed())

    readonly expanded = computed(() => !this.accordionItem.isCollapsed())

    readonly tabbable = computed(() => (this.accordionItem.disabled() ? '-1' : '0'))

    readonly disabled = computed(() => this.accordionItem.disabled())

    readonly state = computed(() => (this.isCollapsed() ? 'collapsed' : 'expanded'))

    toggle() {
        this.accordionItem.toggle()
    }
}
