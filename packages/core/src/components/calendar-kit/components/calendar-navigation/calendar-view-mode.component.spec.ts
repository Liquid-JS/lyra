import { assert } from 'vitest'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NbCalendarViewMode, NbCalendarViewModeComponent, NbCalendarKitModule, NbThemeModule } from '@liquid-js/lyr-core'

describe('Component: NbCalendarViewModeComponent', () => {
    let fixture: ComponentFixture<NbCalendarViewModeComponent<Date>>
    let component: NbCalendarViewModeComponent<Date>
    let componentEl: HTMLElement

    const button = () => {
        const el = componentEl.querySelector('button')
        assert(el, 'button not rendered')
        return el
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbCalendarKitModule]
        })
        fixture = TestBed.createComponent<NbCalendarViewModeComponent<Date>>(NbCalendarViewModeComponent)
        component = fixture.componentInstance
        componentEl = fixture.debugElement.nativeElement
    })

    it('should render empty button with when null date', () => {
        fixture.detectChanges()
        expect(button().textContent).toContain('')
    })

    it('should render moth with year in date mode', () => {
        fixture.componentRef.setInput('date', new Date(2018, 6, 23))
        fixture.detectChanges()
        expect(button().textContent).toContain('July 2018')
    })

    it('should render year in month mode', () => {
        fixture.componentRef.setInput('date', new Date(2018, 6, 23))
        fixture.componentRef.setInput('viewMode', NbCalendarViewMode.MONTH)
        fixture.detectChanges()
        expect(button().textContent).toContain('2018')
    })

    it('should render years range in year mode', () => {
        fixture.componentRef.setInput('date', new Date(2018, 6, 23))
        fixture.componentRef.setInput('viewMode', NbCalendarViewMode.YEAR)
        fixture.detectChanges()
        expect(button().textContent).toContain('2016 - 2027')
    })

    it('should has down icon in date mode', () => {
        fixture.componentRef.setInput('date', new Date(2018, 6, 23))
        fixture.detectChanges()
        expect(component.getIcon()).toBe('chevron-down-outline')
    })

    it('should has up icon in month mode', () => {
        fixture.componentRef.setInput('date', new Date(2018, 6, 23))
        fixture.componentRef.setInput('viewMode', NbCalendarViewMode.MONTH)
        fixture.detectChanges()
        expect(component.getIcon()).toBe('chevron-up-outline')
    })

    it('should has up icon in year mode', () => {
        fixture.componentRef.setInput('date', new Date(2018, 6, 23))
        fixture.componentRef.setInput('viewMode', NbCalendarViewMode.YEAR)
        fixture.detectChanges()
        expect(component.getIcon()).toBe('chevron-up-outline')
    })

    it('should emit change mode when button clicked', async () => {
        vi.useFakeTimers()
        const changeModeSpy = vi.fn()
        component.changeMode.subscribe(changeModeSpy)
        fixture.detectChanges()

        button().dispatchEvent(new Event('click'))
        await vi.runAllTimersAsync()

        expect(changeModeSpy).toHaveBeenCalled()
    })

    it('should show the text without a button when there\'s no other view', () => {
        fixture.componentRef.setInput('date', new Date(2018, 6, 23))
        fixture.componentRef.setInput('viewMode', NbCalendarViewMode.YEAR)
        fixture.componentRef.setInput('changeable', false)
        fixture.detectChanges()
        expect(componentEl.querySelector('button')).toBeNull()
        expect(componentEl.querySelector('.calendar-view-mode-label')?.textContent).toBe('2016 - 2027')
    })
})
