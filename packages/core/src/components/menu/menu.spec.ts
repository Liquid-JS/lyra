import { assert } from 'vitest'
import { Component, DebugElement, inject as inject_1, viewChild, viewChildren, signal, Service } from '@angular/core'
import { Location } from '@angular/common'
import { Router, Routes, RouterModule } from '@angular/router'
import { By } from '@angular/platform-browser'
import { TestBed } from '@angular/core/testing'
import { SpyLocation } from '@angular/common/testing'
import { filter, pairwise, take } from 'rxjs/operators'
import {
    NbIconComponent,
    NbIconLibraries,
    NbMenuModule,
    NbMenuBag,
    NbMenuItem,
    NbMenuService,
    NbMenuComponent,
    NbThemeModule
} from '@liquid-js/lyr-core'
import {
    getFragmentPartOfUrl,
    isFragmentContain,
    isFragmentEqual,
    isQueryParamsMatch,
    isUrlPathContain,
    isUrlPathEqual,
    getPathPartOfUrl
} from './url-matching-helpers'
import { NbMenuInternalService } from './menu.service'

@Component({
    template: '',
    imports: [NbMenuModule, RouterModule]
})
export class NoopComponent {}

@Component({
    template: '<nb-menu [items]="items()" [tag]="menuTag()" [highlightParents]="highlightParents()" />',
    imports: [NbMenuModule, RouterModule]
})
export class SingleMenuTestComponent {
    menuPublicService = inject_1(NbMenuService)

    readonly items = signal(new Array<NbMenuItem>())
    readonly menuTag = signal<string | undefined>(undefined)
    readonly highlightParents = signal(true)
    readonly menuComponent = viewChild.required(NbMenuComponent)
}

@Component({
    template: `
    <nb-menu [items]="firstMenuItems()" [tag]="firstMenuTag()" />
    <nb-menu [items]="secondMenuItems()" [tag]="secondMenuTag()" />
  `,
    imports: [NbMenuModule, RouterModule]
})
export class DoubleMenusTestComponent {
    menuPublicService = inject_1(NbMenuService)

    readonly firstMenuItems = signal(new Array<NbMenuItem>())
    readonly secondMenuItems = signal(new Array<NbMenuItem>())
    readonly firstMenuTag = signal<string | undefined>(undefined)
    readonly secondMenuTag = signal<string | undefined>(undefined)
    readonly menuComponent = viewChildren(NbMenuComponent)
}

// Overrides SpyLocation path method to take into account `includeHash` parameter.
// Original SpyLocation ignores parameters and always returns path with hash which is different
// from Location.
@Service({ autoProvided: false })
export class SpyLocationPathParameter extends SpyLocation {
    override path(includeHash: boolean = false): string {
        const path = super.path()

        if (includeHash) {
            return path
        }

        return getPathPartOfUrl(path)
    }
}

function createTestBed(routes: Routes = [], animationsEnabled = false) {
    TestBed.configureTestingModule({
        animationsEnabled,
        imports: [
            NbThemeModule.forRoot(),
            NbMenuModule.forRoot(),
            RouterModule.forRoot(routes),
            SingleMenuTestComponent, DoubleMenusTestComponent, NoopComponent
        ],
        providers: [NbMenuService]
    })

    TestBed.overrideProvider(Location, { useValue: new SpyLocationPathParameter() })

    const iconLibs: NbIconLibraries = TestBed.inject(NbIconLibraries)
    iconLibs.registerSvgPack('test', { 'some-icon': '<svg>some-icon</svg>' })
    iconLibs.setDefaultPack('test')
}

function createSingleMenuComponent(menuItems: NbMenuItem[], menuTag = 'menu') {
    createTestBed()
    const fixture = TestBed.createComponent(SingleMenuTestComponent)
    fixture.componentInstance.items.set(menuItems)
    fixture.componentInstance.menuTag.set(menuTag)
    const menuService = fixture.componentInstance.menuPublicService
    fixture.detectChanges()
    return { fixture, menuService }
}

function createDoubleMenuComponent(
    firstMenuItems: NbMenuItem[],
    firstMenuTag: string,
    secondMenuItems: NbMenuItem[],
    secondMenuTag: string
) {
    createTestBed()
    const fixture = TestBed.createComponent(DoubleMenusTestComponent)
    fixture.componentInstance.firstMenuItems.set(firstMenuItems)
    fixture.componentInstance.secondMenuItems.set(secondMenuItems)
    fixture.componentInstance.firstMenuTag.set(firstMenuTag)
    fixture.componentInstance.secondMenuTag.set(secondMenuTag)
    const menuService = fixture.componentInstance.menuPublicService
    fixture.detectChanges()
    return { fixture, menuService }
}

function createMenuItems(items: Array<Partial<NbMenuItem>>, menuInternaleService: NbMenuInternalService): NbMenuItem[] {
    menuInternaleService.prepareItems(items as NbMenuItem[])
    return items as NbMenuItem[]
}

