import { Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterModule } from '@angular/router'
import { config } from 'rxjs'
import { NbDatepickerModule, NbLayoutModule, NbThemeModule } from '@liquid-js/lyr-core'
import { NbDateFnsDateModule } from '@liquid-js/lyr-date-fns'

@Component({
    selector: 'nb-datepicker-format-test',
    template: `
    <nb-layout>
      <nb-layout-column>
        <input [nbDatepicker]="datepicker" />
        <nb-datepicker #datepicker [format]="format()" />
      </nb-layout-column>
    </nb-layout>
  `,
    imports: [NbLayoutModule, RouterModule, NbDatepickerModule]
})
class NbDatepickerFormatTestComponent {
    readonly format = signal('MM/dd/yyyy')
}

@Component({
    selector: 'nb-rangepicker-format-test',
    template: `
    <nb-layout>
      <nb-layout-column>
        <input [nbDatepicker]="rangepicker" />
        <nb-rangepicker #rangepicker [format]="format()" />
      </nb-layout-column>
    </nb-layout>
  `,
    imports: [NbLayoutModule, RouterModule, NbDatepickerModule]
})
class NbRangepickerFormatTestComponent {
    readonly format = signal('MM/dd/yyyy')
}

describe('nb-datepicker format change with date-fns', () => {
    let fixture: ComponentFixture<NbDatepickerFormatTestComponent>
    let input: HTMLInputElement

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot([]),
                NbThemeModule.forRoot(),
                NbLayoutModule,
                NbDatepickerModule.forRoot(),
                NbDateFnsDateModule.forRoot({}),
                NbDatepickerFormatTestComponent, NbRangepickerFormatTestComponent
            ]
        })
        fixture = TestBed.createComponent(NbDatepickerFormatTestComponent)
        fixture.detectChanges()
        input = fixture.nativeElement.querySelector('input')
    })

    const type = (value: string) => {
    // Focusing opens the picker, which sets up the format handling as it does for a user.
        input.focus()
        fixture.detectChanges()
        input.value = value
        input.dispatchEvent(new Event('input'))
        fixture.detectChanges()
    }

    // The format change is handled in a subscription; RxJS reports its errors from a timer, after the current task.
    const collectRxjsErrors = async (run: () => void): Promise<unknown[]> => {
        const onUnhandledError = config.onUnhandledError
        const errors = new Array<unknown>()
        config.onUnhandledError = (error) => errors.push(error)
        try {
            run()
            await new Promise((resolve) => setTimeout(resolve))
        } finally {
            config.onUnhandledError = onUnhandledError
        }
        return errors
    }

    it('should keep partially typed text when the format changes', async () => {
        const errors = await collectRxjsErrors(() => {
            type('12')
            fixture.componentInstance.format.set('dd.MM.yyyy')
            fixture.detectChanges()
        })
        expect(errors).toEqual([])
        expect(input.value).toBe('12')
    })

    it('should reformat a valid date', () => {
        type('09/17/2018')
        fixture.componentInstance.format.set('dd.MM.yyyy')
        fixture.detectChanges()
        expect(input.value).toBe('17.09.2018')
    })

    it('should keep partially typed range text when the format changes', async () => {
        const rangeFixture = TestBed.createComponent(NbRangepickerFormatTestComponent)
        rangeFixture.detectChanges()
        const rangeInput: HTMLInputElement = rangeFixture.nativeElement.querySelector('input')

        const errors = await collectRxjsErrors(() => {
            rangeInput.value = '12'
            rangeInput.dispatchEvent(new Event('input'))
            rangeFixture.detectChanges()
            rangeFixture.componentInstance.format.set('dd.MM.yyyy')
            rangeFixture.detectChanges()
        })
        expect(errors).toEqual([])
        expect(rangeInput.value).toBe('12')
    })
})
