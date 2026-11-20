import { Component, signal } from '@angular/core'
import { NbButtonModule, NbCardModule, NbComponentSize, NbProgressBarComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-progress-bar-ring',
    templateUrl: './progress-bar-ring.component.html',
    styles: `
    .rings {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1.5rem;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1.5rem;
    }

    .steps {
      display: flex;
      flex-direction: column;
    }
  `,
    imports: [NbCardModule, NbButtonModule, NbProgressBarComponent]
})
export class ProgressBarRingComponent {
    readonly value = signal(40)
    readonly sizes: NbComponentSize[] = ['tiny', 'small', 'medium', 'large', 'giant']

    change(by: number) {
        this.value.update((value) => Math.min(100, Math.max(0, value + by)))
    }
}