describe('NbMenuItem', () => {
    it('should set tag attribute for menu services', () => {
        const { fixture } = createSingleMenuComponent([{ title: 'Home' }], 'menu')
        const nbMenuTag = fixture.componentInstance.menuComponent().tag()
        expect(nbMenuTag).toEqual('menu')
    })

    it('should set icon to menu item', () => {
        const { fixture } = createSingleMenuComponent([{ title: 'Home', icon: 'some-icon' }])
        const iconWrapper = fixture.nativeElement.querySelector('.menu-icon')
        expect(iconWrapper.textContent).toContain('some-icon')
    })

    it('should set title to menu item', () => {
        const { fixture } = createSingleMenuComponent([{ title: 'Test title' }])
        const titleWrapper = fixture.nativeElement.querySelector('.menu-title')
        expect(titleWrapper.textContent).toEqual('Test title')
    })

    // The title takes its own direction, without changing how it's aligned in the item.
    it('should isolate the direction of the titles', () => {
        const { fixture } = createSingleMenuComponent([
            { title: 'Group', group: true },
            { title: 'Item' },
            { title: 'Parent', children: [{ title: 'Child' }] },
            { title: 'Page', link: '/page', children: [{ title: 'Subpage' }] }
        ])
        const element: HTMLElement = fixture.nativeElement
        const titles = Array.from(element.querySelectorAll('[dir="auto"]'), (title) => title.textContent)
        expect(titles).toEqual(['Group', 'Item', 'Parent', 'Child', 'Page', 'Subpage'])
        expect(element.querySelector('.menu-title')?.hasAttribute('dir')).toBe(false)
        expect(element.querySelector('.menu-group > span')?.hasAttribute('dir')).toBe(false)
    })

    it('should set link target to menu item', () => {
        const { fixture } = createSingleMenuComponent([
            { title: 'Link with _blank target', target: '_blank' },
            { title: 'Link with _self target', target: '_self' },
            { title: 'Link with any not valid target', target: 'anyNotValid' }
        ])
        const menuLinks = fixture.nativeElement.querySelectorAll('a')
        expect(menuLinks[0].getAttribute('target')).toEqual('_blank')
        expect(menuLinks[1].getAttribute('target')).toEqual('_self')
        expect(menuLinks[2].getAttribute('target')).toEqual('anyNotValid')
    })

    it('should have only span, without link on group element', () => {
        const { fixture } = createSingleMenuComponent([{ title: 'Group item', group: true }])
        const menuItem = fixture.nativeElement.querySelector('.menu-item')
        expect(menuItem.querySelector('a')).toBeNull()
        expect(menuItem.querySelector('span')).not.toBeNull()
    })

    it('should not render hidden element', () => {
        const { fixture } = createSingleMenuComponent([
            { title: 'Visible item' },
            { title: 'Hidden item', hidden: true },
            { title: 'Visible item' }
        ])
        const menuList = fixture.nativeElement.querySelectorAll('.menu-item')
        expect(menuList.length).toEqual(2)
    })

    it('should set child menu items', () => {
        const { fixture } = createSingleMenuComponent([
            {
                title: 'Parent item',
                expanded: true,
                children: [{ title: 'Child item' }]
            }
        ])
        const parentItem = fixture.nativeElement.querySelector('.menu-item')
        expect(parentItem.querySelector('ul.menu-items')).not.toBeNull()
    })

    it('should always show the children of an item that is not collapsible, without a toggle', () => {
        const { fixture, menuService } = createSingleMenuComponent([
            { title: 'Guide', link: '/guide', collapsible: false, children: [{ title: 'Install', link: '/guide', fragment: 'install' }] }
        ])
        const item = fixture.nativeElement.querySelector('.menu-item') as HTMLElement
        const childList = () => item.querySelector(':scope > ul.menu-items') as HTMLElement

        expect(item.querySelector(':scope > a')?.getAttribute('href')).toBe('/guide')
        expect(item.querySelector('.menu-toggle, :scope > a > .expand-state')).toBeNull()
        expect(childList().classList).toContain('expanded')
        expect(childList().hasAttribute('inert')).toBe(false)

        menuService.collapseAll('menu')
        fixture.detectChanges()
        expect(childList().classList).toContain('expanded')
    })

    it('should open a submenu that appears under a shown item, and close one that goes, but not one that renders with it', async () => {
        createTestBed([], true)
        const fixture = TestBed.createComponent(SingleMenuTestComponent)
        const guide = { title: 'Guide', link: '/guide', collapsible: false } as NbMenuItem
        const usage = {
            title: 'Usage', link: '/usage', collapsible: false, children: [{ title: 'Options', link: '/usage', fragment: 'options' }]
        } as NbMenuItem
        fixture.componentInstance.items.set([guide, usage])
        fixture.detectChanges()
        const submenu = (title: string) => (Array.from(fixture.nativeElement.querySelectorAll('nb-menu > ul > .menu-item')) as HTMLElement[])
            .find((item) => item.querySelector(':scope > a')?.textContent?.includes(title))
            ?.querySelector<HTMLElement>(':scope > ul.menu-items')
        expect(submenu('Usage')?.getAnimations()).toEqual([])

        // The current page moves from Usage to Guide: Guide's sections open, and Usage's close before they go.
        guide.children = [{ title: 'Install', link: '/guide', fragment: 'install' } as NbMenuItem]
        delete usage.children
        fixture.componentInstance.items.set([guide, usage])
        fixture.detectChanges()

        expect(submenu('Guide')?.getAnimations()).toHaveLength(1)
        const leaving = submenu('Usage')
        expect(leaving?.getAnimations()).toHaveLength(1)

        await leaving?.getAnimations()[0].finished
        await new Promise((resolve) => setTimeout(resolve))
        fixture.detectChanges()
        expect(submenu('Usage')).toBeFalsy()
    })

    it('should show the parents of the selected item as selected, or with highlightParents off only while they hide it', () => {
        createTestBed()
        const fixture = TestBed.createComponent(SingleMenuTestComponent)
        fixture.componentInstance.items.set([
            { title: 'Section', expanded: true, selected: true, children: [{ title: 'Page', selected: true }] } as NbMenuItem
        ])
        fixture.componentInstance.highlightParents.set(false)
        fixture.detectChanges()
        const section = () => fixture.nativeElement.querySelector('.menu-item > a') as HTMLElement
        const page = () => fixture.nativeElement.querySelector('.menu-item .menu-item > a') as HTMLElement
        expect([section().classList.contains('active'), page().classList.contains('active')]).toEqual([false, true])

        section().click()
        fixture.detectChanges()
        expect(section().classList.contains('active')).toBe(true)

        fixture.componentInstance.highlightParents.set(true)
        section().click()
        fixture.detectChanges()
        expect([section().classList.contains('active'), page().classList.contains('active')]).toEqual([true, true])
    })

    it('should render a parent whose children are all hidden as a plain item', () => {
        const { fixture } = createSingleMenuComponent([{ title: 'Parent item', children: [{ title: 'Child', hidden: true }] }])
        const parentItem = fixture.nativeElement.querySelector('.menu-item')
        expect(parentItem.querySelector('ul.menu-items')).toBeNull()
        expect(parentItem.querySelector('.expand-state')).toBeNull()
    })

    it('should report clicks on external links but not select links that open elsewhere', () => {
        const { fixture, menuService } = createSingleMenuComponent([
            { title: 'Docs', url: 'https://example.com', target: '_blank' }
        ])
        const clicks = new Array<string>()
        menuService.onItemClick().subscribe((bag) => clicks.push(bag.item.title))
        const link: HTMLAnchorElement = fixture.nativeElement.querySelector('.menu-item a')
        link.addEventListener('click', (event) => event.preventDefault())

        link.click()
        fixture.detectChanges()

        expect(clicks).toEqual(['Docs'])
        expect(link.classList.contains('active')).toBe(false)
    })

    it('should choose an item without a link with Enter or Space, as a button', () => {
        const { fixture, menuService } = createSingleMenuComponent([{ title: 'Log out' }])
        const clicks = new Array<string>()
        menuService.onItemClick().subscribe((bag) => clicks.push(bag.item.title))
        const item: HTMLAnchorElement = fixture.nativeElement.querySelector('.menu-item a')
        expect(item.getAttribute('role')).toBe('button')

        const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
        item.dispatchEvent(enter)
        const space = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })
        item.dispatchEvent(space)
        fixture.detectChanges()

        expect(clicks).toEqual(['Log out', 'Log out'])
        expect(space.defaultPrevented).toBe(true)
    })

    it('should expand child menu items', () => {
        const { fixture } = createSingleMenuComponent([
            { title: 'Parent item', expanded: true, children: [{ title: 'Child item' }] }
        ])
        const childList = fixture.nativeElement.querySelector('.menu-item > ul.menu-items')
        expect(childList.classList).toContain('expanded')
    })

    it('should make a parent without a page a button that opens its items, not a link', () => {
        const { fixture } = createSingleMenuComponent([{ title: 'Parent item', children: [{ title: 'Child item' }] }])
        const toggle = fixture.nativeElement.querySelector('.menu-item > a') as HTMLAnchorElement
        const childList = () => fixture.nativeElement.querySelector('.menu-item > ul.menu-items') as HTMLElement

        expect(toggle.hasAttribute('href')).toBe(false)
        expect(toggle.getAttribute('role')).toBe('button')
        expect(toggle.getAttribute('tabindex')).toBe('0')
        expect(toggle.querySelector('.expand-state')).toBeTruthy()

        toggle.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
        fixture.detectChanges()
        expect(childList().classList).toContain('expanded')
        expect(toggle.getAttribute('aria-expanded')).toBe('true')

        const space = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })
        toggle.dispatchEvent(space)
        fixture.detectChanges()
        expect(space.defaultPrevented).toBe(true)
        expect(childList().classList).not.toContain('expanded')
    })

    it('should prevent keyboard focus inside collapsed submenus', () => {
        const { fixture } = createSingleMenuComponent([
            {
                title: 'Parent item',
                children: [
                    {
                        title: 'Expanded child',
                        expanded: true,
                        children: [{ title: 'Nested link', url: '/nested' }]
                    }
                ]
            }
        ])
        const childList = fixture.nativeElement.querySelector('.menu-item > ul.menu-items')
        const nestedLink = childList.querySelector('a[href="/nested"]') as HTMLAnchorElement

        expect(childList.hasAttribute('inert')).toBe(true)
        nestedLink.focus()
        expect(document.activeElement).not.toBe(nestedLink)
    })

    it('should allow keyboard focus inside expanded submenus', () => {
        const { fixture } = createSingleMenuComponent([
            { title: 'Parent item', expanded: true, children: [{ title: 'Child item', url: '/child' }] }
        ])
        const childList = fixture.nativeElement.querySelector('.menu-item > ul.menu-items')
        const childLink = childList.querySelector('a[href="/child"]') as HTMLAnchorElement

        expect(childList.hasAttribute('inert')).toBe(false)
        childLink.focus()
        expect(document.activeElement).toBe(childLink)
    })

    it('should set URL', () => {
        const { fixture } = createSingleMenuComponent([{ title: 'Menu Item with link', url: 'https://test.link' }])
        const menuItem = fixture.nativeElement.querySelector('.menu-item')
        expect(menuItem.querySelector('a').getAttribute('href')).toEqual('https://test.link')
    })

    it('should say a selected link is the current page', () => {
        const { fixture } = createSingleMenuComponent([
            { title: 'Home', url: '/home' },
            { title: 'Orders', url: '/orders', selected: true }
        ])
        const links = Array.from(fixture.nativeElement.querySelectorAll('a')) as HTMLAnchorElement[]
        expect(links.map((link) => link.getAttribute('aria-current'))).toEqual([null, 'page'])
    })

    it('should set selected item', () => {
        const selectedItem = { title: 'Menu item selected', selected: true }
        const { fixture } = createSingleMenuComponent([{ title: 'Menu item not selected' }, selectedItem])
        const activeItem = fixture.nativeElement.querySelector('a.active')
        expect(activeItem.querySelector('span').textContent).toEqual(selectedItem.title)
    })

    it('should turn the arrow towards the end of the item, following the document direction', () => {
        const menuItems = [{ title: '', children: [{ title: '' }] }]
        const { fixture } = createSingleMenuComponent(menuItems)
        const iconComponent = fixture.debugElement.query(By.directive(NbIconComponent)) as DebugElement
        const icon = iconComponent.nativeElement as HTMLElement

        expect(iconComponent.componentInstance.icon()).toEqual('chevron-down-outline')
        // A quarter turn clockwise points the chevron left, the end of an item read left to right.
        expect(getComputedStyle(icon).transform).toEqual('matrix(0, 1, -1, 0, 0, 0)')

        // The turn is a transition, which a computed style would catch at its start.
        icon.style.transition = 'none'
        fixture.nativeElement.setAttribute('dir', 'rtl')

        expect(getComputedStyle(icon).transform).toEqual('matrix(0, -1, 1, 0, 0, 0)')
    })
})

