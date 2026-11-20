import { assert } from 'vitest'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { DatePipe } from '@angular/common'
import {
    NbIconModule,
    NbCalendarViewModeComponent,
    NbCalendarPageableNavigationComponent,
    NbDateService,
    NbNativeDateService,
    NbThemeModule
} from '@liquid-js/lyr-core'

describe('Component: NbCalendarPageableNavigation', () => {
    let fixture: ComponentFixture<NbCalendarPageableNavigationComponent>
    let component: NbCalendarPageableNavigationComponent
    let componentEl: HTMLElement

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NbCalendarViewModeComponent,
                NbCalendarPageableNavigationComponent,
                NbThemeModule.forRoot(),
                NbIconModule
            ],
            providers: [{ provide: NbDateService, useClass: NbNativeDateService }, DatePipe]
        })
        fixture = TestBed.createComponent<NbCalendarPageableNavigationComponent>(
            NbCalendarPageableNavigationComponent
        )
        component = fixture.componentInstance
        componentEl = fixture.debugElement.nativeElement
    })

    it('should fire prev when prev button clicked', () => new Promise<void>((done) => {
        fixture.detectChanges()
        component.prev.subscribe((e) => {
            expect(e).toBeUndefined()
            done()
        })
        const prevButton = componentEl.querySelector('button:first-child')
        assert(prevButton)
        prevButton.dispatchEvent(new Event('click'))
    }))

    it('should fire next when next button clicked', () => new Promise<void>((done) => {
        fixture.detectChanges()
        component.next.subscribe((e) => {
            expect(e).toBeUndefined()
            done()
        })
        const nextButton = componentEl.querySelector('button:last-child')
        assert(nextButton)
        nextButton.dispatchEvent(new Event('click'))
    }))
})
