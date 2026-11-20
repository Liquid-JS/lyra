import { NgModule } from '@angular/core';
import { NbInputDirective } from './input.directive';
import { NbNumberInputDirective } from './number-input.directive';

const NB_INPUT_COMPONENTS = [
  NbInputDirective,
  NbNumberInputDirective,
];

@NgModule({
  imports: [...NB_INPUT_COMPONENTS],
  exports: NB_INPUT_COMPONENTS,
})
export class NbInputModule {}
