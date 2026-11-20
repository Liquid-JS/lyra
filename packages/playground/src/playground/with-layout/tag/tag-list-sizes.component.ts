import { Component } from '@angular/core';
import {
  NbCardBodyComponent,
  NbCardComponent,
  NbComponentSize,
  NbTagComponent,
  NbTagInputAddEvent,
  NbTagInputDirective,
  NbTagListComponent,
} from '@liquid-js/lyr-core';

@Component({
  templateUrl: './tag-list-sizes.component.html',
  imports: [NbCardComponent, NbCardBodyComponent, NbTagListComponent, NbTagComponent, NbTagInputDirective],
})
export class TagListSizesComponent {
  readonly sizes: NbComponentSize[] = ['tiny', 'small', 'medium', 'large', 'giant'];
  readonly tags: Record<NbComponentSize, Set<string>> = {
    tiny: new Set(['Design']),
    small: new Set(['Design']),
    medium: new Set(['Design']),
    large: new Set(['Design']),
    giant: new Set(['Design']),
  };

  onTagRemove(size: NbComponentSize, tag: NbTagComponent) {
    const text = tag.text();
    if (text !== undefined) {
      this.tags[size].delete(text);
    }
  }

  onTagAdd(size: NbComponentSize, { value, input }: NbTagInputAddEvent) {
    if (value) {
      this.tags[size].add(value);
    }
    input.nativeElement.value = '';
  }
}
