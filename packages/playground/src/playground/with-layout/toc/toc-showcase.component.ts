import { Component } from '@angular/core'
import { NbCardBodyComponent, NbCardComponent, NbTocComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-toc-showcase',
    templateUrl: './toc-showcase.component.html',
    styleUrls: ['./toc-showcase.component.scss'],
    imports: [NbCardComponent, NbCardBodyComponent, NbTocComponent]
})
export class TocShowcaseComponent {}
