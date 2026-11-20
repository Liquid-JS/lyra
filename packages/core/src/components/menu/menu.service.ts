import { inject, Service } from '@angular/core'
import { Location } from '@angular/common'
import { Params, QueryParamsHandling } from '@angular/router'
import { Observable, BehaviorSubject, ReplaySubject, Subject } from 'rxjs'
import { share } from 'rxjs/operators'
import { NbIconConfig } from '@liquid-js/lyr-core/icon'
import { NbBadge } from '@liquid-js/lyr-core/badge'
import {
    isFragmentContain,
    isFragmentEqual,
    isQueryParamsMatch,
    isUrlPathContain,
    isUrlPathEqual
} from './url-matching-helpers'

export interface NbMenuBag {
    tag?: string
    item: NbMenuItem
}

/**
 * Delivers menu service commands to the menus with a matching tag (or to all menus for a command without a tag).
 * A command sent while no such menu exists waits for the first one, and is delivered only once,
 * so a menu created later doesn't get the commands meant for an earlier one.
 * */
class NbMenuCommands<T extends { tag?: string }> {
    protected readonly listeners = new Set<{ tag?: string, next: (command: T) => void }>()
    protected pending = new Array<T>()

    send(command: T) {
        const listeners = Array.from(this.listeners).filter((listener) => this.matches(command, listener.tag))
        if (listeners.length) {
            listeners.forEach((listener) => listener.next(command))
        } else {
            this.pending.push(command)
        }
    }

    listen(tag?: string): Observable<T> {
        return new Observable<T>((subscriber) => {
            const listener = { tag, next: (command: T) => subscriber.next(command) }
            this.listeners.add(listener)

            const ready = this.pending.filter((command) => this.matches(command, tag))
            this.pending = this.pending.filter((command) => !ready.includes(command))
            ready.forEach(listener.next)

            return () => this.listeners.delete(listener)
        })
    }

    protected matches(command: T, tag?: string): boolean {
        return !command.tag || command.tag === tag
    }
}

const itemClick$ = new Subject<NbMenuBag>()
const addItems$ = new NbMenuCommands<{ tag?: string, items: NbMenuItem[] }>()
const navigateHome$ = new NbMenuCommands<{ tag?: string }>()
const getSelectedItem$ = new NbMenuCommands<{
    tag?: string
    listener: BehaviorSubject<{ tag?: string, item?: NbMenuItem } | undefined>
}>()
const itemSelect$ = new ReplaySubject<NbMenuBag>(1)
const itemHover$ = new ReplaySubject<NbMenuBag>(1)
const submenuToggle$ = new ReplaySubject<NbMenuBag>(1)
const collapseAll$ = new NbMenuCommands<{ tag?: string }>()

export type NbMenuBadgeConfig = Omit<NbBadge, 'position'>

/**
 * An item of an `nb-menu`: a router `link`, a plain `url`, an action without either, a `group` heading, or a parent
 * of `children`. The menu sets `parent`, `selected` and `expanded` on it.
 *
 * @stacked-example(Menu Link Parameters, menu/menu-link-params.component)
 */
export class NbMenuItem<D = unknown> {
    title = ''
    /**
     * Link for the router (`routerLink`).
     */
    link?: string
    /**
     * Plain `href`, e.g. for a page outside the app.
     */
    url?: string
    /**
     * Icon name, or an icon config.
     */
    icon?: string | NbIconConfig
    /**
     * Whether the submenu is open; the menu updates it as the user opens and closes submenus.
     */
    expanded?: boolean
    /**
     * A badge shown after the title.
     */
    badge?: NbMenuBadgeConfig
    /**
     * The items of the submenu.
     */
    children?: Array<NbMenuItem<D>>
    /**
     * The link's `target`; a link that opens elsewhere (e.g. `_blank`) doesn't take the selection.
     */
    target?: string
    /**
     * Leaves the item out of the menu; a parent whose children are all hidden shows as a plain item.
     */
    hidden?: boolean
    /**
     * How the URL must match `link` for the item to be selected: wholly (`full`, the default), or as a prefix ending
     * at a path segment (`prefix`). `queryParams` and `fragment` are matched the same way.
     */
    pathMatch?: 'full' | 'prefix' = 'full'
    /**
     * The item `NbMenuService.navigateHome()` goes to.
     */
    home?: boolean
    /**
     * A heading rather than a link: shown as plain text.
     */
    group?: boolean
    /** The `routerLink`'s `skipLocationChange`. */
    skipLocationChange?: boolean
    /** Query params of the `routerLink`; they also tell items with the same `link` apart when selecting from the URL. */
    queryParams?: Params
    queryParamsHandling?: QueryParamsHandling
    parent?: NbMenuItem<D>
    selected?: boolean
    /** The app's own data of the item. */
    data?: D
    fragment?: string
    preserveFragment?: boolean
    /** ARIA role of the link; an item with neither `link` nor `url` is a `button` by default. */
    ariaRole?: string

