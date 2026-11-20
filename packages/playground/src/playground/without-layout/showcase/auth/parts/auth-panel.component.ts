import { Component, input } from '@angular/core';
import { NbIconComponent } from '@liquid-js/lyr-core';

import { illustration } from '../../shared/showcase-images';
import { ShowcaseLogoComponent } from '../../shared/showcase-logo.component';
import { ShowcaseLogoName } from '../../shared/showcase-logos';

/** What a sign-in page's frame shows beside or below it: a customer's quote, the plan's benefits, or a tagline. */
export type AuthPanel = 'quote' | 'benefits' | 'tagline';

/**
 * The words around a sign-in page: a customer's quote with their avatar, the plan's benefits or a tagline, and the
 * logos of customers. Its colours are the text's, so it suits a coloured panel, a photo or the page.
 */
@Component({
  selector: 'npg-auth-panel',
  template: `
    @switch (panel()) {
      @case ('quote') {
        <figure class="quote">
          <blockquote>“{{ quote.text }}”</blockquote>
          <figcaption>
            @if (avatar; as picture) {
              <img alt="" [src]="picture" />
            }
            <span>
              <strong>{{ quote.name }}</strong>
              <span class="role">{{ quote.role }}</span>
            </span>
          </figcaption>
        </figure>
      }
      @case ('benefits') {
        <h2 class="h4">Everything your team needs</h2>
        <ul class="benefits">
          @for (benefit of benefits; track benefit) {
            <li><nb-icon icon="checkmark-circle-2-outline" /> {{ benefit }}</li>
          }
        </ul>
      }
      @default {
        <h2 class="h4">Your customers, invoices and reports in one place.</h2>
      }
    }
    <div class="customers">
      <p class="caption-2">Trusted by teams at</p>
      <ul>
        @for (logo of logos; track logo.name) {
          <li><npg-showcase-logo colour="mono" [name]="logo.name" [label]="logo.label" /></li>
        }
      </ul>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      color: inherit;
    }

    // In the frame's colour, over the theme's own for lists and quotes.
    ul,
    li,
    blockquote,
    figcaption {
      color: inherit;
    }

    h2 {
      margin: 0;
      color: inherit;
    }

    .quote {
      margin: 0;

      blockquote {
        margin: 0 0 1.25rem;
        font-size: 1.25rem;
        line-height: 1.5;
      }

      figcaption {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      img {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        background-color: rgb(255 255 255 / 85%);
      }

      strong,
      .role {
        display: block;
      }

      .role {
        opacity: 0.8;
      }
    }

    .benefits {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin: 0;
      padding: 0;
      list-style: none;

      li {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        font-size: 1.0625rem;
      }

      nb-icon {
        flex: none;
      }
    }

    .customers {
      p {
        margin: 0 0 0.75rem;
        color: inherit;
        opacity: 0.75;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      ul {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 1rem 1.75rem;
        margin: 0;
        padding: 0;
        list-style: none;
        opacity: 0.85;
      }

      npg-showcase-logo {
        height: 1.5rem;
      }
    }
  `,
  imports: [NbIconComponent, ShowcaseLogoComponent],
})
export class AuthPanelComponent {
  readonly panel = input<AuthPanel>('tagline');

  protected readonly quote = {
    text: 'We closed a third more deals this quarter, and for once the whole team actually likes the tool.',
    name: 'Emma Brown',
    role: 'Head of Sales, Fabrikam',
  };
  protected readonly avatar = illustration('Emma Brown', 'notionists');
  protected readonly benefits = [
    'Unlimited customers and contacts',
    'Invoices that chase themselves',
    'Reports for the whole team',
    'Free for 14 days, no card needed',
  ];
  protected readonly logos: { name: ShowcaseLogoName; label: string }[] = [
    { name: 'northwind', label: 'Northwind' },
    { name: 'contoso', label: 'Contoso' },
    { name: 'tailspin', label: 'Tailspin' },
    { name: 'litware', label: 'Litware' },
  ];
}
