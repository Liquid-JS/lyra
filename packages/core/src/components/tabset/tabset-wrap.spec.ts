import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'

import { NbTabsetComponent, NbTabsetModule, NbThemeModule } from '@liquid-js/lyr-core'

const DAYS = ['Monday 23', 'Tuesday 24', 'Wednesday 25', 'Thursday 26', 'Friday 27', 'Saturday 28', 'Sunday 29']

@Component({
    template: `
    <nb-tabset class="wrapping" style="width: 12rem">
      @for (day of days; track day) {
        <nb-tab [tabTitle]="day">{{ day }}</nb-tab>
      }
    </nb-tabset>
    <nb-tabset class="scrolling" wrap="false" style="width: 12rem">
      @for (day of days; track day) {
        <nb-tab [tabTitle]="day">{{ day }}</nb-tab>
      }
    </nb-tabset>
  `,
    imports: [NbTabsetModule]
})
class TabsetWrapHostComponent {
    readonly days = DAYS
}

describe('NbTabsetComponent wrap', () => {
    it('should keep its tabs on one line that scrolls, with the selected tab in view, with wrap off', async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()], providers: [provideRouter([])] })
        const fixture = TestBed.createComponent(TabsetWrapHostComponent)
        document.body.appendChild(fixture.nativeElement)
        fixture.detectChanges()
        await fixture.whenStable()

        const height = (selector: string) => (fixture.nativeElement.querySelector(`${selector} li.tab`) as HTMLElement).getBoundingClientRect().height
        const list = fixture.nativeElement.querySelector('.scrolling .tabset') as HTMLElement
        // Wrapping, a title takes two lines; on one line it keeps one, and the list scrolls.
        expect(height('.wrapping')).toBeGreaterThan(height('.scrolling'))
        expect(list.scrollWidth).toBeGreaterThan(list.clientWidth)

        const tabset = fixture.debugElement.query((element) => element.nativeElement.classList?.contains('scrolling')).componentInstance as NbTabsetComponent
        tabset.selectTab(tabset.tabs()[DAYS.length - 1])
        expect(list.scrollLeft).toBeGreaterThan(0)
        fixture.destroy()
    })
})
