import { NgModule } from '@angular/core';
import { NbOptionComponent } from './option.component';
import { NbOptionGroupComponent } from './option-group.component';
import { NbOptionNestedComponent } from './option-nested.component';
import { NbOptionListComponent } from './option-list.component';
import { NbCheckboxModule } from '@liquid-js/lyr-core/checkbox';

const NB_OPTION_LIST_COMPONENTS = [
  NbOptionListComponent,
  NbOptionComponent,
  NbOptionGroupComponent,
  NbOptionNestedComponent,
];

@NgModule({
  imports: [NbCheckboxModule, ...NB_OPTION_LIST_COMPONENTS],
  exports: [...NB_OPTION_LIST_COMPONENTS],
})
export class NbOptionModule { }
