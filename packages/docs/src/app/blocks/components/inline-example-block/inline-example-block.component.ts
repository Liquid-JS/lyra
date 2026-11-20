import { Component, input } from '@angular/core';
import { NgdExampleBlockComponent } from '../example-block/example-block.component';
import { NgdTabbedExampleBlockComponent } from '../tabbed-example-block/tabbed-example-block.component';
import { NgdExampleContent } from '../../../docs.model';

@Component({
  selector: 'ngd-inline-example-block',
  templateUrl: './inline-example-block.component.html',
  imports: [NgdExampleBlockComponent, NgdTabbedExampleBlockComponent],
})
export class NgdInlineExampleBlockComponent {

  readonly content = input.required<NgdExampleContent>();

  get isOneFile(): boolean {
    return !this.isTabbed;
  }

  get isTabbed(): boolean {
    return this.content().files.length > 1;
  }
}
