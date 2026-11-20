import { Component, DebugElement, inject as inject_1, Service, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { Observable, Subject } from 'rxjs'
import { pairwise, startWith } from 'rxjs/operators'
import {
    NbSidebarComponent,
    NbMenuModule,
    NbMenuItem,
    NbSidebarModule,
    NbMenuComponent,
    NbThemeModule,
    NbMenuItemComponent,
    NbIconComponent,
    NbSidebarService,
    NbSidebarState,
    NbMediaBreakpoint,
    NbThemeService,
    NbMediaBreakpointsService,
    NbSidebarResponsiveState
} from '@liquid-js/lyr-core'
import { Router, RouterModule } from '@angular/router'

@Component({
    template: `
    <nb-sidebar [responsive]="responsive()" [state]="state()">
      <button aria-label="Test" id="button-outside-menu"></button>
      <nb-menu [items]="menuItems" />
    </nb-sidebar>
  `,
    imports: [RouterModule, NbSidebarModule, NbMenuModule]
})
export class SidebarExpandTestComponent {
    menuItems: NbMenuItem[] = [
        {
            title: 'no children'
        },
        {
            title: 'parent',
            children: [{ title: 'child' }]
        },
        {
            title: 'group',
            group: true
        }
    ]

    readonly responsive = signal(false)
    readonly state = signal<NbSidebarState>('expanded')
}

@Service({ autoProvided: false })
export class MockThemeService {
    private breakpointsService = inject_1(NbMediaBreakpointsService)

    private breakpoint$ = new Subject<NbMediaBreakpoint>()

    setBreakpointTo(breakpointName: string) {
        this.breakpoint$.next(this.breakpointsService.getByName(breakpointName))
    }

    onMediaQueryChange(): Observable<NbMediaBreakpoint[]> {
        const breakpoints = this.breakpointsService.getBreakpoints()
        const largestBreakpoint = breakpoints[breakpoints.length - 1]

        return this.breakpoint$.pipe(startWith(this.breakpointsService.getByName('unknown'), largestBreakpoint), pairwise())
    }
}

describe('NbSidebarComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot([]),
                NbThemeModule.forRoot(),
                NbSidebarModule.forRoot(),
                NbMenuModule.forRoot(),
                SidebarExpandTestComponent
            ],
            providers: [MockThemeService, { provide: NbThemeService, useExisting: MockThemeService }]
        })
    })

    describe('States (expanded, collapsed, compacted)', () => {
        let fixture: ComponentFixture<SidebarExpandTestComponent>
        let sidebarComponent: NbSidebarComponent
        let themeService: MockThemeService

        beforeEach(() => {
            fixture = TestBed.createComponent(SidebarExpandTestComponent)
            fixture.detectChanges()

            sidebarComponent = fixture.debugElement.query(By.directive(NbSidebarComponent)).componentInstance
            themeService = TestBed.inject(MockThemeService)
        })

        it('should collapse when collapse method called', () => {
            sidebarComponent.collapse()
            fixture.detectChanges()

            expect(sidebarComponent.expanded()).toEqual(false)
        })

        it('should become compacted when compact method called', () => {
            sidebarComponent.compact()
            fixture.detectChanges()

            expect(sidebarComponent.compacted()).toEqual(true)
        })

        it('should not expand when clicked outside menu', () => {
            const buttonOutsideMenu: DebugElement = fixture.debugElement.query(By.css('#button-outside-menu'))
            sidebarComponent.compact()
            fixture.detectChanges()

            buttonOutsideMenu.nativeElement.click()
            fixture.detectChanges()

            expect(sidebarComponent.compacted()).toEqual(true)
        })

        it('should not expand when clicked on menu item without children', () => {
            sidebarComponent.compact()
            fixture.detectChanges()

            const menuItemWithNoChildren: DebugElement = fixture.debugElement.query(By.directive(NbMenuComponent))
            menuItemWithNoChildren.nativeElement.click()
            fixture.detectChanges()

            expect(sidebarComponent.compacted()).toEqual(true)
        })

        it('should not expand when clicked on menu group', () => {
            sidebarComponent.compact()
            fixture.detectChanges()

            const menuGroup: DebugElement = fixture.debugElement.queryAll(By.directive(NbMenuItemComponent))[3]
            menuGroup.query(By.css('span')).nativeElement.click()
            fixture.detectChanges()

            expect(sidebarComponent.compacted()).toEqual(true)
        })

        it('should expand when icon of menu item with child items clicked', () => {
            sidebarComponent.compact()
            fixture.detectChanges()

            const menuItemWithChildren: DebugElement = fixture.debugElement.queryAll(By.directive(NbMenuItemComponent))[1]
            menuItemWithChildren.query(By.directive(NbIconComponent)).nativeElement.click()
            fixture.detectChanges()

            expect(sidebarComponent.expanded()).toEqual(true)
        })

        it('should expand when link of menu item with child items clicked', () => {
            sidebarComponent.compact()
            fixture.detectChanges()

            const menuItemWithChildren: DebugElement = fixture.debugElement.queryAll(By.directive(NbMenuItemComponent))[1]
            menuItemWithChildren.query(By.css('a')).nativeElement.click()
            fixture.detectChanges()

            expect(sidebarComponent.expanded()).toEqual(true)
        })

        it('should expand when a submenu is opened by key', () => {
            sidebarComponent.compact()
            fixture.detectChanges()

            const menuItemWithChildren: DebugElement = fixture.debugElement.queryAll(By.directive(NbMenuItemComponent))[1]
            const link: HTMLElement = menuItemWithChildren.query(By.css('a')).nativeElement
            link.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
            fixture.detectChanges()

            expect(sidebarComponent.expanded()).toEqual(true)
        })

        it('should keep the submenu expanded on every click while compacted', () => {
            const parent = fixture.componentInstance.menuItems[1]
            for (let i = 0; i < 3; i++) {
                sidebarComponent.compact()
                fixture.detectChanges()

                const parentItem: DebugElement = fixture.debugElement.queryAll(By.directive(NbMenuItemComponent))[1]
                parentItem.query(By.css('a')).nativeElement.click()
                fixture.detectChanges()

                expect(sidebarComponent.expanded()).toEqual(true)
                expect(parent.expanded).toEqual(true)
            }
        })

        it('should compact when sidebar service compact method called', () => {
            const sidebarService: NbSidebarService = TestBed.inject(NbSidebarService)

            expect(sidebarComponent.compacted()).toEqual(false)

            sidebarService.compact()
            fixture.detectChanges()

            expect(sidebarComponent.compacted()).toEqual(true)
        })

        it('should expand when responsive is set to false', () => {
            fixture.componentInstance.responsive.set(true)
            fixture.detectChanges()
            sidebarComponent.collapse()

            expect(sidebarComponent.state()).toEqual('collapsed')

            fixture.componentInstance.responsive.set(false)
            fixture.detectChanges()

            expect(sidebarComponent.state()).toEqual('expanded')
        })

        it('should update state according to the current breakpoint when responsive turns on (update to compacted)', () => {
            const compactedBreakpoints = sidebarComponent.compactedBreakpoints()
            const largestCompactedBreakpointName = compactedBreakpoints[compactedBreakpoints.length - 1]
            themeService.setBreakpointTo(largestCompactedBreakpointName)

            expect(sidebarComponent.state()).toEqual('expanded')

            fixture.componentInstance.responsive.set(true)
            fixture.detectChanges()

            expect(sidebarComponent.state()).toEqual('compacted')
        })

        it('should update state according to the current breakpoint when responsive turns on (update to collapsed)', () => {
            themeService.setBreakpointTo(sidebarComponent.collapsedBreakpoints()[0])

            expect(sidebarComponent.state()).toEqual('expanded')

            fixture.componentInstance.responsive.set(true)
            fixture.detectChanges()

            expect(sidebarComponent.state()).toEqual('collapsed')
        })

        it('should expand when responsive and initial state is in different breakpoint', () => {
            fixture = TestBed.createComponent(SidebarExpandTestComponent)
            fixture.componentInstance.responsive.set(true)
            fixture.componentInstance.state.set('compacted')
            fixture.detectChanges()
            sidebarComponent = fixture.debugElement.query(By.directive(NbSidebarComponent)).componentInstance

            expect(sidebarComponent.state()).toEqual('expanded')
        })

        it('Should return default sidebar state', () => new Promise<void>((done) => {
            const sidebarService: NbSidebarService = TestBed.inject(NbSidebarService)
            fixture.detectChanges()
            sidebarService.getSidebarState().subscribe((state: NbSidebarState) => {
                expect(state).toBe('expanded')
                done()
            })
        }))

        it('Should return changed sidebar state', () => new Promise<void>((done) => {
            const sidebarService: NbSidebarService = TestBed.inject(NbSidebarService)
            sidebarComponent.collapse()
            fixture.detectChanges()
            sidebarService.getSidebarState().subscribe((state: NbSidebarState) => {
                expect(state).toBe('collapsed')
                done()
            })
        }))

        it('Should return default sidebar responsive state', () => new Promise<void>((done) => {
            const sidebarService: NbSidebarService = TestBed.inject(NbSidebarService)
            fixture.detectChanges()
            sidebarService.getSidebarResponsiveState().subscribe((state: NbSidebarResponsiveState) => {
                expect(state).toBe('pc')
                done()
            })
        }))

        it('Should return changed sidebar responsive state', () => new Promise<void>((done) => {
            const sidebarService: NbSidebarService = TestBed.inject(NbSidebarService)
            themeService.setBreakpointTo('md')
            fixture.componentInstance.responsive.set(true)
            fixture.detectChanges()
            fixture.detectChanges()
            sidebarService.getSidebarResponsiveState().subscribe((state: NbSidebarResponsiveState) => {
                expect(state).toBe('tablet')
                done()
            })
        }))
    })
})

