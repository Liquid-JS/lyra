import { NgModule } from '@angular/core';
import { NbSpinnerComponent } from './spinner.component';
import { NbSpinnerDirective } from './spinner.directive';

@NgModule({
  imports: [NbSpinnerComponent, NbSpinnerDirective],
  exports: [NbSpinnerComponent, NbSpinnerDirective],
})
export class NbSpinnerModule {}
