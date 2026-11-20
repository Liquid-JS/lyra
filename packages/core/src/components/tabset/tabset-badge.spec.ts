import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'

import { NbTabsetModule, NbThemeModule } from '@liquid-js/lyr-core'

@Component({
    template: `
    <nb-tabset>
      <nb-tab tabTitle="Upcoming" badgeText="2">Upcoming trips</nb-tab>
      <nb-tab tabTitle="Past" badgeText="5" badgePosition="top end">Past trips</nb-tab>
      <nb-tab tabTitle="Alerts" badgeDot badgeStatus="danger">Alerts</nb-tab>
    </nb-tabset>
  `,
    imports: [NbTabsetModule]
})
class TabsetBadgeHostComponent {}

describe('NbTabsetComponent badges', () => {
    it('should put a count without a position after the title, and keep positioned badges and dots on the corner', async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()], providers: [provideRouter([])] })
        const fixture = TestBed.createComponent(TabsetBadgeHostComponent)
        fixture.detectChanges()
        await fixture.whenStable()

        const tabs = [...fixture.nativeElement.querySelectorAll('li.tab')] as HTMLElement[]
        const count = tabs[0].querySelector('.tab-link nb-badge')
        expect(count?.textContent?.trim()).toBe('2')
        expect(count?.classList).toContain('position-inline')

        expect(tabs[1].querySelector('.tab-link nb-badge')).toBeNull()
        expect(tabs[1].querySelector(':scope > nb-badge')?.classList).toContain('position-end')

        expect(tabs[2].querySelector('.tab-link nb-badge')).toBeNull()
        expect(tabs[2].querySelector(':scope > nb-badge')?.classList).toContain('dot-mode')
    })
})
