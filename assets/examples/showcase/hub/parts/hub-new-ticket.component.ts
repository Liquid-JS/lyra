import { Component, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import {
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbCardHeaderComponent,
    NbDialogRef,
    NbInputDirective,
    NbOptionComponent,
    NbRadioComponent,
    NbRadioGroupComponent,
    NbSelectComponent
} from '@liquid-js/lyr-core'

import { TicketPriority } from '../hub-data'

/** What a new ticket needs: the dialog gives it back to the board. */
export interface NewTicket {
    title: string
    category: string
    priority: TicketPriority
}

// What the dialog closes with, when it isn't cancelled.
const CATEGORIES = ['Hardware', 'Software', 'Access', 'Network', 'Office']
const PRIORITIES: Array<{ value: TicketPriority, title: string, text: string }> = [
    { value: 'low', title: 'Low', text: 'Whenever there is time' },
    { value: 'medium', title: 'Medium', text: 'This week' },
    { value: 'high', title: 'High', text: 'Today' },
    { value: 'urgent', title: 'Urgent', text: 'I cannot work' }
]

/** The dialog that opens a ticket: what's wrong, which kind of thing it is, and how urgent. */
@Component({
    selector: 'npg-hub-new-ticket',
    template: `
    <nb-card class="dialog">
      <nb-card-header>New ticket</nb-card-header>
      <nb-card-body>
        <div class="field">
          <label class="label" for="ticket-title">What's wrong?</label>
          <input
            nbInput
            fullWidth
            id="ticket-title"
            autocomplete="off"
            placeholder="e.g. My screen stays black after sleep"
            [(ngModel)]="title" />
        </div>
        <div class="field">
          <label class="label" id="ticket-category">Category</label>
          <nb-select fullWidth aria-labelledby="ticket-category" [(selected)]="category">
            @for (item of categories; track item) {
              <nb-option [value]="item">{{ item }}</nb-option>
            }
          </nb-select>
        </div>
        <div class="field">
          <span class="label" id="ticket-priority">Priority</span>
          <nb-radio-group class="priorities" name="priority" aria-labelledby="ticket-priority" [(ngModel)]="priority">
            @for (item of priorities; track item.value) {
              <nb-radio [value]="item.value">
                {{ item.title }} <span class="caption hint">{{ item.text }}</span>
              </nb-radio>
            }
          </nb-radio-group>
        </div>
        <div class="field">
          <label class="label" for="ticket-details">Details</label>
          <textarea
            nbInput
            fullWidth
            id="ticket-details"
            rows="3"
            placeholder="What you tried, and since when"></textarea>
        </div>
      </nb-card-body>
      <nb-card-footer class="dialog-actions">
        <button nbButton ghost type="button" (click)="ref.close()">Cancel</button>
        <button nbButton status="primary" type="button" [disabled]="!title.trim()" (click)="send()">Open ticket</button>
      </nb-card-footer>
    </nb-card>
  `,
    styles: `
    .dialog {
      width: min(32rem, calc(100vw - 2rem));
      margin: 0;
    }

    .field {
      margin-bottom: 1rem;
    }

    .priorities {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.25rem 1rem;
    }

    .hint {
      color: var(--text-hint-color);
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }
  `,
    imports: [
        FormsModule,
        NbButtonComponent,
        NbCardBodyComponent,
        NbCardComponent,
        NbCardFooterComponent,
        NbCardHeaderComponent,
        NbInputDirective,
        NbOptionComponent,
        NbRadioComponent,
        NbRadioGroupComponent,
        NbSelectComponent
    ]
})
export class HubNewTicketComponent {
    protected readonly ref = inject<NbDialogRef<HubNewTicketComponent, NewTicket>>(NbDialogRef)
    readonly categories = CATEGORIES
    readonly priorities = PRIORITIES
    title = ''
    category = 'Software'
    priority: TicketPriority = 'medium'

    send() {
        this.ref.close({ title: this.title.trim(), category: this.category, priority: this.priority })
    }
}
