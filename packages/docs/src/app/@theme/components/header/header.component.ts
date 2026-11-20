import {
    Component,
    DestroyRef,
    ElementRef,
    afterNextRender,
    computed,
    inject,
    input,
    signal,
    viewChild
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import {
    NB_DOCUMENT,
    NB_WINDOW,
    NbContextMenuDirective,
    NbMenuItem,
    NbSidebarService,
    NbIconComponent,
    NbSelectComponent,
    NbOptionComponent
} from '@liquid-js/lyr-core'
import { filter, map, startWith } from 'rxjs/operators'

import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router'
import { NgdVersionService, Version } from '../../services'
import { STRUCTURE } from '../../../app.options'

@Component({
    selector: 'ngd-header',
    styleUrls: ['./header.component.scss'],
    templateUrl: './header.component.html',
    host: { '[class.docs-page]': 'isDocs()' },
    imports: [
        NbContextMenuDirective,
        NbIconComponent,
        RouterLink,
        RouterLinkActive,
        NbSelectComponent,
        NbOptionComponent
    ]
})
export class NgdHeaderComponent {
    private readonly versionService = inject(NgdVersionService)
    private readonly sidebarService = inject(NbSidebarService)

    readonly showSearch = input(true)
    readonly isDocs = input(false)

    private readonly window = inject(NB_WINDOW)
    readonly supportedVersions = toSignal(this.versionService.getSupportedVersions(), { initialValue: [] })
    readonly currentVersion = toSignal(this.versionService.getCurrentVersion())
    readonly currentVersionName = computed(() => this.currentVersion()?.name)
    readonly showVersionSelect = computed(() => this.supportedVersions().length > 0)

    // The docs areas, each selected on any of its pages.
    readonly mainMenu: NbMenuItem[] = inject(STRUCTURE).map((area) => ({
        title: area.name,
        link: `/${area.path}`,
        pathMatch: 'prefix'
    }))

    /** How many areas fit in the header; the rest are under More. */
    protected readonly fit = signal(this.mainMenu.length)
    /** The areas that don't fit, under More. */
    protected readonly overflowItems = computed(() => this.mainMenu.slice(this.fit()))
    private readonly url = toSignal(
        inject(Router).events.pipe(
            filter((event) => event instanceof NavigationEnd),
            map((event) => event.urlAfterRedirects),
            startWith(inject(Router).url)
        ),
        { initialValue: '' }
    )
    /** More holds the area shown. */
    protected readonly moreActive = computed(() => {
        const url = this.url()
        return this.overflowItems().some(({ link }) => link && url.startsWith(link))
    })

    private readonly areas = viewChild.required<ElementRef<HTMLElement>>('areas')
    private readonly more = viewChild.required<ElementRef<HTMLElement>>('more')

    constructor() {
        const document = inject(NB_DOCUMENT)
        const destroyRef = inject(DestroyRef)
        afterNextRender(() => {
            const observer = new ResizeObserver(() => this.fitAreas())
            observer.observe(this.areas().nativeElement)
            destroyRef.onDestroy(() => observer.disconnect())
            // Text takes its width once its font loads.
            void document.fonts?.ready.then(() => this.fitAreas())
        })
    }

    // As many areas as the header has room for, in order, with room for More when some don't fit. Areas that don't fit
    // keep their width out of the flow, so they're measured all the same.
    private fitAreas() {
        const nav = this.areas().nativeElement
        const widths = [...nav.querySelectorAll<HTMLElement>('a.area')].map((area) => area.getBoundingClientRect().width)
        const room = nav.getBoundingClientRect().width
        const more = this.more().nativeElement.getBoundingClientRect().width
        let fit = 0
        let used = 0
        while (fit < widths.length) {
            const next = used + widths[fit]
            const last = fit === widths.length - 1
            if (next + (last ? 0 : more) > room + 0.5) {
                break
            }
            used = next
            fit++
        }
        if (fit !== this.fit()) {
            this.fit.set(fit)
        }
    }

    readonly sidebarTag = input<string>()

    toggleSidebar() {
        this.sidebarService.toggle(false, this.sidebarTag())
    }

    redirectToVersion(version: Version | null) {
        if (version) {
            this.window?.location.assign(version.path)
        }
    }
}
