import { DatePipe } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import {
    NbButtonComponent,
    NbCalendarComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbDateService,
    NbToggleComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-calendar-form',
    templateUrl: './calendar-form.component.html',
    styles: `
    .actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1rem;
      margin-top: 1rem;
    }
  `,
    imports: [
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NbCalendarComponent,
        NbButtonComponent,
        NbToggleComponent,
        ReactiveFormsModule,
        DatePipe
    ]
})
export class CalendarFormComponent {
    protected readonly dateService = inject<NbDateService<Date>>(NbDateService)

    readonly today = this.dateService.today()
    readonly day = new FormControl<Date | null>(this.dateService.addDay(this.today, 3), Validators.required)
    /** The day saved, to restore. */
    saved = this.day.value

    toggleDisabled(disabled: boolean) {
        if (disabled) {
            this.day.disable()
        } else {
            this.day.enable()
        }
    }
}
