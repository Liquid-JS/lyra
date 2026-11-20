import { Component, signal } from '@angular/core';
import { NbButtonModule, NbCardModule, NbPageIndicatorModule } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-page-indicator-showcase',
  templateUrl: './page-indicator-showcase.component.html',
  styles: `
    nb-card {
      max-width: 24rem;
    }

    .slide {
      min-height: 5rem;
    }

    nb-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  `,
  imports: [NbCardModule, NbButtonModule, NbPageIndicatorModule],
})
export class PageIndicatorShowcaseComponent {
  readonly slides = [
    { title: 'Welcome', text: 'Set up your workspace in a few steps.' },
    { title: 'Invite your team', text: 'Add the people you work with, by email.' },
    { title: 'Connect your tools', text: 'Bring in your calendar and files.' },
    { title: 'All set', text: 'You can change all of this later in Settings.' },
  ];

  readonly page = signal(0);

  move(by: number) {
    this.page.update((page) => Math.min(this.slides.length - 1, Math.max(0, page + by)));
  }
}
