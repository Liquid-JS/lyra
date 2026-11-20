import { inject, Service } from '@angular/core';
import { EMPTY, Observable, fromEvent as observableFromEvent } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { NB_WINDOW } from '@liquid-js/lyr-core';

/** A message between a docs page and an example's iframe; `id` names the example. */
export type NgdIframeMessage<T extends object> = T & { id: string };

@Service()
export class NgdIframeCommunicatorService {
  private readonly window = inject(NB_WINDOW);

  send<T extends object>(payload: NgdIframeMessage<T>, target = this.window?.parent) {
    if (target && target !== this.window) {
      target.postMessage(payload, '*');
    }
  }

  /** The messages for the example; their payload is what the other side sends, unchecked. */
  receive<T extends object>(id: string): Observable<NgdIframeMessage<T>> {
    // Outside the browser, no messages come.
    if (!this.window) {
      return EMPTY;
    }
    return observableFromEvent<MessageEvent<unknown>>(this.window, 'message')
      .pipe(
        filter((msg): msg is MessageEvent<NgdIframeMessage<T>> =>
          typeof msg.data === 'object' && msg.data !== null && 'id' in msg.data && msg.data.id === id),
        map((msg) => msg.data),
      );
  }
}
