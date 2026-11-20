import { Component } from '@angular/core';
import {
  NbTagComponent,
  NbTagInputAddEvent,
  NbCardComponent,
  NbCardBodyComponent,
  NbTagListComponent,
  NbTagComponent as NbTagComponent_1,
  NbTagInputDirective,
} from '@liquid-js/lyr-core';

import { trees } from './trees-list';

@Component({
  templateUrl: './tag-input.component.html',
  imports: [
    NbCardComponent,
    NbCardBodyComponent,
    NbTagListComponent,
    NbTagComponent_1,
    NbTagInputDirective,
  ],
})
export class TagInputComponent {

  trees: Set<string> = new Set([trees[3]]);

  onTagRemove(tagToRemove: NbTagComponent) {
    const text = tagToRemove.text();
    if (text !== undefined) {
      this.trees.delete(text);
    }
  }

  onTagAdd({ value, input }: NbTagInputAddEvent) {
    if (value) {
      this.trees.add(value);
    }
    input.nativeElement.value = '';
  }
}
