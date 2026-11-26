import { afterNextRender, Component, ElementRef, inject } from '@angular/core'
import {
    NbCardBodyComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbCardHeaderComponent,
    NbListComponent,
    NbListItemComponent,
    NbListItemDescriptionComponent,
    NbListItemTitleComponent,
    NbMenuComponent,
    NbTabComponent,
    NbTabsetComponent,
    type NbMenuItem
} from '@liquid-js/lyr-core'

import { TableShowcaseComponent } from '../playground/with-layout/table/table-showcase.component'
import { combinations, kit, STATUSES } from './specimen'

const MENU_STATES = ['default', 'hover', 'selected'] as const

/** A menu's items of every kind, by title: the kind each is as a part. */
const MENU_KINDS: Record<string, string> = {
    Dashboard: 'icon',
    Reports: 'collapsed',
    Projects: 'expanded',
    Website: 'child',
    Messages: 'badge',
    Settings: 'group'
}

/**
 * The parts larger components are made of, for designs to compose their own: menu items of every kind, tabs, a table's
 * header cells in each sort and its cells, a list item, and a card's header in every status, body and footer. Each
 * part is tagged where its component renders it, after the components render.
 */
@Component({
    template: `
        <div class="specimens">
            @for (state of menuStates; track state) {
            <nb-menu class="kit-menu"
                [attr.data-state]="state"
                style="width: 16rem"
                [items]="menuItems(state)" />
            }
            @for (tab of tabs; track $index) {
            <nb-tabset class="kit-tabset"
                [attr.data-tab]="json(tab)"
                style="width: 24rem">
                <nb-tab tabTitle="Overview"
                    [active]="tab.state !== 'active'">Overview content</nb-tab>
                <nb-tab tabTitle="Activity"
                    [active]="tab.state === 'active'"
                    [disabled]="tab.state === 'disabled'"
                    [badgeText]="tab.content === 'badge' ? '3' : ''"
                    badgeStatus="danger"
                    [tabIcon]="tab.content === 'icon' ? 'activity-outline' : ''">Activity content</nb-tab>
            </nb-tabset>
            }
            @for (sort of sorts; track sort) {
            <div class="kit-table"
                [attr.data-sort]="sort"
                style="width: 48rem">
                <nb-table-showcase />
            </div>
            }
            <nb-list style="width: 20rem">
                <nb-list-item [attr.data-kit]="kit('list-item', {})">
                    <nb-list-item-title>Jane Doe</nb-list-item-title>
                    <nb-list-item-description>Designer</nb-list-item-description>
                </nb-list-item>
            </nb-list>
            @for (status of cardStatuses; track status; let first = $first) {
            <nb-card [status]="status"
                style="width: 20rem">
                <nb-card-header [attr.data-kit]="kit('card-header', { status: status || 'none' })">Header</nb-card-header>
                <nb-card-body [attr.data-kit]="first ? kit('card-body', {}) : null">Body</nb-card-body>
                <nb-card-footer [attr.data-kit]="first ? kit('card-footer', {}) : null">Footer</nb-card-footer>
            </nb-card>
            }
        </div>
    `,
    imports: [
        NbMenuComponent,
        NbTabsetComponent,
        NbTabComponent,
        NbListComponent,
        NbListItemComponent,
        NbListItemTitleComponent,
        NbListItemDescriptionComponent,
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NbCardFooterComponent,
        TableShowcaseComponent
    ]
})
export class PartsSpecimenComponent {
    private readonly host = inject<ElementRef<HTMLElement>>(ElementRef)

    readonly kit = kit
    readonly json = JSON.stringify
    readonly menuStates = MENU_STATES
    readonly tabs = combinations({ content: ['text', 'icon', 'badge'] as const, state: ['default', 'hover', 'active', 'disabled'] as const })
    readonly sorts = ['none', 'asc', 'desc'] as const
    readonly cardStatuses = ['', ...STATUSES]

    constructor() {
        afterNextRender(() => {
            // A table's header sorted ascending, then descending, by its first column's button.
            for (const table of Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>('.kit-table'))) {
                const clicks = { none: 0, asc: 1, desc: 2 }[table.dataset['sort'] as 'none' | 'asc' | 'desc']
                for (let click = 0; click < clicks; click++) {
                    table.querySelector<HTMLElement>('th button')?.click()
                }
            }
            // Tagged once the clicks have rendered.
            setTimeout(() => this.tag(), 100)
        })
    }

    /** The items of a menu in a state: every kind, selected in the selected state; the group only at rest. */
    menuItems(state: (typeof MENU_STATES)[number]): NbMenuItem[] {
        const selected = state === 'selected'
        return [
            { title: 'Dashboard', icon: 'home-outline', selected },
            { title: 'Reports', icon: 'file-text-outline', expanded: false, children: [{ title: 'Monthly' }], selected },
            { title: 'Projects', icon: 'folder-outline', expanded: true, children: [{ title: 'Website', selected }] },
            { title: 'Messages', icon: 'email-outline', badge: { text: '3', status: 'danger' }, selected },
            ...(state === 'default' ? [{ title: 'Settings', group: true }] : []),
            // Last, untagged: the last item has no divider below it, which the others have.
            { title: 'Account', icon: 'person-outline' }
        ]
    }

    private tag() {
        const root = this.host.nativeElement
        for (const menu of Array.from(root.querySelectorAll<HTMLElement>('nb-menu.kit-menu'))) {
            const state = menu.dataset['state'] ?? 'default'
            for (const item of Array.from(menu.querySelectorAll<HTMLElement>('li.menu-item'))) {
                const title = item.querySelector(':scope > a .menu-title, :scope > span')?.textContent?.trim() ?? ''
                const kind = MENU_KINDS[title]
                if (!kind || (kind === 'group' && state !== 'default')) {
                    continue
                }
                // An expanded item's row is its link, as its children follow it; the others are the whole item.
                const part = kind === 'expanded' ? item.querySelector<HTMLElement>(':scope > a') : item
                if (!part) {
                    continue
                }
                part.setAttribute('data-kit', kit('menu-item', { kind, state }))
                if (state === 'hover') {
                    part.setAttribute('data-kit-state', 'hover')
                    if (part !== item.querySelector(':scope > a')) {
                        part.setAttribute('data-kit-target', ':scope > a')
                    }
                }
            }
        }
        for (const tabset of Array.from(root.querySelectorAll<HTMLElement>('nb-tabset.kit-tabset'))) {
            const inputs = JSON.parse(tabset.dataset['tab'] ?? '{}') as { content: string, state: string }
            const tab = tabset.querySelectorAll<HTMLElement>('li.tab')[1]
            tab.setAttribute('data-kit', kit('tab', inputs))
            if (inputs.state === 'hover') {
                tab.setAttribute('data-kit-state', 'hover')
            }
        }
        for (const table of Array.from(root.querySelectorAll<HTMLElement>('.kit-table'))) {
            const sort = table.dataset['sort'] ?? 'none'
            table.querySelector('th')?.setAttribute('data-kit', kit('table-header-cell', { sort }))
            if (sort === 'none') {
                table.querySelector('td')?.setAttribute('data-kit', kit('table-cell', {}))
            }
        }
    }
}