describe('menu services', () => {
    it('should operate with menu by tag', () => {
        const { fixture, menuService } = createDoubleMenuComponent(
            [{ title: 'Home' }],
            'menuFirst',
            [{ title: 'Home' }],
            'menuSecond'
        )
        const itemToAdd = { title: 'Added item' }
        const initialFirstMenuItemsCount = fixture.nativeElement
            .querySelector('nb-menu:first-child')
            .querySelectorAll('.menu-item').length
        const initialSecondMenuItemsCount = fixture.nativeElement
            .querySelector('nb-menu:last-child')
            .querySelectorAll('.menu-item').length
        menuService.addItems([itemToAdd], 'menuFirst')
        fixture.detectChanges()
        const afterAddFirstMenuItemsCount = fixture.nativeElement
            .querySelector('nb-menu:first-child')
            .querySelectorAll('.menu-item').length
        const afterAddSecondMenuItemsCount = fixture.nativeElement
            .querySelector('nb-menu:last-child')
            .querySelectorAll('.menu-item').length
        expect(afterAddFirstMenuItemsCount).toEqual(initialFirstMenuItemsCount + 1)
        expect(afterAddSecondMenuItemsCount).toEqual(initialSecondMenuItemsCount)
    })

    it('should add new items to DOM', () => {
        const { fixture, menuService } = createSingleMenuComponent([{ title: 'Existing item' }])
        const itemToAdd = { title: 'Added item' }
        const menuListOnInit = fixture.nativeElement.querySelectorAll('li').length
        menuService.addItems([itemToAdd], 'menu')
        fixture.detectChanges()
        const menuListItemAdded = fixture.nativeElement.querySelectorAll('li').length
        expect(menuListItemAdded).toEqual(menuListOnInit + 1)
    })

    it('should get selected menu item', () => new Promise<void>((done) => {
        const selectedItem = { title: 'Menu item selected', selected: true }
        const { menuService } = createSingleMenuComponent([{ title: 'Menu item not selected' }, selectedItem])
        menuService
            .getSelectedItem('menu')
            .pipe(take(1))
            .subscribe((menuBag) => {
                expect(menuBag?.item?.title).toEqual(selectedItem.title)
                done()
            })
    }), 1000)

    it('should hide all expanded menu items', () => new Promise<void>((done) => {
        const { fixture, menuService } = createSingleMenuComponent([
            {
                title: 'Menu item collapsed',
                children: [{ title: 'Menu item inner' }]
            },
            {
                title: 'Menu item expanded 1',
                expanded: true,
                children: [{ title: 'Menu item inner' }]
            },
            {
                title: 'Menu item expanded 2',
                expanded: true,
                children: [{ title: 'Menu item inner' }]
            }
        ])
        menuService
            .onSubmenuToggle()
            .pipe(
                // The service replays the last toggle, which can be a menu's in another spec.
                filter(({ item }) => item.title.startsWith('Menu item expanded')),
                pairwise(),
                take(1)
            )
            .subscribe(([menuBagFirstCollapsed, menuBagSecondCollapsed]: NbMenuBag[]) => {
                expect(menuBagFirstCollapsed.item.title).toEqual('Menu item expanded 1')
                expect(menuBagSecondCollapsed.item.title).toEqual('Menu item expanded 2')
                done()
            })
        menuService.collapseAll()
        fixture.detectChanges()
    }), 1000)

    it('should not replay commands to a menu created later', () => {
        const { fixture, menuService } = createSingleMenuComponent([{ title: 'Home', link: '/home', home: true }], 'replayed')
        menuService.addItems([{ title: 'Added item' }], 'replayed')
        const navigateHome = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true)
        menuService.navigateHome('replayed')
        expect(navigateHome).toHaveBeenCalledTimes(1)
        fixture.destroy()
        navigateHome.mockClear()

        const recreated = TestBed.createComponent(SingleMenuTestComponent)
        recreated.componentInstance.items.set([{ title: 'Home', link: '/home', home: true }])
        recreated.componentInstance.menuTag.set('replayed')
        recreated.detectChanges()

        expect(recreated.nativeElement.querySelectorAll('li').length).toEqual(1)
        expect(navigateHome).not.toHaveBeenCalled()
    })

    it('should deliver a command sent before the menu is created once', () => {
        createTestBed()
        TestBed.inject(NbMenuService).addItems([{ title: 'Added item' }], 'pending')

        const createMenu = () => {
            const fixture = TestBed.createComponent(SingleMenuTestComponent)
            fixture.componentInstance.items.set([{ title: 'Existing item' }])
            fixture.componentInstance.menuTag.set('pending')
            fixture.detectChanges()
            return fixture.nativeElement.querySelectorAll('li').length
        }

        expect(createMenu()).toEqual(2)
        expect(createMenu()).toEqual(1)
    })
})

