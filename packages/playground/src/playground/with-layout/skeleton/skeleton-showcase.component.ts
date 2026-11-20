import { Component, signal } from '@angular/core'
import { NbButtonModule, NbCardModule, NbSkeletonModule } from '@liquid-js/lyr-core'

interface Profile {
    name: string
    initials: string
    role: string
    bio: string
}

@Component({
    selector: 'nb-skeleton-showcase',
    templateUrl: './skeleton-showcase.component.html',
    styles: `
    .profile {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background: var(--color-primary-default);
      color: var(--text-control-color);
    }

    h3 {
      margin: 0;
    }

    p {
      margin: 0.5rem 0 0;
    }
  `,
    imports: [NbCardModule, NbButtonModule, NbSkeletonModule]
})
export class SkeletonShowcaseComponent {
    readonly profile = signal<Profile | undefined>(undefined)

    /** What a profile looks like while it loads. */
    readonly sample: Profile = {
        name: 'Jane Doe',
        initials: 'JD',
        role: 'Product designer',
        bio: 'Designs the onboarding and billing pages, and looks after the design system and its documentation.'
    }

    constructor() {
        this.reload()
    }

    reload() {
        this.profile.set(undefined)
        setTimeout(
            () =>
                this.profile.set({
                    name: 'Alex Smith',
                    initials: 'AS',
                    role: 'Support engineer',
                    bio: 'Answers questions about accounts and invoices, and writes the help centre articles on billing.'
                }),
            2000
        )
    }
}
