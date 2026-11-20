import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NbLayoutColumnComponent, NbLayoutComponent } from '@liquid-js/lyr-core';

import { SiteMockupComponent } from '../site/site-mockup.component';
import { AuthPanel, AuthPanelComponent } from './parts/auth-panel.component';

/**
 * The frame of an app's sign-in pages, split in two: the page on one side, and on the other a panel in the theme's
 * colours with a picture of the app and a word from a customer. Phones show the page only.
 */
@Component({
  selector: 'npg-auth-shell',
  template: `
    <nb-layout>
      <nb-layout-column class="column">
        <div class="split">
          <main class="page">
            <router-outlet #outlet="outlet" (activate)="panel.set(outlet.activatedRouteData['panel'])" />
          </main>
          <aside class="panel">
            <div class="panel-content">
              <npg-site-mockup class="mockup" />
              <npg-auth-panel [panel]="panel()" />
            </div>
          </aside>
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

    .split {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
      min-height: 100vh;

      @media (max-width: 991.98px) {
        grid-template-columns: minmax(0, 1fr);
      }
    }

    .page {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem 1.5rem;
    }

    .panel {
      position: relative;
      display: flex;
      align-items: center;
      overflow: hidden;
      padding: 3rem clamp(2rem, 5vw, 5rem);
      background: linear-gradient(
        150deg,
        var(--color-primary-600) 0%,
        var(--color-primary-500) 45%,
        var(--color-info-400) 100%
      );
      color: var(--text-control-color);

      @media (max-width: 991.98px) {
        display: none;
      }

      // Soft light in a corner, for depth.
      &::before {
        content: '';
        position: absolute;
        inset-block-start: -30%;
        inset-inline-end: -20%;
        width: 70%;
        aspect-ratio: 1;
        border-radius: 50%;
        background: radial-gradient(circle, rgb(255 255 255 / 22%), transparent 70%);
      }
    }

    .panel-content {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
      width: 100%;
      max-width: 34rem;
    }

    .mockup {
      display: block;
      box-shadow: 0 1.5rem 3rem rgb(0 0 0 / 25%);
      border-radius: var(--border-radius);
    }
  `,
  imports: [AuthPanelComponent, NbLayoutComponent, NbLayoutColumnComponent, RouterOutlet, SiteMockupComponent],
})
export class AuthShellComponent {
  protected readonly panel = signal<AuthPanel>('tagline');
}
