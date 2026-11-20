import { Component, TemplateRef, inject, viewChild } from '@angular/core';
import { NbWindowService, NbButtonComponent } from '@liquid-js/lyr-core';

@Component({
  templateUrl: './window-template-title.component.html',
  imports: [NbButtonComponent],
})
export class WindowTemplateTitleComponent {
  private readonly windowService = inject(NbWindowService);

  readonly titleTemplate = viewChild.required<TemplateRef<any>>('titleTemplate');
  readonly contentTemplate = viewChild.required<TemplateRef<any>>('contentTemplate');

  openWindow() {
    this.windowService.open(this.contentTemplate(), {
      titleTemplate: this.titleTemplate(),
      titleTemplateContext: { text: 'some text to pass into template' },
    });
  }
}
