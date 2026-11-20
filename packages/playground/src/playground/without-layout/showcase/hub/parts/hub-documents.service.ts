import { Injectable, signal } from '@angular/core';

import { Document, DOCUMENTS } from '../hub-data';

/** The documents, newest first, with the ones added while the app is open. */
@Injectable({ providedIn: 'root' })
export class HubDocumentsService {
  readonly files = signal<Document[]>(DOCUMENTS);

  private next = 1000;

  /** Adds documents at the top, and gives them ids. */
  add(...documents: Omit<Document, 'id'>[]) {
    this.files.update((current) => [...documents.map((document) => ({ ...document, id: this.next++ })), ...current]);
  }
}