    /**
     * The item's parents, from the top down.
     */
    static getParents<D>(item: NbMenuItem<D>): Array<NbMenuItem<D>> {
        const parents = new Array<NbMenuItem<D>>()

        let parent = item.parent
        while (parent) {
            parents.unshift(parent)
            parent = parent.parent
        }

        return parents
    }

    static isParent<D>(item: NbMenuItem<D>, possibleChild: NbMenuItem<D>): boolean {
        return possibleChild.parent ? possibleChild.parent === item || this.isParent(item, possibleChild.parent) : false
    }
}

/**
 * Listens to menu events and sends commands to menus. A `tag` addresses the menu with that tag; without one, a command
 * goes to every menu. Events carry the tag of the menu they come from.
 *
 * @stacked-example(Menu Service, menu/menu-service.component)
 */
@Service()
export class NbMenuService {
    /**
     * Adds items to the end of the menu. A command sent before the menu exists waits for it.
     */
    addItems(items: NbMenuItem[], tag?: string) {
        addItems$.send({ tag, items })
    }

    /**
     * Closes all submenus.
     */
    collapseAll(tag?: string) {
        collapseAll$.send({ tag })
    }

    /**
     * Goes to the item marked `home`.
     */
    navigateHome(tag?: string) {
        navigateHome$.send({ tag })
    }

    /**
     * The selected item as it is now, not followed afterwards: the observable emits `undefined` until the menu answers,
     * then once with the item (or none).
     */
    getSelectedItem(tag?: string): Observable<{ tag?: string, item?: NbMenuItem } | undefined> {
        const listener = new BehaviorSubject<{ tag?: string, item?: NbMenuItem } | undefined>(
            undefined
        )

        getSelectedItem$.send({ tag, listener })

        return listener.asObservable()
    }

    onItemClick(): Observable<NbMenuBag> {
        return itemClick$.pipe(share())
    }

    onItemSelect(): Observable<NbMenuBag> {
        return itemSelect$.pipe(share())
    }

    onItemHover(): Observable<NbMenuBag> {
        return itemHover$.pipe(share())
    }

    onSubmenuToggle(): Observable<NbMenuBag> {
        return submenuToggle$.pipe(share())
    }
}

@Service()
export class NbMenuInternalService {
    private readonly location = inject(Location)

    prepareItems(items: NbMenuItem[]) {
        const defaultItem = new NbMenuItem()
        items.forEach((i) => {
            this.applyDefaults(i, defaultItem)
            this.setParent(i)
        })
    }

    /**
     * Selects the item matching the current URL. With `resetIfNoMatch`, a URL that matches no item clears the selection,
     * so the item of the previous page doesn't stay selected.
     */
    selectFromUrl(items: NbMenuItem[], tag?: string, collapseOther: boolean = false, resetIfNoMatch: boolean = false) {
        const selectedItem = this.findItemByUrl(items)
        if (selectedItem) {
            this.selectItem(selectedItem, items, collapseOther, tag)
        } else if (resetIfNoMatch) {
            this.resetSelection(items)
        }
    }

    selectItem(item: NbMenuItem, items: NbMenuItem[], collapseOther: boolean = false, tag?: string) {
        const unselectedItems = this.resetSelection(items)
        const collapsedItems = collapseOther ? this.collapseItems(items) : []

        for (const parent of NbMenuItem.getParents(item)) {
            parent.selected = true
            // emit event only for items that weren't selected before ('unselectedItems' contains items that were selected)
            if (!unselectedItems.includes(parent)) {
                this.itemSelect(parent, tag)
            }

            const wasNotExpanded = !parent.expanded
            parent.expanded = true
            const i = collapsedItems.indexOf(parent)
            // emit event only for items that weren't expanded before.
            // 'collapsedItems' contains items that were expanded, so no need to emit event.
            // in case 'collapseOther' is false, 'collapsedItems' will be empty,
            // so also check if item isn't expanded already ('wasNotExpanded').
            if (i === -1 && wasNotExpanded) {
                this.submenuToggle(parent, tag)
            } else {
                collapsedItems.splice(i, 1)
            }
        }

        item.selected = true
        // emit event only for items that weren't selected before ('unselectedItems' contains items that were selected)
        if (!unselectedItems.includes(item)) {
            this.itemSelect(item, tag)
        }

        // remaining items which wasn't expanded back after expanding all currently selected items
        for (const collapsedItem of collapsedItems) {
            this.submenuToggle(collapsedItem, tag)
        }
    }

