import { NgModule } from '@angular/core'
import { NbInputDirective } from './input.directive'
import { NbNumberInputDirective } from './number-input.directive'
import { NbTextareaAutosizeDirective } from './textarea-autosize.directive'

const NB_INPUT_COMPONENTS = [
    NbInputDirective,
    NbNumberInputDirective,
    NbTextareaAutosizeDirective
]

@NgModule({
    imports: [...NB_INPUT_COMPONENTS],
    exports: NB_INPUT_COMPONENTS
})
export class NbInputModule {}
