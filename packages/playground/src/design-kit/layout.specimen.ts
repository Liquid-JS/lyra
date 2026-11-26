import { Component, inject, ViewEncapsulation } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import {
    NbActionComponent,
    NbActionsComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbLayoutColumnComponent,
    NbLayoutComponent,
    NbLayoutFooterComponent,
    NbLayoutHeaderComponent,
    NbMenuComponent,
    NbSidebarComponent,
    NbThemeService,
    NbUserComponent,
    type NbMenuItem
} from '@liquid-js/lyr-core'

import { loadPlaygroundTheme } from '../playground/playground-theme'
import { kit } from './specimen'

/**
 * An app's screen: a header with actions and the user, a sidebar with a menu in the state the `sidebar` query
 * parameter names, a card in the column and a footer. A page of its own, as a layout is the whole page.
 *
 * With the `parts` query parameter, the header, sidebar and footer are empty and tagged as the parts a design composes
 * its own screens from, and the layout isn't tagged.
 */
@Component({
    template: `
        @if (themeLoaded()) {
        <nb-layout [attr.data-kit]="parts ? null : kit('layout', { sidebar })">
            <nb-layout-header [attr.data-kit]="parts ? kit('layout-header', {}) : null">
                @if (!parts) {
                <span class="kit-brand">Acme</span>
                <nb-actions size="small"
                    class="kit-actions">
                    <nb-action icon="search-outline" />
                    <nb-action icon="bell-outline"
                        badgeDot
                        badgeStatus="danger" />
                    <nb-action>
                        <nb-user name="Jane Doe"
                            title="Designer"
                            size="small" />
                    </nb-action>
                </nb-actions>
                }
            </nb-layout-header>
            <nb-sidebar [state]="sidebar"
                [attr.data-kit]="parts ? kit('sidebar', { state: sidebar }) : null">
                @if (!parts) {
                <nb-menu [items]="items" />
                }
            </nb-sidebar>
            <nb-layout-column>
                <nb-card>
                    <nb-card-header>Overview</nb-card-header>
                    <nb-card-body>Content</nb-card-body>
                </nb-card>
            </nb-layout-column>
            <nb-layout-footer [attr.data-kit]="parts ? kit('layout-footer', {}) : null">
                @if (!parts) {
                © 2026 Acme
                }
            </nb-layout-footer>
        </nb-layout>
        }
    `,
    styles: `
        .kit-brand {
            font-weight: 700;
        }

        .kit-actions {
            margin-inline-start: auto;
        }
    `,
    encapsulation: ViewEncapsulation.None,
    imports: [
        NbLayoutComponent,
        NbLayoutHeaderComponent,
        NbLayoutColumnComponent,
        NbLayoutFooterComponent,
        NbSidebarComponent,
        NbMenuComponent,
        NbActionsComponent,
        NbActionComponent,
        NbUserComponent,
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent
    ]
})
export class LayoutSpecimenComponent {
    readonly kit = kit
    readonly themeLoaded = loadPlaygroundTheme()
    readonly sidebar = (inject(ActivatedRoute).snapshot.queryParamMap.get('sidebar') ?? 'expanded') as 'expanded' | 'compacted' | 'collapsed'
    readonly parts = inject(ActivatedRoute).snapshot.queryParamMap.has('parts')
    readonly items: NbMenuItem[] = [
        { title: 'Dashboard', icon: 'home-outline', link: '/design-kit/layout' },
        { title: 'Projects', icon: 'folder-outline', link: '/design-kit/layout/projects' },
        { title: 'Messages', icon: 'email-outline', link: '/design-kit/layout/messages' },
        { title: 'Settings', icon: 'settings-2-outline', link: '/design-kit/layout/settings' }
    ]

    constructor() {
        inject(NbThemeService).changeTheme(inject(ActivatedRoute).snapshot.queryParamMap.get('theme') ?? 'default')
    }
}
