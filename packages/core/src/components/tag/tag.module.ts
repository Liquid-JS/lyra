import { NgModule } from '@angular/core';

import { NbIconModule } from '@liquid-js/lyr-core/icon';
import { NbTagComponent } from './tag.component';
import { NbTagListComponent } from './tag-list.component';
import { NbTagInputDirective } from './tag-input.directive';

@NgModule({
  imports: [
    NbIconModule,
    NbTagComponent,
    NbTagListComponent,
    NbTagInputDirective,
  ],
  exports: [NbTagComponent, NbTagListComponent, NbTagInputDirective],
})
export class NbTagModule { }