describe('NbMenuInternalService', () => {
    let router: Router
    let menuInternalService: NbMenuInternalService

    beforeEach(() => {
        const routes = [
            { path: 'menu-1', component: NoopComponent },
            { path: 'menu-1/2', component: NoopComponent },
            {
                path: 'menu-2',
                component: NoopComponent,
                children: [{ path: 'menu-2-level-2', component: NoopComponent }]
            }
        ]
        createTestBed(routes)
        router = TestBed.inject(Router)
        menuInternalService = TestBed.inject(NbMenuInternalService)
    })

    it('should collapse siblings below an expanded ancestor', () => {
        const itemA: NbMenuItem = { title: 'A', expanded: true, children: [{ title: 'A1' }] }
        const itemB: NbMenuItem = { title: 'B', children: [{ title: 'B1' }] }
        const items: NbMenuItem[] = [{ title: 'Parent', expanded: true, children: [itemA, itemB] }]
        menuInternalService.prepareItems(items)

        menuInternalService.collapseAll(items, undefined, itemB)

        expect(items[0].expanded).toBe(true)
        expect(itemA.expanded).toBe(false)
    })

    it('should give a parent with its own page a link and a separate toggle for its submenu', async () => {
        const fixture = TestBed.createComponent(SingleMenuTestComponent)
        const parent: NbMenuItem = { title: 'Orders', link: '/menu-2', children: [{ title: 'Returns', link: '/menu-2/menu-2-level-2' }] }
        fixture.componentInstance.items.set([parent])
        fixture.detectChanges()
        await fixture.whenStable()

        const row: HTMLElement = fixture.nativeElement.querySelector('.menu-item-row')
        const link = row.querySelector('a') as HTMLAnchorElement
        const toggle = row.querySelector('button.menu-toggle') as HTMLButtonElement
        expect(link.getAttribute('href')).toBe('/menu-2')
        expect(toggle.getAttribute('aria-label')).toBe('Orders submenu')
        expect(toggle.getAttribute('aria-expanded')).toBe('false')
        // Safari leaves a button without a tabindex out of the Tab order.
        expect(toggle.getAttribute('tabindex')).toBe('0')

        // The toggle only opens and closes the submenu.
        toggle.click()
        fixture.detectChanges()
        await fixture.whenStable()
        expect(parent.expanded).toBe(true)
        expect(router.url).toBe('/')
        toggle.click()
        fixture.detectChanges()
        expect(parent.expanded).toBe(false)

        // The link goes to the parent's page and opens its submenu.
        link.click()
        await fixture.whenStable()
        fixture.detectChanges()
        expect(router.url).toBe('/menu-2')
        expect(parent.expanded).toBe(true)
        expect(link.classList).toContain('active')
    })

    it('should select from the URL again on a navigation to the URL already shown', async () => {
        await router.navigate(['menu-1'])
        const fixture = TestBed.createComponent(SingleMenuTestComponent)
        const items: NbMenuItem[] = [
            { title: 'Menu 1', link: '/menu-1' },
            { title: 'Help', url: '#help' }
        ]
        fixture.componentInstance.items.set(items)
        fixture.detectChanges()
        // The menu selects from the URL once it's rendered.
        await new Promise((resolve) => setTimeout(resolve))
        fixture.detectChanges()
        expect(items[0].selected).toBe(true);

        // A click on an item that opens a page in place selects it.
        (fixture.nativeElement.querySelectorAll('.menu-item a')[1] as HTMLElement).click()
        fixture.detectChanges()
        expect(items[1].selected).toBe(true)
        expect(items[0].selected).toBe(false)

        // The router skips it, as the URL doesn't change, and the menu follows the URL again.
        await router.navigate(['menu-1'])
        fixture.detectChanges()
        expect(items[0].selected).toBe(true)
        expect(items[1].selected).toBe(false)
    })

    it('should select from the URL when the items array is replaced', async () => {
        await router.navigate(['menu-1'])
        const fixture = TestBed.createComponent(SingleMenuTestComponent)
        fixture.componentInstance.items.set([{ title: 'Other', link: '/other' }])
        fixture.detectChanges()

        fixture.componentInstance.items.set([{ title: 'Menu 1', link: '/menu-1' }])
        fixture.detectChanges()

        expect(fixture.nativeElement.querySelector('.menu-item a').classList.contains('active')).toBe(true)
    })

    it('should clear the selection on navigation to a URL no item matches', async () => {
        await router.navigate(['menu-1'])
        const fixture = TestBed.createComponent(SingleMenuTestComponent)
        fixture.componentInstance.items.set([
            { title: 'Menu 1', link: '/menu-1' },
            { title: 'Menu 2', link: '/menu-2' }
        ])
        fixture.detectChanges()
        await new Promise((resolve) => setTimeout(resolve))
        fixture.detectChanges()
        expect(fixture.componentInstance.items()[0].selected).toBe(true)

        await router.navigate(['menu-1/2'])
        fixture.detectChanges()

        expect(fixture.componentInstance.items().map((item) => !!item.selected)).toEqual([false, false])
        expect(fixture.nativeElement.querySelector('.menu-item a.active')).toBeNull()
    })

    it('should render the current page\'s submenu open, without animating it open', async () => {
        await router.navigate(['menu-2/menu-2-level-2'])
        const fixture = TestBed.createComponent(SingleMenuTestComponent)
        fixture.componentInstance.items.set([
            { title: 'Menu 1', link: '/menu-1' },
            { title: 'Menu 2', children: [{ title: 'Menu 2.1', link: '/menu-2/menu-2-level-2' }] }
        ])
        // The first render, as when a page with the menu opens.
        fixture.detectChanges()
        const submenu = fixture.nativeElement.querySelector('.menu-item .menu-items') as HTMLElement
        expect(submenu.classList).toContain('expanded')

        await new Promise((resolve) => setTimeout(resolve))
        fixture.detectChanges()
        expect(submenu.classList).toContain('expanded')
        expect(submenu.getAnimations()).toEqual([])
    })

    it('should keep the selection when no item matches unless asked to reset it', async () => {
        const menuItems = createMenuItems([{ link: '/menu-1' }, { link: '/menu-2' }], menuInternalService)
        await router.navigate(['menu-1'])
        menuInternalService.selectFromUrl(menuItems, '')

        await router.navigate(['menu-1/2'])
        menuInternalService.selectFromUrl(menuItems, '')
        expect(menuItems[0].selected).toBe(true)

        menuInternalService.selectFromUrl(menuItems, '', false, true)
        expect(menuItems.map((item) => !!item.selected)).toEqual([false, false])
    })

    describe('selectFromUrl pathMatch full', () => {
        it('should select menu item with matching path', async () => {
            const items: Array<Partial<NbMenuItem>> = [{ link: '/menu-1' }]
            const menuItems: NbMenuItem[] = createMenuItems(items, menuInternalService)
            const menuItem: NbMenuItem = menuItems[0]

            expect(menuItem.selected).toBeFalsy()

            await router.navigate([menuItem.link])
            menuInternalService.selectFromUrl(menuItems, '')
            expect(menuItem.selected).toEqual(true)
        })

        it('should select menu item with matching path and fragment', async () => {
            const items: Array<Partial<NbMenuItem>> = [{ link: '/menu-1', fragment: '1' }]
            const menuItems: NbMenuItem[] = createMenuItems(items, menuInternalService)
            const menuItem: NbMenuItem = menuItems[0]

            expect(menuItem.selected).toBeFalsy()

            await router.navigate([menuItem.link], { fragment: menuItem.fragment })
            menuInternalService.selectFromUrl(menuItems, '')
            expect(menuItem.selected).toEqual(true)
        })

        it('should select the menu item with matching query params', async () => {
            const items: Array<Partial<NbMenuItem>> = [
                { link: '/menu-1', queryParams: { tab: 'a' } },
                { link: '/menu-1', queryParams: { tab: 'b' } }
            ]
            const menuItems: NbMenuItem[] = createMenuItems(items, menuInternalService)

            await router.navigate(['/menu-1'], { queryParams: { tab: 'b' } })
            menuInternalService.selectFromUrl(menuItems, '')

            expect(menuItems.map((item) => !!item.selected)).toEqual([false, true])
        })

        it('should select child menu item and its parent', async () => {
            const items: Array<Partial<NbMenuItem>> = [
                {
                    link: '/menu-2',
                    children: [{ link: '/menu-2/menu-2-level-2' }] as NbMenuItem[]
                }
            ]
            const menuItems: NbMenuItem[] = createMenuItems(items, menuInternalService)
            const parentMenuItem: NbMenuItem = menuItems[0]
            const childMenuItem = parentMenuItem.children?.[0]
            assert(childMenuItem)

            expect(parentMenuItem.selected).toBeFalsy()
            expect(childMenuItem.selected).toBeFalsy()

            await router.navigate([childMenuItem.link])
            menuInternalService.selectFromUrl(menuItems, '')
            expect(parentMenuItem.selected).toEqual(true)
            expect(childMenuItem.selected).toEqual(true)
        })

        it('should select child menu item with fragment', async () => {
            const items: Array<Partial<NbMenuItem>> = [
                {
                    link: '/menu-2',
                    children: [{ link: '/menu-2/menu-2-level-2', fragment: '22' }] as NbMenuItem[]
                }
            ]
            const menuItems: NbMenuItem[] = createMenuItems(items, menuInternalService)
            const parentMenuItem: NbMenuItem = menuItems[0]
            const childMenuItem = parentMenuItem.children?.[0]
            assert(childMenuItem)

            expect(parentMenuItem.selected).toBeFalsy()
            expect(childMenuItem.selected).toBeFalsy()

            await router.navigate([childMenuItem.link], { fragment: childMenuItem.fragment })
            menuInternalService.selectFromUrl(menuItems, '')
            expect(parentMenuItem.selected).toEqual(true)
            expect(childMenuItem.selected).toEqual(true)
        })

        it("should not select menu item with matching path if fragment doesn't match", async () => {
            const items: Array<Partial<NbMenuItem>> = [{ link: '/menu-1', fragment: '1' }]
            const menuItems: NbMenuItem[] = createMenuItems(items, menuInternalService)
            const menuItem: NbMenuItem = menuItems[0]

            expect(menuItem.selected).toBeFalsy()

            await router.navigate([menuItem.link], { fragment: menuItem.fragment + 'random-fragment' })
            menuInternalService.selectFromUrl(menuItems, '')
            expect(menuItem.selected).toBeFalsy()
        })

        it("should not select menu item with matching fragment if path doesn't match", async () => {
            const items: Array<Partial<NbMenuItem>> = [{ link: '/menu-1', fragment: '1' }]
            const menuItems: NbMenuItem[] = createMenuItems(items, menuInternalService)
            const menuItem: NbMenuItem = menuItems[0]

            expect(menuItem.selected).toBeFalsy()

            const url = menuItem.link + '/2'
            await router.navigate([url], { fragment: menuItem.fragment })
            menuInternalService.selectFromUrl(menuItems, '')
            expect(menuItem.selected).toBeFalsy()
        })

        it('should not select menu item with fragment if no fragment in url', async () => {
            const items: Array<Partial<NbMenuItem>> = [{ link: '/menu-1', fragment: '1' }]
            const menuItems: NbMenuItem[] = createMenuItems(items, menuInternalService)
            const menuItem: NbMenuItem = menuItems[0]

            expect(menuItem.selected).toBeFalsy()

            await router.navigate([menuItem.link])
            menuInternalService.selectFromUrl(menuItems, '')
            expect(menuItem.selected).toBeFalsy()
        })

        it('should not select menu item if path not matches fully', async () => {
            const items: Array<Partial<NbMenuItem>> = [{ link: '/menu-1', fragment: '1' }]
            const menuItems: NbMenuItem[] = createMenuItems(items, menuInternalService)
            const menuItem: NbMenuItem = menuItems[0]

            expect(menuItem.selected).toBeFalsy()

            const url = menuItem.link + '/2'
            await router.navigate([url], { fragment: menuItem.fragment })
            menuInternalService.selectFromUrl(menuItems, '')
            expect(menuItem.selected).toBeFalsy()
        })

        it('should not select menu item if path and fragment not matches fully', async () => {
            const items: Array<Partial<NbMenuItem>> = [{ link: '/menu-1', fragment: '1' }]
            const menuItems: NbMenuItem[] = createMenuItems(items, menuInternalService)
            const menuItem: NbMenuItem = menuItems[0]

            expect(menuItem.selected).toBeFalsy()

            await router.navigate([menuItem.link], { fragment: menuItem.fragment + '1' })
            menuInternalService.selectFromUrl(menuItems, '')
            expect(menuItem.selected).toBeFalsy()
        })
    })

    describe('selectFromUrl pathMatch prefix', () => {
        it('should select menu item if url contains menu link', async () => {
            const items: Array<Partial<NbMenuItem>> = [{ link: '/menu-1', pathMatch: 'prefix' }]
            const menuItems: NbMenuItem[] = createMenuItems(items, menuInternalService)
            const menuItem: NbMenuItem = menuItems[0]

            expect(menuItem.selected).toBeFalsy()

            const url = menuItem.link + '/2'
            await router.navigate([url])
            menuInternalService.selectFromUrl(menuItems, '')
            expect(menuItem.selected).toEqual(true)
        })

        it('should select menu item if url contains menu link and fragment', async () => {
            const items: Array<Partial<NbMenuItem>> = [{ link: '/menu-1', fragment: '1', pathMatch: 'prefix' }]
            const menuItems: NbMenuItem[] = createMenuItems(items, menuInternalService)
            const menuItem: NbMenuItem = menuItems[0]

            expect(menuItem.selected).toBeFalsy()

            await router.navigate([menuItem.link], { fragment: menuItem.fragment + '1' })
            menuInternalService.selectFromUrl(menuItems, '')
            expect(menuItem.selected).toEqual(true)
        })

        it('should not select menu item if url contains link without fragment', async () => {
            const items: Array<Partial<NbMenuItem>> = [{ link: '/menu-1', fragment: '1', pathMatch: 'prefix' }]
            const menuItems: NbMenuItem[] = createMenuItems(items, menuInternalService)
            const menuItem: NbMenuItem = menuItems[0]

            expect(menuItem.selected).toBeFalsy()

            await router.navigate([menuItem.link])
            menuInternalService.selectFromUrl(menuItems, '')
            expect(menuItem.selected).toBeFalsy()
        })

        it('should not select menu item if url contains fragment without link', async () => {
            const items: Array<Partial<NbMenuItem>> = [{ link: '/menu-1', fragment: '1', pathMatch: 'prefix' }]
            const menuItems: NbMenuItem[] = createMenuItems(items, menuInternalService)
            const menuItem: NbMenuItem = menuItems[0]

            expect(menuItem.selected).toBeFalsy()

            await router.navigate(['menu-2'], { fragment: menuItem.fragment })
            menuInternalService.selectFromUrl(menuItems, '')
            expect(menuItem.selected).toBeFalsy()
        })
    })
})

