import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NbTabsetComponent, NbTabComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-tabset-test',
  styles: [
    `
      nb-tabset {
        margin-bottom: 40px;
      }
    `,
  ],
  templateUrl: './tabset-test.component.html',
  imports: [NbTabsetComponent, NbTabComponent],
})
export class TabsetTestComponent {
  private readonly router = inject(Router);

  tabChange($event: any) {
    void this.router.navigate(['tabset', 'tabset-test.component', $event.route]);
  }
}
