import { Component, computed, signal } from '@angular/core'
import { NbButtonModule, NbCardModule, NbSwatchModule } from '@liquid-js/lyr-core'

interface Finish {
    value: string
    label: string
    color?: string | string[]
    image?: string
    inStock: boolean
}

@Component({
    selector: 'nb-swatch-showcase',
    templateUrl: './swatch-showcase.component.html',
    styles: `
    nb-card {
      max-width: 24rem;
    }

    .chosen {
      margin-block-end: 0.75rem;
    }

    .stock {
      margin-block: 1rem 0;
    }
  `,
    imports: [NbCardModule, NbButtonModule, NbSwatchModule]
})
export class SwatchShowcaseComponent {
    readonly finishes: Finish[] = [
        { value: 'navy', label: 'Navy', color: '#1f2a44', inStock: true },
        { value: 'sand', label: 'Sand', color: '#d8c6a5', inStock: true },
        { value: 'black-white', label: 'Black/White', color: ['#1d1d1f', '#ffffff'], inStock: true },
        { value: 'sunset', label: 'Sunset stripe', color: ['#e4572e', '#f3a712', '#29335c'], inStock: true },
        { value: 'tartan', label: 'Tartan', image: 'assets/showcase/swatches/tartan.svg', inStock: false },
        { value: 'linen', label: 'Natural linen', image: 'assets/showcase/swatches/linen.svg', inStock: true }
    ]

    readonly finish = signal<string | null>('black-white')
    readonly chosen = computed(() => this.finishes.find((finish) => finish.value === this.finish()))
}
