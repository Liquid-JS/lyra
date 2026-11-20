import { assert } from 'vitest'
import { Component, viewChild, viewChildren, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActivatedRoute, Params, RouterModule } from '@angular/router'
import { NbTabComponent, NbTabsetComponent, NbTabsetModule } from '@liquid-js/lyr-core'
import { BehaviorSubject } from 'rxjs'

@Component({
    template: `
    <nb-tabset routeParam="tab">
      @if (showTabs()) {
        <nb-tab tabTitle="1" route="1" tabId="tab-1">1</nb-tab>
      }
      @if (showTabs()) {
        <nb-tab tabTitle="2" route="2" tabId="tab-2">2</nb-tab>
      }
      @if (showTabs()) {
        <nb-tab tabTitle="3" route="3" tabId="tab-3" disabled>3</nb-tab>
      }
    </nb-tabset>
  `,
    imports: [NbTabsetModule, RouterModule]
})
export class TabsetTestComponent {
    readonly showTabs = signal(true)

    readonly tabsetComponent = viewChild.required(NbTabsetComponent)
    readonly tabComponents = viewChildren(NbTabComponent)

    getDisabledTab(): NbTabComponent {
        return this.tabComponents()[2]
    }
}

export class ActivatedRouteStub {
    private subject = new BehaviorSubject<Params>({})
    readonly params = this.subject.asObservable()

    constructor(params: Params = {}) {
        this.subject.next(params)
    }

    setParams(params: Params) {
        this.subject.next(params)
    }
}

