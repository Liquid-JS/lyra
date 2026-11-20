import { Component } from '@angular/core';
import { NbButtonModule, NbCardModule, NbDividerModule } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-divider-showcase',
  templateUrl: './divider-showcase.component.html',
  styles: `
    .sign-in {
      display: flex;
      flex-direction: column;
      max-width: 20rem;
      margin-block: 1.5rem;
    }

    .links {
      display: flex;
      align-items: center;
    }
  `,
  imports: [NbCardModule, NbButtonModule, NbDividerModule],
})
export class DividerShowcaseComponent {}