describe('menu URL helpers', () => {
    it('isUrlPathEqual should ignore trailing slashes, so the root matches "/"', () => {
        expect(isUrlPathEqual('', '/')).toBeTruthy()
        expect(isUrlPathEqual('/a/', '/a')).toBeTruthy()
        expect(isUrlPathEqual('/a', '/b')).toBeFalsy()
    })

    it('isUrlPathContain should work by url segments', () => {
        expect(isUrlPathContain('/a/ba', '/a/b')).toBeFalsy()
        expect(isUrlPathContain('/a/b/c', '/a/b')).toBeTruthy()
    })

    it('isUrlPathContain should work for url with fragments', () => {
        expect(isUrlPathContain('/a/b#fragment', '/a/b')).toBeTruthy()
    })

    it('isUrlPathContain should work for url with query strings', () => {
        expect(isUrlPathContain('/a/b?a=1;b=2&c=3', '/a/b')).toBeTruthy()
    })

    it('isUrlPathEqual should work for identical paths', () => {
        expect(isUrlPathEqual('/a/b/c', '/a/b')).toBeFalsy()
        expect(isUrlPathEqual('/a/b/c', '/a/b/c')).toBeTruthy()
    })

    it('isUrlPathEqual should work for url with fragments', () => {
        expect(isUrlPathEqual('/a/b/c#fragment', '/a/b/c')).toBeTruthy()
    })

    it('isQueryParamsMatch should compare the item query params', () => {
        expect(isQueryParamsMatch('/a?tab=1&x=2#f', { tab: 1 })).toBeTruthy()
        expect(isQueryParamsMatch('/a?tab=1&x=2', { tab: 1 }, true)).toBeFalsy()
        expect(isQueryParamsMatch('/a?tab=1', { tab: 1 }, true)).toBeTruthy()
        expect(isQueryParamsMatch('/a?tab=2', { tab: 1 })).toBeFalsy()
        expect(isQueryParamsMatch('/a?id=1&id=2', { id: [1, 2] })).toBeTruthy()
        expect(isQueryParamsMatch('/a', { tab: null })).toBeTruthy()
    })

    it('isUrlPathEqual should work for url with query strings', () => {
        expect(isUrlPathEqual('/a/b/c?a=1;b=2&c=3', '/a/b/c')).toBeTruthy()
    })

    it('getFragmentPartOfUrl should return empty string for path without fragment', () => {
        expect(getFragmentPartOfUrl('/a/b')).toBeFalsy()
        expect(getFragmentPartOfUrl('/a/b/c?a=1;b=2&c=3')).toBeFalsy()
    })

    it('getFragmentPartOfUrl should return fragment part when it presented', () => {
        expect(getFragmentPartOfUrl('/a/b#f')).toEqual('f')
        expect(getFragmentPartOfUrl('/a/b/c?a=1;b=2&c=3#fragment')).toEqual('fragment')
    })

    it('isFragmentEqual should return false for path without fragments', () => {
        expect(isFragmentEqual('/a/b', 'fragment')).toBeFalsy()
        expect(isFragmentEqual('/a/b/c?a=1;b=2&c=3', 'fragment')).toBeFalsy()
    })

    it('isFragmentEqual should return false for path with different fragments', () => {
        expect(isFragmentEqual('/a/b#f', 'fragment')).toBeFalsy()
        expect(isFragmentEqual('/a/b/c?a=1;b=2&c=3#f', 'fragment')).toBeFalsy()
    })

    it('isFragmentEqual should return true for path with same fragments', () => {
        expect(isFragmentEqual('/a/b#fragment', 'fragment')).toBeTruthy()
        expect(isFragmentEqual('/a/b/c?a=1;b=2&c=3#fragment', 'fragment')).toBeTruthy()
    })

    it('isFragmentContain should return true for url with exact fragment', () => {
        expect(isFragmentContain('/a/b#1', '1')).toBeTruthy()
        expect(isFragmentContain('/#2', '2')).toBeTruthy()
    })

    it('isFragmentContain should return true for url containing fragments', () => {
        expect(isFragmentContain('/a/b#12', '1')).toBeTruthy()
        expect(isFragmentContain('/a/b?a=1;b=2&c=3#21', '1')).toBeTruthy()
    })

    it('isFragmentContain should return false for url without fragment', () => {
        expect(isFragmentContain('/a1/b', '1')).toBeFalsy()
        expect(isFragmentContain('/a1/b?a=1;b=2&c=3', '1')).toBeFalsy()
    })

    it('isFragmentContain should return false for url with different fragment', () => {
        expect(isFragmentContain('/a1/b#222', '1')).toBeFalsy()
        expect(isFragmentContain('/a1/b?a=1;b=2&c=3#222', '1')).toBeFalsy()
    })
})