describe('NbTabsetComponent', () => {
    let fixture: ComponentFixture<TabsetTestComponent>
    let testComponent: TabsetTestComponent
    let tabsetComponent: NbTabsetComponent
    let activatedRouteStub: ActivatedRouteStub

    beforeEach(async () => {
        vi.useFakeTimers()
        activatedRouteStub = new ActivatedRouteStub()

        TestBed.configureTestingModule({
            imports: [RouterModule.forRoot([]), NbTabsetModule, TabsetTestComponent],
            providers: [{ provide: ActivatedRoute, useValue: activatedRouteStub }]
        })

        fixture = TestBed.createComponent(TabsetTestComponent)
        testComponent = fixture.componentInstance

        fixture.detectChanges()
        await vi.advanceTimersByTimeAsync(0)

        tabsetComponent = testComponent.tabsetComponent()
        vi.useRealTimers()
    })

    it('should mark tab as active if selected in route param', async () => {
        vi.useFakeTimers()
        const selectTabSpy = vi.spyOn(tabsetComponent, 'selectTab').mockImplementation(() => undefined)
        const tabToSelect = testComponent.tabComponents().at(0)
        assert(tabToSelect)

        activatedRouteStub.setParams({ tab: tabToSelect.route() })
        fixture.detectChanges()
        await vi.advanceTimersByTimeAsync(0)

        expect(selectTabSpy).toHaveBeenCalledTimes(1)
        expect(selectTabSpy).toHaveBeenCalledWith(tabToSelect)
        expect(tabToSelect.isActive()).toEqual(true)
    })

    it('should not mark disabled tab as active if selected in route param', async () => {
        vi.useFakeTimers()
        const changeTabSpy = vi.fn()
        const disabledTab: NbTabComponent = testComponent.getDisabledTab()

        activatedRouteStub.setParams({ tab: disabledTab.route() })
        fixture.detectChanges()
        await vi.advanceTimersByTimeAsync(0)

        expect(changeTabSpy).not.toHaveBeenCalled()
        expect(disabledTab.isActive()).toEqual(false)
    })

    it('should not call \'selectTab\' if no tabs found', async () => {
        vi.useFakeTimers()
        const selectTabSpy = vi.spyOn(tabsetComponent, 'selectTab').mockImplementation(() => undefined)

        testComponent.showTabs.set(false)
        fixture.detectChanges()

        activatedRouteStub.setParams({ tab: 1 })
        fixture.detectChanges()
        await vi.advanceTimersByTimeAsync(0)

        expect(selectTabSpy).not.toHaveBeenCalled()
    })

    it('should set proper tab IDs', () => {
        const items = fixture.nativeElement.querySelectorAll('li')
        expect(items[0].getAttribute('data-tab-id')).toEqual('tab-1')
        expect(items[1].getAttribute('data-tab-id')).toEqual('tab-2')
        expect(items[2].getAttribute('data-tab-id')).toEqual('tab-3')
    })

    it('should be a tab list: the selected tab reached by Tab, the others by the arrow keys, picked with Enter', () => {
        fixture.detectChanges()
        const list = fixture.nativeElement.querySelector('ul') as HTMLElement
        const tabs = Array.from(list.querySelectorAll('li')) as HTMLElement[]
        const panels = Array.from(fixture.nativeElement.querySelectorAll('nb-tab')) as HTMLElement[]
        const press = (key: string) =>
            (document.activeElement as HTMLElement).dispatchEvent(
                new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
            )

        expect(list.getAttribute('role')).toBe('tablist')
        expect(tabs.map((tab) => tab.getAttribute('role'))).toEqual(['tab', 'tab', 'tab'])
        expect(tabs.map((tab) => tab.getAttribute('aria-selected'))).toEqual(['true', 'false', 'false'])
        expect(tabs.map((tab) => tab.tabIndex)).toEqual([0, -1, -1])
        expect(tabs[2].getAttribute('aria-disabled')).toBe('true')
        expect(tabs[0].getAttribute('aria-controls')).toBe(panels[0].id)
        expect(panels[0].getAttribute('role')).toBe('tabpanel')
        expect(panels[0].getAttribute('aria-labelledby')).toBe(tabs[0].id)

        tabs[0].focus()
        press('ArrowRight')
        expect(document.activeElement).toBe(tabs[1])
        // The disabled tab is skipped, back round to the first.
        press('ArrowRight')
        expect(document.activeElement).toBe(tabs[0])
        press('End')
        expect(document.activeElement).toBe(tabs[1])
        expect(press('Enter')).toBe(false)
        fixture.detectChanges()
        expect(tabs.map((tab) => tab.getAttribute('aria-selected'))).toEqual(['false', 'true', 'false'])
        expect(tabs.map((tab) => tab.tabIndex)).toEqual([-1, 0, -1])
    })

    it('should isolate the direction of the tab titles', () => {
        const titles = Array.from(fixture.nativeElement.querySelectorAll('.tab-text') as NodeListOf<HTMLElement>)
        expect(titles.map((title) => [title.textContent, title.getAttribute('dir')])).toEqual([
            ['1', 'auto'],
            ['2', 'auto'],
            ['3', 'auto']
        ])
    })
})

@Component({
    template: `
    <nb-tabset>
      <nb-tab tabTitle="First">first content</nb-tab>
      <nb-tab tabTitle="Lazy">
        <span class="lazy-content" *nbTabContent>lazy content</span>
      </nb-tab>
    </nb-tabset>
  `,
    imports: [NbTabsetModule, RouterModule]
})
class NbLazyTabTestComponent {
    readonly tabset = viewChild.required(NbTabsetComponent)
    readonly tabs = viewChildren(NbTabComponent)
}

describe('nb-tab with nbTabContent', () => {
    it('should create the content when the tab is first selected and keep it', () => {
        TestBed.configureTestingModule({
            imports: [RouterModule.forRoot([]), NbTabsetModule, NbLazyTabTestComponent]
        })
        const fixture = TestBed.createComponent(NbLazyTabTestComponent)
        fixture.detectChanges()
        expect(fixture.nativeElement.querySelector('.lazy-content')).toBeNull()

        const [first, lazy] = fixture.componentInstance.tabs()
        fixture.componentInstance.tabset().selectTab(lazy)
        fixture.detectChanges()
        expect(fixture.nativeElement.querySelector('.lazy-content')).not.toBeNull()

        fixture.componentInstance.tabset().selectTab(first)
        fixture.detectChanges()
        expect(fixture.nativeElement.querySelector('.lazy-content')).not.toBeNull()
    })
})
