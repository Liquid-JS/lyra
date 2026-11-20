import { Component, computed, inject, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { map } from 'rxjs'
import { NbButtonModule, NbCardModule } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-card-interactive',
    templateUrl: './card-interactive.component.html',
    styles: `
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
      gap: 1rem;
    }
  `,
    imports: [RouterLink, NbCardModule, NbButtonModule]
})
export class CardInteractiveComponent {
    readonly plans = [
        { id: 'free', name: 'Free', description: 'For one person trying things out.' },
        { id: 'team', name: 'Team', description: 'For up to 20 people working together.' },
        { id: 'business', name: 'Business', description: 'For companies with many teams.' }
    ]

    readonly planId = toSignal(inject(ActivatedRoute).queryParamMap.pipe(map((params) => params.get('plan'))))
    readonly chosen = computed(() => this.plans.find((plan) => plan.id === this.planId())?.name)
    readonly compared = signal<string | undefined>(undefined)
}
