import { Component, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { NbLayoutColumnComponent, NbLayoutComponent } from '@liquid-js/lyr-core'

import { AuthPanel, AuthPanelComponent } from './parts/auth-panel.component'

/**
 * A light, friendly frame for the sign-in pages: the page's card on soft shapes in the theme's colours, with a word
 * from a customer below it.
 */
@Component({
    selector: 'npg-auth-pastel-shell',
    template: `
    <nb-layout>
      <nb-layout-column class="column">
        <div class="ground">
          <span class="shape one"></span>
          <span class="shape two"></span>
          <span class="shape three"></span>
          <main class="page">
            <router-outlet #outlet="outlet" (activate)="panel.set(outlet.activatedRouteData['panel'])" />
          </main>
          <npg-auth-panel class="below" [panel]="panel()" />
        </div>
      </nb-layout-column>
    </nb-layout>
  `,
    styles: `
    // The frame fills the screen, without the layout's padding at any width.
    nb-layout {
      --layout-padding: 0;
      --layout-medium-padding: 0;
      --layout-small-padding: 0;
    }

    .ground {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3rem;
      min-height: 100vh;
      overflow: hidden;
      padding: 3rem 1rem;
      box-sizing: border-box;
      background-color: var(--background-basic-color-2);
    }

    // Soft blobs of the theme's colours behind the card, painted as gradients: solid to --solid of the radius, half at
    // --half, then gone. A blur filter would look the same, but Safari leaves stale paint of a filtered layer when the
    // card under it changes size.
    .shape {
      position: absolute;
      aspect-ratio: 1;
      background: radial-gradient(
        circle closest-side,
        color-mix(in srgb, var(--color) 70%, transparent) var(--solid),
        var(--half),
        transparent
      );

      &.one {
        --color: var(--color-primary-300);
        --solid: 38%;
        --half: 62%;

        inset-block-start: -15.5rem;
        inset-inline-start: -13.5rem;
        width: 43rem;
      }

      &.two {
        --color: var(--color-info-300);
        --solid: 42%;
        --half: 66%;

        inset-block-end: -17.5rem;
        inset-inline-end: -15.5rem;
        width: 47rem;
      }

      &.three {
        --color: var(--color-warning-200);
        --solid: 0%;
        --half: 48%;

        inset-block-start: calc(40% - 7.5rem);
        inset-inline-end: calc(20% - 7.5rem);
        width: 29rem;
      }
    }

    .page {
      position: relative;
      display: flex;
      justify-content: center;
      width: 100%;
    }

    .below {
      position: relative;
      width: 100%;
      max-width: 28rem;
      color: var(--text-basic-color);
      text-align: center;

      ::ng-deep figcaption,
      ::ng-deep .customers ul,
      ::ng-deep .benefits li {
        justify-content: center;
      }

      ::ng-deep blockquote {
        font-size: 1.0625rem;
      }
    }
  `,
    imports: [AuthPanelComponent, NbLayoutComponent, NbLayoutColumnComponent, RouterOutlet]
})
export class AuthPastelShellComponent {
    protected readonly panel = signal<AuthPanel>('tagline')
}
