import { Component } from '@angular/core'
import { NbContextMenuDirective, NbMenuComponent, type NbMenuItem } from '@liquid-js/lyr-core'

import { combinations, kit } from './specimen'

const ITEMS: NbMenuItem[] = [
    { title: 'Dashboard', icon: 'home-outline', link: '/design-kit/menu' },
    {
        title: 'Projects',
        icon: 'folder-outline',
        expanded: true,
        children: [
            { title: 'Website', link: '/design-kit/menu/website' },
            { title: 'Mobile app', link: '/design-kit/menu/app' }
        ]
    },
    { title: 'Messages', icon: 'email-outline', link: '/design-kit/menu/messages', badge: { text: '3', status: 'danger' } },
    { title: 'Settings', group: true },
    { title: 'Account', icon: 'person-outline', link: '/design-kit/menu/account' }
]

/** Menus down and across, the Dashboard item selected as the page is its link; and a context menu, open. */
@Component({
    template: `
        <div class="specimens">
            @for (menu of menus; track $index) {
            <nb-menu [attr.data-kit]="kit('menu', menu)"
                [orientation]="menu.orientation"
                [items]="menu.orientation === 'vertical' ? items : flat"
                [style.width]="menu.orientation === 'vertical' ? '16rem' : null" />
            }
            <div [attr.data-kit]="kit('context-menu', {})"
                data-kit-open="button"
                data-kit-overlay-only>
                <button type="button"
                    [nbContextMenu]="context">Open</button>
            </div>
        </div>
    `,
    imports: [NbMenuComponent, NbContextMenuDirective]
})
export class MenuSpecimenComponent {
    readonly kit = kit
    readonly items = ITEMS
    readonly flat = ITEMS.filter((item) => !item.group && !item.children)
    readonly context: NbMenuItem[] = [{ title: 'Edit', icon: 'edit-outline' }, { title: 'Duplicate', icon: 'copy-outline' }, { title: 'Delete', icon: 'trash-2-outline' }]
    readonly menus = combinations({ orientation: ['vertical', 'horizontal'] as const })
}
