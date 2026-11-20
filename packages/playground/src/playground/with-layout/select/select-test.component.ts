import { Component } from '@angular/core'
import { NbComponentSize, NbSelectComponent } from '@liquid-js/lyr-core'

@Component({
    templateUrl: './select-test.component.html',
    styles: [
        `
      nb-select {
        display: block;
      }
    `
    ],
    imports: [NbSelectComponent]
})
export class SelectTestComponent {
    sizes: NbComponentSize[] = ['tiny', 'small', 'medium', 'large', 'giant']
}
