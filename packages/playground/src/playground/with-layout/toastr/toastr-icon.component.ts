import { Component, inject } from '@angular/core';
import { NbToastrService, NbIconConfig, NbButtonComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-toastr-icon',
  templateUrl: './toastr-icon.component.html',
  styles: [
    `
      ::ng-deep nb-layout-column {
        height: 80vw;
      }
    `,
  ],
  host: { class: 'example-items-rows' },
  imports: [NbButtonComponent],
})
export class ToastrIconComponent {
  private readonly toastrService = inject(NbToastrService);

  private index = 0;

  showDefaultIcon() {
    this.toastrService.show('Message', `Toast: ${++this.index}`);
  }

  showToast(iconName: string) {
    const iconConfig: NbIconConfig = { icon: iconName, pack: 'icons' };
    this.toastrService.show('Message', `Toast: ${++this.index}`, iconConfig);
  }
}
