import { Component, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { NbLayoutColumnComponent, NbLayoutComponent } from '@liquid-js/lyr-core'

import { blogImage } from '../shared/showcase-images'
import { AuthPanel, AuthPanelComponent } from './parts/auth-panel.component'

/**
 * A bold frame for the sign-in pages: a photo filling the screen, the page's card frosted over it, and a word from a
 * customer on the photo.
 */
@Component({
    selector: 'npg-auth-studio-shell',
    template: `
    <nb-layout>
      <nb-layout-column class="column">
        <div class="photo" [style.background-image]="'url(' + photo + ')'">
          <main class="page">
            <router-outlet #outlet="outlet" (activate)="panel.set(outlet.activatedRouteData['panel'])" />
          </main>
          <npg-auth-panel class="on-photo" [panel]="panel()" />
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

    .photo {
      position: relative;
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 28rem);
      align-items: center;
      gap: 3rem;
      min-height: 100vh;
      padding: 3rem clamp(1rem, 6vw, 6rem);
      box-sizing: border-box;
      background-position: center;
      background-size: cover;

      // Darker towards the words, so they read on any part of the photo.
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, rgb(10 12 20 / 80%) 0%, rgb(10 12 20 / 45%) 60%, rgb(10 12 20 / 30%) 100%);
      }

      @media (max-width: 991.98px) {
        grid-template-columns: minmax(0, 1fr);
        justify-items: center;
      }
    }

    .page {
      position: relative;
      display: flex;
      justify-content: center;
      grid-column: 2;
      grid-row: 1;
      width: 100%;

      @media (max-width: 991.98px) {
        grid-column: 1;
      }

      // The page's card, frosted over the photo.
      ::ng-deep nb-card {
        border-color: rgb(255 255 255 / 25%);
        background-color: color-mix(in srgb, var(--card-background-color) 78%, transparent);
        backdrop-filter: blur(16px);
        box-shadow: 0 2rem 4rem rgb(0 0 0 / 35%);
      }
    }

    .on-photo {
      position: relative;
      grid-column: 1;
      grid-row: 1;
      max-width: 30rem;
      color: #ffffff;

      @media (max-width: 991.98px) {
        display: none;
      }

      ::ng-deep blockquote {
        font-family: var(--font-family-secondary);
        font-size: 1.75rem;
        line-height: 1.35;
      }

      ::ng-deep h2 {
        font-size: 2rem;
      }
    }
  `,
    imports: [AuthPanelComponent, NbLayoutComponent, NbLayoutColumnComponent, RouterOutlet]
})
export class AuthStudioShellComponent {
    protected readonly panel = signal<AuthPanel>('tagline')
    protected readonly photo = blogImage('team-laptops')
}
