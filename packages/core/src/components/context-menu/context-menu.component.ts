import { ChangeDetectionStrategy, Component, input } from '@angular/core'

import { NbMenuItem, NbMenuComponent } from '@liquid-js/lyr-core/menu'
import { NbPositionedContainerComponent, NbRenderableContainer } from '@liquid-js/lyr-core/cdk'

/**
 * The overlay `NbContextMenuDirective` opens: an `nb-menu` of its items.
 *
 * @styles
 *
 * context-menu-background-color:
 * context-menu-border-color:
 * context-menu-border-style:
 * context-menu-border-width:
 * context-menu-border-radius:
 * context-menu-text-align:
 * context-menu-min-width:
 * context-menu-max-width:
 * context-menu-shadow:
 * */
@Component({
    selector: 'nb-context-menu',
    template: '<nb-menu class="context-menu" [items]="context().items" [tag]="context().tag" />',
    // The menu inside reads items that apps change in place.
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NbMenuComponent],
    host: {
        'animate.enter': 'nb-overlay-enter',
        'animate.leave': 'nb-overlay-leave'
    }
})
export class NbContextMenuComponent extends NbPositionedContainerComponent implements NbRenderableContainer {
    readonly items = input<NbMenuItem[]>([])
    readonly tag = input<string>()

    readonly context = input<{ items: NbMenuItem[], tag?: string }>({ items: [] })

    /**
     * Nothing to do: change detection renders the menu from `context`.
     */
    renderContent() {}
}
