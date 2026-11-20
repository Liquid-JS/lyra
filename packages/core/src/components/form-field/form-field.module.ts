import { NgModule } from '@angular/core';

import { NbFormFieldComponent } from './form-field.component';
import { NbPrefixDirective } from './prefix.directive';
import { NbSuffixDirective } from './suffix.directive';

const COMPONENTS = [
  NbFormFieldComponent,
  NbPrefixDirective,
  NbSuffixDirective,
];

@NgModule({
  imports: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class NbFormFieldModule {
}
