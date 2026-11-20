import { DatePipe, DecimalPipe } from '@angular/common'
import { Component, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import {
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbCardHeaderComponent,
    NbDataTableModule,
    NbDatepickerDirective,
    NbFormFieldComponent,
    NbIconComponent,
    NbInputDirective,
    NbListComponent,
    NbListItemComponent,
    NbOptionComponent,
    NbPaginationComponent,
    NbPrefixDirective,
    NbRangepickerComponent,
    NbSelectComponent,
    nbTableDataSource,
    NbTagComponent,
    NbToastrService
} from '@liquid-js/lyr-core'

import { DELIVERY_STATUS, DeliveryEvent, DeliveryStatus, EVENTS } from './relay-data'

/** The event log: every delivery, filtered and paged, and the one picked open beside it with what was sent and got. */
@Component({
    selector: 'npg-relay-events',
    templateUrl: './relay-events.component.html',
    styleUrls: ['./relay-events.component.scss'],
    imports: [
        DatePipe,
        DecimalPipe,
        FormsModule,
        NbButtonComponent,
        NbCardBodyComponent,
        NbCardComponent,
        NbCardFooterComponent,
        NbCardHeaderComponent,
        NbDataTableModule,
        NbDatepickerDirective,
        NbFormFieldComponent,
        NbIconComponent,
        NbInputDirective,
        NbListComponent,
        NbListItemComponent,
        NbOptionComponent,
        NbPaginationComponent,
        NbPrefixDirective,
        NbRangepickerComponent,
        NbSelectComponent,
        NbTagComponent
    ],
    host: { '[class.open]': '!!selected()' }
})
export class RelayEventsComponent {
    private readonly toastr = inject(NbToastrService)

    readonly columns = ['status', 'id', 'type', 'endpoint', 'attempts', 'latency', 'at']
    readonly source = nbTableDataSource({ data: EVENTS, pageSize: 12, rowId: (event) => event.id })
    readonly status = DELIVERY_STATUS
    readonly statuses: DeliveryStatus[] = ['delivered', 'failed', 'pending']
    readonly selected = signal<DeliveryEvent | undefined>(undefined)

    search(value: string) {
        this.source.setFilter('type', value)
    }

    filterStatus(status: DeliveryStatus | '') {
        this.source.setFilter('status', status || undefined)
    }

    open(event: DeliveryEvent) {
        this.selected.set(this.selected()?.id === event.id ? undefined : event)
    }

    retry(event: DeliveryEvent) {
        this.toastr.info(`${event.id} is queued for another attempt to ${event.endpoint}.`, 'Retrying', { duration: 3000 })
    }
}
