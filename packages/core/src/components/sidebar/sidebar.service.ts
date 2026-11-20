import { Service } from '@angular/core'
import { Subject, Observable, Observer, ReplaySubject } from 'rxjs'
import { share } from 'rxjs/operators'
import { NbSidebarResponsiveState, NbSidebarState } from './sidebar.component'

export const getSidebarState$ = new Subject<{ tag?: string, observer: Observer<NbSidebarState> }>()
export const getSidebarResponsiveState$ = new Subject<{
    tag?: string
    observer: Observer<NbSidebarResponsiveState>
}>()

/**
 * Controls the sidebars from anywhere in the app, e.g. a toggle button in the header. Provided by
 * `provideNbSidebar()` or `NbSidebarModule.forRoot()`.
 *
 * A call with a `tag` reaches the sidebar with that tag, and the sidebars without one; a call without a tag reaches
 * only the sidebars without one.
 *
 * @stacked-example(Sidebar State, sidebar/sidebar-toggle.component)
 */
@Service()
export class NbSidebarService {

    private toggle$ = new Subject<{ compact: boolean, tag?: string }>()
    private expand$ = new Subject<{ tag?: string }>()
    private collapse$ = new Subject<{ tag?: string }>()
    private compact$ = new Subject<{ tag?: string }>()

    /** The `toggle` calls, for the sidebars. */
    onToggle(): Observable<{ compact: boolean, tag?: string }> {
        return this.toggle$.pipe(share())
    }

    /** The `expand` calls, for the sidebars. */
    onExpand(): Observable<{ tag?: string }> {
        return this.expand$.pipe(share())
    }

    /** The `collapse` calls, for the sidebars. */
    onCollapse(): Observable<{ tag?: string }> {
        return this.collapse$.pipe(share())
    }

    /** The `compact` calls, for the sidebars. */
    onCompact(): Observable<{ tag?: string }> {
        return this.compact$.pipe(share())
    }

    /**
     * Expands a collapsed or compacted sidebar; otherwise collapses it, or with `compact` compacts it. See
     * `NbSidebarComponent.toggle`.
     */
    toggle(compact = false, tag?: string) {
        this.toggle$.next({ compact, tag })
    }

    expand(tag?: string) {
        this.expand$.next({ tag })
    }

    collapse(tag?: string) {
        this.collapse$.next({ tag })
    }

    compact(tag?: string) {
        this.compact$.next({ tag })
    }

    /** The current state of the sidebar, once per sidebar the tag reaches; it doesn't follow later changes. */
    getSidebarState(tag?: string): Observable<NbSidebarState> {
        const observer = new ReplaySubject<NbSidebarState>(1)
        getSidebarState$.next({ observer, tag })
        return observer.pipe(share())
    }

    /** The current responsive state of the sidebar, once per sidebar the tag reaches; it doesn't follow later changes. */
    getSidebarResponsiveState(tag?: string): Observable<NbSidebarResponsiveState> {
        const observer = new ReplaySubject<NbSidebarResponsiveState>()
        getSidebarResponsiveState$.next({ observer, tag })
        return observer.pipe(share())
    }
}