    collapseAll(items: NbMenuItem[], tag?: string, except?: NbMenuItem) {
        const collapsedItems = this.collapseItems(items, except)

        for (const item of collapsedItems) {
            this.submenuToggle(item, tag)
        }
    }

    onAddItem(tag?: string): Observable<{ tag?: string, items: NbMenuItem[] }> {
        return addItems$.listen(tag)
    }

    onNavigateHome(tag?: string): Observable<{ tag?: string }> {
        return navigateHome$.listen(tag)
    }

    onCollapseAll(tag?: string): Observable<{ tag?: string }> {
        return collapseAll$.listen(tag)
    }

    onGetSelectedItem(tag?: string): Observable<{
        tag?: string
        listener: BehaviorSubject<{ tag?: string, item?: NbMenuItem } | undefined>
    }> {
        return getSelectedItem$.listen(tag)
    }

    itemHover(item: NbMenuItem, tag?: string) {
        itemHover$.next({ tag, item })
    }

    submenuToggle(item: NbMenuItem, tag?: string) {
        submenuToggle$.next({ tag, item })
    }

    itemSelect(item: NbMenuItem, tag?: string) {
        itemSelect$.next({ tag, item })
    }

    itemClick(item: NbMenuItem, tag?: string) {
        itemClick$.next({ tag, item })
    }

    /**
     * Unselects the items and their children, and returns the ones that were selected.
     */
    private resetSelection(items: NbMenuItem[]): NbMenuItem[] {
        const unselectedItems = new Array<NbMenuItem>()

        for (const item of items) {
            if (item.selected) {
                unselectedItems.push(item)
            }
            item.selected = false

            if (item.children) {
                unselectedItems.push(...this.resetSelection(item.children))
            }
        }

        return unselectedItems
    }

    /**
     * Collapses the items and their children, and returns the ones that were expanded. `except` and its parents stay
     * as they are.
     */
    private collapseItems(items: NbMenuItem[], except?: NbMenuItem): NbMenuItem[] {
        const collapsedItems = new Array<NbMenuItem>()

        for (const item of items) {
            if (item === except) {
                continue
            }
            if (except && NbMenuItem.isParent(item, except)) {
                // Keep the path to `except` open, but collapse its siblings further down.
                collapsedItems.push(...this.collapseItems(item.children ?? [], except))
                continue
            }

            if (item.expanded) {
                collapsedItems.push(item)
            }
            item.expanded = false

            if (item.children) {
                collapsedItems.push(...this.collapseItems(item.children))
            }
        }

        return collapsedItems
    }

    private applyDefaults(item: NbMenuItem, defaultItem: NbMenuItem) {
        const menuItem = { ...item }
        Object.assign(item, defaultItem, menuItem)
        item.children &&
            item.children.forEach((child) => {
                this.applyDefaults(child, defaultItem)
            })
    }

    private setParent(item: NbMenuItem) {
        item.children &&
            item.children.forEach((child) => {
                child.parent = item
                this.setParent(child)
            })
    }

    /**
     * The deepest item matching the current URL, children before their parent.
     */
    private findItemByUrl(items: NbMenuItem[]): NbMenuItem | undefined {
        let selectedItem: NbMenuItem | undefined

        items.some((item) => {
            if (item.children) {
                selectedItem = this.findItemByUrl(item.children)
            }
            if (!selectedItem && this.isSelectedInUrl(item)) {
                selectedItem = item
            }

            return selectedItem
        })

        return selectedItem
    }

    private isSelectedInUrl(item: NbMenuItem): boolean {
        const exact: boolean = item.pathMatch === 'full'
        const link = item.link

        let isSelectedInPath = exact
            ? isUrlPathEqual(this.location.path(), link)
            : isUrlPathContain(this.location.path(), link)

        // Items for the same path tell apart by their query params.
        if (isSelectedInPath && item.queryParams) {
            isSelectedInPath = isQueryParamsMatch(this.location.path(true), item.queryParams, exact)
        }

        if (isSelectedInPath && item.fragment != null) {
            return exact
                ? isFragmentEqual(this.location.path(true), item.fragment)
                : isFragmentContain(this.location.path(true), item.fragment)
        }

        return isSelectedInPath
    }
}
