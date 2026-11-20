import { Component, computed, input } from '@angular/core';
import { NgdPreparedComponent } from '../../../docs.model';
import { NbCardComponent, NbCardBodyComponent } from '@liquid-js/lyr-core';
import { NgdFragmentTargetDirective } from '../../../@theme/components/fragment-target/fragment-target.directive';
import { NgdMarkdownComponent } from '../../../@theme/components/markdown/markdown.component';
import { NgdLiveExampleBlockComponent } from '../live-example-block/live-example-block.component';
import { NgdInlineExampleBlockComponent } from '../inline-example-block/inline-example-block.component';
import { NgdStackedExampleComponent } from '../stacked-example-block/stacked-examples.component';

@Component({
  selector: 'ngd-overview-block',
  templateUrl: './overview-block.component.html',
  imports: [
    NgdMarkdownComponent,
    NbCardComponent,
    NgdFragmentTargetDirective,
    NbCardBodyComponent,
    NgdLiveExampleBlockComponent,
    NgdInlineExampleBlockComponent,
    NgdStackedExampleComponent,
  ],
})
export class NgdOverviewBlockComponent {

  readonly source = input.required<NgdPreparedComponent>();

  readonly overview = computed(() => this.source().overview);
}
