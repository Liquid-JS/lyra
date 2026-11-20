import { Component, DestroyRef, OnInit, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import {
    NbMenuService,
    NbMenuItem,
    NbLayoutComponent,
    NbLayoutColumnComponent,
    NbSidebarComponent,
    NbMenuComponent,
    NbCardComponent,
    NbCardBodyComponent,
    NbButtonComponent
} from '@liquid-js/lyr-core'
import { RouterOutlet } from '@angular/router'

@Component({
    selector: 'nb-menu-test',
    templateUrl: './menu-test.component.html',
    imports: [
        NbButtonComponent,
        NbLayoutComponent,
        NbSidebarComponent,
        NbMenuComponent,
        NbLayoutColumnComponent,
        NbCardComponent,
        NbCardBodyComponent,
        RouterOutlet
    ]
})
export class MenuTestComponent implements OnInit {
    private readonly menuService = inject(NbMenuService)
    private readonly destroyRef = inject(DestroyRef)

    sidebarMenuItems: NbMenuItem[] = [
        {
            title: 'Menu Items',
            group: true,
            icon: 'home-outline'
        },
        {
            title: 'Menu #1',
            link: '/menu/menu-test.component/1',
            icon: 'home-outline',
            queryParams: { param: 1 },
            fragment: '#fragment'
        },
        {
            title: 'Menu #2',
            link: '/menu/menu-test.component/2',
            icon: 'home-outline'
        },
        {
            title: 'Menu #3',
            icon: 'home-outline',
            children: [
                {
                    title: 'Menu #3.1',
                    link: '/menu/menu-test.component/3/1'
                },
                {
                    title: 'Menu #3.2',
                    link: '/menu/menu-test.component/3/2'
                },
                {
                    title: 'Menu #3.3',
                    children: [
                        {
                            title: 'Menu #3.3.1',
                            link: '/menu/menu-test.component/3/3/1'
                        },
                        {
                            title: 'Menu #3.3.2',
                            link: '/menu/menu-test.component/3/3/2',
                            queryParams: { param: 2 },
                            fragment: '#fragment',
                            home: true
                        },
                        {
                            title: '@liquid-js/lyr-core',
                            target: '_blank',
                            url: 'https://github.com/Liquid-JS/lyra'
                        }
                    ]
                }
            ]
        }
    ]
    firstMenuItems: NbMenuItem[] = [
        {
            title: 'Menu Items',
            group: true,
            icon: 'home-outline'
        },
        {
            title: 'Menu #1',
            link: '/menu/menu-test.component/1',
            icon: 'home-outline',
            queryParams: { param: 1 },
            fragment: '#fragment'
        },
        {
            title: 'Menu #2',
            link: '/menu/menu-test.component/2',
            icon: 'home-outline'
        }
    ]
    secondMenuItems: NbMenuItem[] = [
        {
            title: 'Menu items with fragments ',
            group: true
        },
        {
            title: 'Menu #1',
            link: '/menu/menu-test.component/1',
            icon: 'home-outline',
            pathMatch: 'prefix'
        },
        {
            title: 'Menu #12 + fragment',
            link: '/menu/menu-test.component/12',
            fragment: 'fragment',
            icon: 'home-outline'
        },
        {
            title: 'Menu #3',
            link: '/menu/menu-test.component/3',
            icon: 'home-outline'
        }
    ]
    thirdMenuItems = [
        {
            title: 'Menu #1'
        },
        {
            title: 'Menu #2',
            children: [
                {
                    title: 'Menu #2.1'
                },
                {
                    title: 'Hidden Submenu Item',
                    hidden: true
                }
            ]
        },
        {
            title: 'Hidden Menu Item',
            hidden: true
        }
    ]

    ngOnInit() {
        this.menuService
            .onItemClick()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data) => console.info(data))

        this.menuService
            .onItemSelect()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data) => console.info(data))

        // this.itemHoverSubscription = this.menuService.onItemHover()
        //   .subscribe((data: { tag: string, item: NbMenuItem }) => console.info(data));

        this.menuService
            .onSubmenuToggle()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data) => console.info(data))

        this.menuService.addItems(
            [
                {
                    title: 'Menu #3',
                    icon: 'home-outline',
                    children: [
                        {
                            title: 'Menu #3.1',
                            link: '/menu/menu-test.component/3/1'
                        },
                        {
                            title: 'Menu #3.2',
                            link: '/menu/menu-test.component/3/2'
                        },
                        {
                            title: 'Menu #3.3',
                            children: [
                                {
                                    title: 'Menu #3.3.1',
                                    link: '/menu/menu-test.component/3/3/1'
                                },
                                {
                                    title: 'Menu #3.3.2',
                                    link: '/menu/menu-test.component/3/3/2',
                                    queryParams: { param: 2 },
                                    fragment: '#fragment',
                                    home: true
                                },
                                {
                                    title: '@liquid-js/lyr-core',
                                    target: '_blank',
                                    url: 'https://github.com/Liquid-JS/lyra'
                                }
                            ]
                        }
                    ]
                }
            ],
            'firstMenu'
        )
    }

    addMenuItem() {
        this.menuService.addItems([{ title: 'New Menu Item' }], 'firstMenu')
    }

    navigateHome() {
        this.menuService.navigateHome('firstMenu')
    }
}
