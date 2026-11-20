import { Component } from '@angular/core'

import { NgdExampleAppCardComponent } from './example-app-card.component'
import { EXAMPLE_APPS } from './example-apps'

/** The example apps, each in the theme it looks best in, a picture of each screen linking to it. */
@Component({
    selector: 'ngd-example-gallery-block',
    template: `
    <p class="intro">
      Whole screens built with Lyra's components, each in a theme that suits it. Open one to use it, see its code, or
      change its theme and component defaults and watch the screen follow.
    </p>
    <div class="apps">
      @for (app of apps; track app.id) {
        <ngd-example-app-card [app]="app" />
      }
    </div>
    <h2 class="h4 showcase-title">Showcase</h2>
    <p class="intro">
      The same screens in themes made for them, to show how far a theme goes. Customise one to start a theme of your
      own from it.
    </p>
    <div class="apps">
      @for (app of showcase; track app.id) {
        <ngd-example-app-card [app]="app" />
      }
    </div>
  `,
    styles: `
    :host {
      display: block;
    }

    // Outside the cards, in line with their text.
    .intro {
      max-width: 40rem;
      margin-bottom: 2rem;
      padding-inline: var(--ngd-edge-inset, 0);
    }

    .showcase-title {
      margin: 3rem 0 0.5rem;
      padding-inline: var(--ngd-edge-inset, 0);
    }

    .apps {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
      gap: 1.5rem;
    }
  `,
    imports: [NgdExampleAppCardComponent]
})
export class NgdExampleGalleryBlockComponent {
    protected readonly apps = EXAMPLE_APPS.filter(({ showcase }) => !showcase)
    /** The apps in themes of their own. */
    protected readonly showcase = EXAMPLE_APPS.filter(({ showcase }) => showcase)
}
