import { assert } from 'vitest'
import { Component, ViewEncapsulation } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NbThemeModule, NbTimepickerModule } from '@liquid-js/lyr-core'

@Component({
    template: `
    <input [nbTimepicker]="timepicker" />
    <nb-timepicker #timepicker />
  `,
    styleUrl: './timepicker-frame.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbTimepickerModule]
})
class TimepickerFrameHostComponent {}

// The theme's values the frame takes: the date picker's, which the time picker's track, not a card's.
const THEME = {
    '--datepicker-background-color': 'rgb(1, 2, 3)',
    '--datepicker-border-color': 'rgb(4, 5, 6)',
    '--datepicker-border-width': '3px',
    '--datepicker-border-radius': '7px',
    '--datepicker-shadow': 'rgb(7, 8, 9) 0px 0px 4px 0px',
    '--card-background-color': 'rgb(200, 0, 0)',
    '--card-border-color': 'rgb(200, 0, 0)',
    '--card-shadow': 'rgb(200, 0, 0) 0px 0px 9px 0px'
}

describe('nbTimepicker frame', () => {
    let fixture: ComponentFixture<TimepickerFrameHostComponent>

    beforeEach(async () => {
        document.body.classList.add('nb-theme-default')
        Object.entries(THEME).forEach(([name, value]) => document.body.style.setProperty(name, value))
        fixture = TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbTimepickerModule.forRoot(), TimepickerFrameHostComponent]
        }).createComponent(TimepickerFrameHostComponent)
        document.body.appendChild(fixture.nativeElement)
        fixture.detectChanges()
        await fixture.whenStable()
    })

    afterEach(() => {
        fixture.destroy()
        document.querySelectorAll('.cdk-overlay-container').forEach((container) => container.remove())
        document.body.classList.remove('nb-theme-default')
        Object.keys(THEME).forEach((name) => document.body.style.removeProperty(name))
    })

    it('should frame its popup with its own variables, as the date picker frames its', async () => {
        fixture.nativeElement.querySelector('input').click()
        fixture.detectChanges()
        const popup = () => document.querySelector<HTMLElement>('.cdk-overlay-pane > nb-card.nb-timepicker-container')
        await expect.poll(popup).toBeTruthy()
        const frame = popup()
        assert(frame)
        const style = getComputedStyle(frame)

        expect(style.backgroundColor).toBe('rgb(1, 2, 3)')
        expect(style.borderTopColor).toBe('rgb(4, 5, 6)')
        expect(style.borderTopWidth).toBe('3px')
        expect(style.borderTopLeftRadius).toBe('7px')
        expect(style.boxShadow).toBe('rgb(7, 8, 9) 0px 0px 4px 0px')
    })
})