@Component({ template: '' })
class SidebarClosePageComponent {}

@Component({
    template: `
    <nb-sidebar
      [fixed]="fixed()"
      [responsive]="responsive()"
      [closeOnNavigation]="closeOnNavigation()"
      [closeOnOutsideClick]="closeOnOutsideClick()"
      state="expanded"
    >
      <button class="inside">Inside</button>
      <nb-menu [items]="menuItems" />
    </nb-sidebar>
    <button class="toggle" (click)="sidebarService.toggle()">Toggle</button>
    <button class="outside">Outside</button>
  `,
    imports: [NbSidebarModule, NbMenuModule]
})
class SidebarCloseTestComponent {
    readonly sidebarService = inject_1(NbSidebarService)

    readonly fixed = signal(true)
    readonly responsive = signal(false)
    readonly closeOnNavigation = signal(true)
    readonly closeOnOutsideClick = signal(true)

    readonly menuItems: NbMenuItem[] = [
        { title: 'Page', link: '/page' },
        { title: 'Section', children: [{ title: 'Child', link: '/child' }] }
    ]
}

describe('NbSidebarComponent closing', () => {
    let fixture: ComponentFixture<SidebarCloseTestComponent>
    let host: SidebarCloseTestComponent

    const sidebar = () =>
        fixture.debugElement.query(By.directive(NbSidebarComponent)).componentInstance as NbSidebarComponent
    const click = async (selector: string) => {
        (fixture.nativeElement.querySelector(selector) as HTMLElement).click()
        fixture.detectChanges()
        await fixture.whenStable()
    }

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot([{ path: '**', component: SidebarClosePageComponent }]),
                NbThemeModule.forRoot(),
                NbSidebarModule.forRoot(),
                NbMenuModule.forRoot()
            ],
            providers: [MockThemeService, { provide: NbThemeService, useExisting: MockThemeService }]
        })
        fixture = TestBed.createComponent(SidebarCloseTestComponent)
        host = fixture.componentInstance
        fixture.detectChanges()
        await fixture.whenStable()
    })

    it('should close on a click outside it, but not on one inside it', async () => {
        await click('.inside')
        expect(sidebar().state()).toBe('expanded')

        await click('.outside')
        expect(sidebar().state()).toBe('collapsed')
    })

    it('should stay open after the click that opens it', async () => {
        await click('.outside')
        await click('.toggle')
        expect(sidebar().state()).toBe('expanded')

        await click('.toggle')
        expect(sidebar().state()).toBe('collapsed')
    })

    it('should close when the router navigates', async () => {
        await TestBed.inject(Router).navigateByUrl('/elsewhere')
        fixture.detectChanges()
        expect(sidebar().state()).toBe('collapsed')
    })

    it('should close when a link in it is picked, even to the open page, but not when a submenu opens', async () => {
        await TestBed.inject(Router).navigateByUrl('/page')
        sidebar().expand()
        fixture.detectChanges()
        await click('a[title="Section"]')
        expect(sidebar().state()).toBe('expanded')

        await click('a[title="Page"]')
        expect(sidebar().state()).toBe('collapsed')
    })

    it('should compact a responsive sidebar on tablets', async () => {
        host.responsive.set(true)
        fixture.detectChanges()
        TestBed.inject(MockThemeService).setBreakpointTo('md')
        sidebar().expand()
        fixture.detectChanges()

        await click('.outside')
        expect(sidebar().state()).toBe('compacted')
    })

    it("should stay open when it doesn't overlay the content, or the options are off", async () => {
        host.fixed.set(false)
        fixture.detectChanges()
        await click('.outside')
        await TestBed.inject(Router).navigateByUrl('/elsewhere')
        expect(sidebar().state()).toBe('expanded')

        host.fixed.set(true)
        host.closeOnNavigation.set(false)
        host.closeOnOutsideClick.set(false)
        fixture.detectChanges()
        await click('.outside')
        await click('a[title="Page"]')
        expect(sidebar().state()).toBe('expanded')
    })
})

@Component({
    template: `
    <nb-sidebar />
    <nb-sidebar start />
    <nb-sidebar end />
    <nb-sidebar left />
    <nb-sidebar right />
  `,
    imports: [NbSidebarModule]
})
class SidebarSidesTestComponent {}

describe('NbSidebarComponent sides', () => {
    it('should be on the start edge unless a side is given', () => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbSidebarModule.forRoot(), SidebarSidesTestComponent]
        })
        const fixture = TestBed.createComponent(SidebarSidesTestComponent)
        fixture.detectChanges()

        const sides = fixture.debugElement
            .queryAll(By.directive(NbSidebarComponent))
            .map(({ nativeElement }: { nativeElement: HTMLElement }) =>
                ['start', 'end', 'left', 'right'].filter((side) => nativeElement.classList.contains(side))
            )
        expect(sides).toEqual([['start'], ['start'], ['end'], ['left'], ['right']])
    })
})
