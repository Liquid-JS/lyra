import { Component, signal, ViewEncapsulation } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NbProgressBarComponent, NbThemeModule } from '@liquid-js/lyr-core';

@Component({
  // The theme applies in an element with its class.
  template: `
    <div class="nb-theme-default">
      <nb-progress-bar class="ring" shape="ring" status="primary" [value]="value()" displayValue />
      <nb-progress-bar class="giant" shape="ring" size="giant" [value]="40"><b class="custom">2 of 5</b></nb-progress-bar>
      <nb-progress-bar class="bar" [value]="40"><b class="bar-custom">Uploading</b></nb-progress-bar>
    </div>
  `,
  styleUrl: './progress-ring.spec.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [NbProgressBarComponent],
})
class ProgressRingHostComponent {
  readonly value = signal(25);
}

describe('nb-progress-bar ring', () => {
  let fixture: ComponentFixture<ProgressRingHostComponent>;

  const element = (selector: string) => fixture.nativeElement.querySelector(selector) as HTMLElement;
  const rem = () => parseFloat(getComputedStyle(document.documentElement).fontSize);

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] });
    fixture = TestBed.createComponent(ProgressRingHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should draw a round ring of its size, filled to the value', () => {
    const ring = element('.ring .progress-ring');
    const rect = ring.getBoundingClientRect();
    expect(rect.width).toBeCloseTo(3.5 * rem(), 0);
    expect(rect.height).toBeCloseTo(rect.width, 0);
    expect(element('.giant .progress-ring').getBoundingClientRect().width).toBeCloseTo(6 * rem(), 0);
    expect(getComputedStyle(ring).getPropertyValue('--nb-progress').trim()).toBe('25');
    // The drawing gets the value, and the fill and track colours.
    const drawing = getComputedStyle(ring, '::before');
    expect(drawing.backgroundImage).toContain('conic-gradient');
    expect(drawing.backgroundImage).toContain('25%');
  });

  it('should show the value or custom content in the middle', () => {
    const ring = element('.ring .progress-ring').getBoundingClientRect();
    const text = element('.ring .progress-ring-content span').getBoundingClientRect();
    expect(element('.ring .progress-ring-content').textContent?.trim()).toBe('25%');
    expect(text.left + text.width / 2).toBeCloseTo(ring.left + ring.width / 2, 0);
    expect(text.top + text.height / 2).toBeCloseTo(ring.top + ring.height / 2, 0);
    expect(element('.giant .progress-ring-content .custom').textContent).toBe('2 of 5');
    // The bar shape still shows its content.
    expect(element('.bar .progress-value .bar-custom').textContent).toBe('Uploading');
  });

  it('should be a progress bar for assistive technologies, and follow the value', async () => {
    const host = element('.ring');
    expect(host.getAttribute('role')).toBe('progressbar');
    expect(host.getAttribute('aria-valuenow')).toBe('25');
    fixture.componentInstance.value.set(80);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(host.getAttribute('aria-valuenow')).toBe('80');
    expect(element('.ring .progress-ring').style.getPropertyValue('--nb-progress')).toBe('80');
  });
});
