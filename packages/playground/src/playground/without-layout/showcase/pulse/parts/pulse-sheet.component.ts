import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { NbButtonComponent, NbDialogRef, NbIconComponent, NbTagComponent } from '@liquid-js/lyr-core';

import { PulsePlanItem } from '../pulse-data';

/**
 * A planned item's details, in a sheet that slides up from the bottom of the screen, under the thumb: glass over the
 * screen, a handle to pull, the item's figures, and what to do about it. It's a dialog, so it keeps focus and closes on
 * Escape or a tap outside, placed at the bottom by its own styles.
 */
@Component({
  selector: 'npg-pulse-sheet',
  template: `
    <div class="handle" aria-hidden="true"></div>
    <header class="head">
      <span class="tile" [class]="'tile status-' + item().status"><nb-icon [icon]="item().icon" /></span>
      <div>
        <h2 class="title">{{ item().title }}</h2>
        <p class="when">{{ item().time }} · {{ item().duration }}</p>
      </div>
      @if (item().done) {
        <nb-tag status="success" appearance="filled" size="tiny" text="Done" />
      }
    </header>
    <p class="description">{{ item().description }}</p>
    <dl class="details">
      @for (detail of item().details; track detail.label) {
        <div>
          <dt>{{ detail.label }}</dt>
          <dd>{{ detail.value }}</dd>
        </div>
      }
    </dl>
    <div class="actions">
      @if (item().done) {
        <button nbButton fullWidth status="basic" appearance="outline" type="button" (click)="ref.close()">Close</button>
      } @else {
        <button nbButton fullWidth status="basic" appearance="ghost" type="button" (click)="ref.close()">Later</button>
        <button nbButton fullWidth status="primary" type="button" cdkFocusInitial (click)="start()">
          <nb-icon icon="play-circle-outline" />
          Start now
        </button>
      }
    </div>
  `,
  styles: `
    // The sheet itself is fixed to the bottom of the screen; the dialog's pane, centred by the service, has no size.
    :host {
      position: fixed;
      inset-block-end: 0;
      inset-inline: 0;
      display: block;
      max-width: 36rem;
      margin: 0 auto;
      padding: 0.75rem 1.5rem calc(1.5rem + env(safe-area-inset-bottom));
      border: 1px solid var(--border-basic-color-4);
      border-bottom: 0;
      border-radius: var(--dialog-border-radius) var(--dialog-border-radius) 0 0;
      background: color-mix(in srgb, var(--dialog-background-color) 82%, transparent);
      box-shadow: var(--dialog-shadow);
      backdrop-filter: blur(24px) saturate(140%);
      -webkit-backdrop-filter: blur(24px) saturate(140%);
      animation: rise 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);

      @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
        background: var(--dialog-background-color);
      }

      @media (prefers-reduced-motion: reduce) {
        animation: none;
      }
    }

    @keyframes rise {
      from {
        transform: translateY(2rem);
        opacity: 0;
      }
    }

    .handle {
      width: 2.5rem;
      height: 0.3125rem;
      margin: 0 auto 1.25rem;
      border-radius: 999px;
      background: var(--border-basic-color-5);
    }

    .head {
      display: flex;
      align-items: center;
      gap: 0.875rem;

      > div {
        flex: 1;
      }
    }

    .tile {
      display: inline-flex;
      flex: none;
      align-items: center;
      justify-content: center;
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 50%;
      font-size: 1.375rem;

      &.status-primary {
        background: var(--color-primary-transparent-200);
        color: var(--color-primary-default);
      }

      &.status-info {
        background: var(--color-info-transparent-200);
        color: var(--color-info-default);
      }

      &.status-warning {
        background: var(--color-warning-transparent-200);
        color: var(--color-warning-default);
      }
    }

    .title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .when {
      margin: 0.125rem 0 0;
      color: var(--text-hint-color);
      font-size: 0.8125rem;
    }

    .description {
      margin: 1rem 0;
      color: var(--text-basic-color);
      font-size: 0.9375rem;
      line-height: 1.5;
    }

    // The figures in a row of tinted cells, with their labels under them.
    .details {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.5rem;
      margin: 0 0 1.25rem;

      div {
        padding: 0.75rem;
        border-radius: 1rem;
        background: var(--background-basic-color-2);
      }

      dt {
        color: var(--text-hint-color);
        font-size: 0.6875rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      dd {
        margin: 0.25rem 0 0;
        font-size: 0.9375rem;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
      }
    }

    .actions {
      display: flex;
      gap: 0.75rem;
    }
  `,
  imports: [NbButtonComponent, NbIconComponent, NbTagComponent],
})
export class PulseSheetComponent {
  protected readonly ref = inject<NbDialogRef<PulseSheetComponent>>(NbDialogRef);
  private readonly router = inject(Router);

  /** The planned item the sheet is about. */
  readonly item = input.required<PulsePlanItem>();

  /** Starts the item as a workout: closes the sheet and goes to the session. */
  start() {
    this.ref.close();
    void this.router.navigateByUrl(this.router.url.replace(/\/today(\?.*)?$/, '/workout$1'));
  }
}
