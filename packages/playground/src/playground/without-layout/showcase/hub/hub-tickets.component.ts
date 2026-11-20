import { afterNextRender, Component, computed, ElementRef, inject, Injector, signal } from '@angular/core';
import { SortablejsDirective } from 'nxt-sortablejs';
import { firstValueFrom } from 'rxjs';
import type { Options, SortableEvent } from 'sortablejs';
import {
  NbBadgeComponent,
  NbButtonComponent,
  NbCardBodyComponent,
  NbCardComponent,
  NbDialogService,
  NbFormFieldComponent,
  NbIconComponent,
  NbInputDirective,
  NbOptionComponent,
  NbPrefixDirective,
  NbSelectComponent,
  NbTagComponent,
  NbToastrService,
  NbUserComponent,
} from '@liquid-js/lyr-core';

import { photoOf, PRIORITY_STATUS, Ticket, TICKET_COLUMNS, TicketColumn, TicketPriority, TICKETS } from './hub-data';
import { HubNewTicketComponent, NewTicket } from './parts/hub-new-ticket.component';

/** IT tickets on a board, by where they are, with filters and a dialog that opens a new one. */
@Component({
  selector: 'npg-hub-tickets',
  templateUrl: './hub-tickets.component.html',
  styleUrls: ['./hub-tickets.component.scss'],
  imports: [
    NbBadgeComponent,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbFormFieldComponent,
    NbIconComponent,
    NbInputDirective,
    NbOptionComponent,
    NbPrefixDirective,
    NbSelectComponent,
    NbTagComponent,
    NbUserComponent,
    SortablejsDirective,
  ],
})
export class HubTicketsComponent {
  private readonly dialogs = inject(NbDialogService);
  private readonly toastr = inject(NbToastrService);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly injector = inject(Injector);

  readonly columns = TICKET_COLUMNS;
  readonly priorityStatus = PRIORITY_STATUS;
  readonly photoOf = photoOf;
  readonly tickets = signal<Ticket[]>(TICKETS);
  readonly search = signal('');
  readonly priority = signal<TicketPriority | ''>('');
  readonly assignee = signal('');
  readonly assignees = ['Lucas Hall', 'Jack Turner'];

  /** The tickets the filters leave, by column. */
  readonly board = computed(() => {
    const search = this.search().trim().toLowerCase();
    const shown = this.tickets().filter(
      (ticket) =>
        (!search || `${ticket.title} #${ticket.id}`.toLowerCase().includes(search)) &&
        (!this.priority() || ticket.priority === this.priority()) &&
        (!this.assignee() || ticket.assignee === this.assignee()),
    );
    return this.columns.map((column) => ({
      ...column,
      tickets: shown.filter((ticket) => ticket.column === column.id),
    }));
  });

  /** Tickets drag between the columns, and within one; the board shows where one goes as it moves. */
  readonly sortable: Options = {
    group: 'tickets',
    draggable: '.ticket',
    animation: 150,
    ghostClass: 'ticket-placeholder',
    chosenClass: 'ticket-chosen',
    dragClass: 'ticket-dragging',
    onEnd: (event) => this.drop(event),
  };

  /**
   * A ticket dropped in a column. SortableJS has moved its card; it goes back, and the board moves it as the tickets
   * say, so Angular and SortableJS don't both move the same card.
   */
  protected drop({ item, from, to, oldIndex, oldDraggableIndex, newDraggableIndex }: SortableEvent) {
    const siblings = [...from.children].filter((child) => child !== item);
    from.insertBefore(item, siblings[oldIndex ?? siblings.length] ?? null);
    if (from === to && oldDraggableIndex === newDraggableIndex) {
      return;
    }
    const column = to.dataset['column'] as TicketColumn;
    this.move(Number(item.dataset['ticket']), column, newDraggableIndex ?? 0);
  }

  /** Alt and the arrow keys move a ticket: left and right to the next column, up and down within its own. */
  protected onKeydown(event: KeyboardEvent, ticket: Ticket, column: TicketColumn, index: number) {
    if (!event.altKey || event.target !== event.currentTarget) {
      return;
    }
    const columns = this.columns.map((item) => item.id);
    const at = columns.indexOf(column);
    const moves: Record<string, [TicketColumn | undefined, number]> = {
      ArrowLeft: [columns[at - 1], 0],
      ArrowRight: [columns[at + 1], 0],
      ArrowUp: [column, index - 1],
      ArrowDown: [column, index + 1],
    };
    const [target, position] = moves[event.key] ?? [undefined, 0];
    if (!target || position < 0) {
      return;
    }
    event.preventDefault();
    this.move(ticket.id, target, position);
    // The card is drawn again in its new place; the focus follows it.
    afterNextRender(() => this.element.querySelector<HTMLElement>(`[data-ticket="${ticket.id}"]`)?.focus(), {
      injector: this.injector,
    });
  }

  /**
   * Moves a ticket to a column, to a place among the tickets the filters show there: before the one at `index`, or
   * after the last.
   */
  protected move(id: number, column: TicketColumn, index: number) {
    const shown = this.board().find((item) => item.id === column)?.tickets.filter((ticket) => ticket.id !== id) ?? [];
    this.tickets.update((tickets) => {
      const ticket = tickets.find((item) => item.id === id);
      if (!ticket) {
        return tickets;
      }
      const rest = tickets.filter((item) => item.id !== id);
      const before = shown[index];
      const last = shown.at(-1);
      const at = before ? rest.indexOf(before) : last ? rest.indexOf(last) + 1 : rest.length;
      rest.splice(at, 0, { ...ticket, column });
      return rest;
    });
  }

  async open() {
    const dialog = this.dialogs.open<HubNewTicketComponent, NewTicket>(HubNewTicketComponent);
    const ticket = await firstValueFrom(dialog.onClose);
    if (!ticket) {
      return;
    }
    const id = Math.max(...this.tickets().map((item) => item.id)) + 1;
    this.tickets.update((tickets) => [{ id, column: 'open', comments: 0, ...ticket }, ...tickets]);
    this.toastr.success(`#${id} is open. IT replies within a working day.`, 'Ticket opened');
  }
}
