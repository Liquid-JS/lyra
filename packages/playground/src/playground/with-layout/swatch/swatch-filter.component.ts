import { Component, computed, signal } from '@angular/core'
import { NbCardModule, NbSwatchModule } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-swatch-filter',
    template: `
    <nb-card>
      <nb-card-body>
        <p class="label">Colour</p>
        <nb-swatch-group multiple
          size="small"
          aria-label="Colour"
          max="6"
          [(value)]="colours">
          @for (colour of palette; track colour.value) {
          <nb-swatch [value]="colour.value" [label]="colour.label" [color]="colour.color" />
          }
        </nb-swatch-group>
        <p class="caption">{{ summary() }}</p>
      </nb-card-body>
    </nb-card>
  `,
    styles: `
    nb-card {
      max-width: 20rem;
    }

    .label {
      margin-block-end: 0.5rem;
    }

    .caption {
      margin-block: 0.75rem 0;
    }
  `,
    imports: [NbCardModule, NbSwatchModule]
})
export class SwatchFilterComponent {
    readonly palette = [
        { value: 'black', label: 'Black', color: '#1d1d1f' },
        { value: 'white', label: 'White', color: '#ffffff' },
        { value: 'grey', label: 'Grey', color: '#8a8f98' },
        { value: 'navy', label: 'Navy', color: '#1f2a44' },
        { value: 'red', label: 'Red', color: '#c8102e' },
        { value: 'green', label: 'Green', color: '#2e7d4f' },
        { value: 'yellow', label: 'Yellow', color: '#f2c94c' },
        { value: 'pink', label: 'Pink', color: '#f4a6c0' },
        { value: 'multi', label: 'Multicolour', color: ['#e4572e', '#f3a712', '#29335c', '#2e7d4f'] }
    ]

    readonly colours = signal<string[]>(['navy'])
    readonly summary = computed(() => {
        const chosen = this.palette.filter((colour) => this.colours().includes(colour.value)).map((colour) => colour.label)
        return chosen.length ? `Showing ${chosen.join(', ')}` : 'Showing every colour'
    })
}
