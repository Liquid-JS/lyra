import { Component, computed, inject, input, signal } from '@angular/core'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { ActivatedRoute } from '@angular/router'
import { combineLatest } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { NgdStructureService, NgdTabbedService } from '../../../@theme/services'
import { NGD_AREA } from '../../../app.options'
import { NgdPreparedComponent, NgdTabs } from '../../../docs.model'
import { NgdOverviewBlockComponent } from '../overview-block/overview-block.component'
import { NgdStylesBlockComponent } from '../styles-block/styles-block.component'
import { NgdApiBlockComponent } from '../api-block/api-block.component'
import { NgdExamplesBlockComponent } from '../examples-block/examples-block.component'

@Component({
    selector: 'ngd-tabbed-block',
    templateUrl: './tabbed-block.component.html',
    imports: [NgdOverviewBlockComponent, NgdStylesBlockComponent, NgdApiBlockComponent, NgdExamplesBlockComponent]
})
export class NgdTabbedBlockComponent {
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly tabbedService = inject(NgdTabbedService)
    private readonly structureService = inject(NgdStructureService)
    private readonly area = inject(NGD_AREA)

    readonly currentTab = signal<{ tab: string } | undefined>(undefined)

    readonly source = input.required<NgdPreparedComponent[]>()

    readonly tabs = input<NgdTabs>()

    private readonly tabs$ = toObservable(computed(() => Object
        .entries(this.tabs() ?? {})
        .filter(([, val]) => val)
        .map(([key]) => ({ tab: key }))))

    constructor() {
    // The tab the URL names after the page, e.g. `api`; the routes open a page without one on its first tab.
        const tab$ = this.activatedRoute.params.pipe(
            map((params) => this.structureService.resolveRoute(this.area, params)?.tab)
        )

        combineLatest([
            tab$.pipe(filter((tab) => !!tab)),
            this.tabs$.pipe(filter((tabs) => tabs.length > 0))
        ])
            .pipe(takeUntilDestroyed())
            .subscribe(([tab, tabs]) => {
                const currentTab = tabs.find((item) => item.tab === tab)
                this.currentTab.set(currentTab)
            })
    }

    hasOverview(component: NgdPreparedComponent) {
        return this.tabbedService.componentHasOverview(component)
    }

    hasExamples(component: NgdPreparedComponent) {
        return this.tabbedService.componentHasExamples(component)
    }

    hasTheme(component: NgdPreparedComponent) {
        return this.tabbedService.componentHasTheme(component)
    }

    hasMethods(component: NgdPreparedComponent) {
        return this.tabbedService.componentHasMethods(component)
    }

    hasProps(component: NgdPreparedComponent) {
        return this.tabbedService.componentHasProps(component)
    }

    hasAPI(component: NgdPreparedComponent) {
        return this.hasMethods(component) || this.hasProps(component)
    }
}
