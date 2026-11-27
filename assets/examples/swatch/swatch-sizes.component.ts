import { Component } from '@angular/core'
import { NbCardModule, NbSwatchModule, type NbComponentShape, type NbComponentSize } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-swatch-sizes',
    template: `
    <nb-card>
      <nb-card-body class="rows">
        @for (size of sizes; track size) {
        <nb-swatch-group [size]="size" [attr.aria-label]="'Finish, ' + size" value="oak">
          <nb-swatch value="oak" label="Oak" color="#b98a5a" />
          <nb-swatch value="walnut" label="Walnut" color="#5b3a24" />
          <nb-swatch value="terrazzo" label="Terrazzo" image="assets/showcase/swatches/terrazzo.svg" />
        </nb-swatch-group>
        }
        @for (shape of shapes; track shape) {
        <nb-swatch-group size="large" [shape]="shape" [attr.aria-label]="'Finish, ' + shape" value="oak">
          <nb-swatch value="oak" label="Oak" color="#b98a5a" />
          <nb-swatch value="walnut" label="Walnut" color="#5b3a24" />
          <nb-swatch value="terrazzo" label="Terrazzo" image="assets/showcase/swatches/terrazzo.svg" />
        </nb-swatch-group>
        }
      </nb-card-body>
    </nb-card>
  `,
    styles: `
    .rows {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
  `,
    imports: [NbCardModule, NbSwatchModule]
})
export class SwatchSizesComponent {
    readonly sizes: NbComponentSize[] = ['tiny', 'small', 'medium', 'large', 'giant']
    readonly shapes: NbComponentShape[] = ['round', 'semi-round', 'rectangle']
}
