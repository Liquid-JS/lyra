import { ChangeDetectionStrategy, Component, viewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'nb-windows-container',
  template: `<ng-container #viewContainerRef />`,
  styleUrls: ['./windows-container.component.scss'],
  // Hosted content may not use signals, so it's checked on every change detection.
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class NbWindowsContainerComponent {
  readonly viewContainerRef = viewChild.required('viewContainerRef', { read: ViewContainerRef });
}
