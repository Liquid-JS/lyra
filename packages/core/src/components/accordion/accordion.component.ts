import { Component, input, linkedSignal } from '@angular/core'
import { injectNbDefaults, NbContainerAppearance, ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base'

/**
 * What the accordion needs from its items, which register themselves.
 */
export interface NbAccordionItem {
    setCollapsed(collapsed: boolean): void
}

/**
 * An accordion allows to toggle the display of sections of content
 *
 * Basic example
 *
 * @stacked-example(Showcase, accordion/accordion-showcase.component)
 *
 * ```ts
 * <nb-accordion>
 *  <nb-accordion-item>
 *   <nb-accordion-item-header>Product Details</nb-accordion-item-header>
 *   <nb-accordion-item-body>
 *     Item Content
 *   </nb-accordion-item-body>
 *  </nb-accordion-item>
 * </nb-accordion>
 * ```
 * ### Installation
 *
 * Import `NbAccordionComponent`, `NbAccordionItemComponent`, `NbAccordionItemHeaderComponent`, `NbAccordionItemBodyComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbAccordionComponent, NbAccordionItemComponent, NbAccordionItemHeaderComponent, NbAccordionItemBodyComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbAccordionModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbAccordionModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * With `multi` mode accordion can have multiple items expanded:
 * @stacked-example(Multiple expanded items, accordion/accordion-multi.component)
 *
 * `NbAccordionItemComponent` has several methods, for example it is possible to trigger item click/toggle:
 * @stacked-example(Expand API, accordion/accordion-toggle.component)
 * @styles
 *
 * accordion-border-width:
 * accordion-border-style:
 * accordion-border-color:
 * accordion-border-radius:
 * accordion-padding:
 * accordion-shadow:
 * accordion-floating-shadow:
 * accordion-header-text-color:
 * accordion-header-text-font-family:
 * accordion-header-text-font-size:
 * accordion-header-text-font-weight:
 * accordion-header-text-line-height:
 * accordion-header-disabled-text-color:
 * accordion-header-border-color:
 * accordion-header-border-style:
 * accordion-header-border-width:
 * accordion-header-hover-background-color:
 * accordion-header-outline-width:
 * accordion-header-outline-color:
 * accordion-item-background-color:
 * accordion-item-text-color:
 * accordion-item-text-font-family:
 * accordion-item-text-font-size:
 * accordion-item-text-font-weight:
 * accordion-item-text-line-height:
 */
@Component({
    selector: 'nb-accordion',
    template: `
    <ng-content select="nb-accordion-item" />
  `,
    host: {
        '[class]': '"appearance-" + appearance()'
    }
})
export class NbAccordionComponent {
    protected readonly items = new Set<NbAccordionItem>()
    // The app's defaults for accordions, which the appearance starts from.
    protected readonly nbDefaults = injectNbDefaults('accordion')

    /**
     * Accordion appearance: `outline`, a card's border, or `floating`, a shadow instead, over the page.
     */
    readonly appearanceInput = input<NbContainerAppearance | undefined>(undefined, { alias: 'appearance' })
    /** The appearance in use: the input's, the app's default, or 'outline'. */
    readonly appearance = linkedSignal<NbContainerAppearance>(
        () => this.appearanceInput() ?? this.nbDefaults().appearance ?? 'outline'
    )

    /**
     * Allows several items to be expanded at once; otherwise opening an item closes the others.
     */
    readonly multi = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * Opens all enabled items; does nothing outside `multi` mode.
     */
    openAll() {
        if (this.multi()) {
            this.items.forEach((item) => item.setCollapsed(false))
        }
    }

    /**
     * Closes all enabled items.
     */
    closeAll() {
        this.items.forEach((item) => item.setCollapsed(true))
    }

    /**
     * @docs-private
     */
    register(item: NbAccordionItem): () => void {
        this.items.add(item)
        return () => this.items.delete(item)
    }
}
