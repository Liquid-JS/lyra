import { Component, signal, ViewEncapsulation } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  NbComponentSize,
  NbSliderComponent,
  NbSliderModule,
  NbSliderRange,
  NbSliderValue,
  NbThemeModule,
  NbValidationModule,
  provideNbComponentDefaults,
} from '@liquid-js/lyr-core';

@Component({
  // The theme applies in an element with its class.
  template: `
    <div class="nb-theme-default" [attr.dir]="dir()" style="width: 20rem">
      <label nbLabel [for]="volumeField">Volume</label>
      <nb-slider
        class="volume"
        [min]="0"
        [max]="100"
        [step]="10"
        ticks
        [formatValue]="percent"
        [formControl]="volume"
        nbValidation
        #volumeField="nbValidation"
      />

      <label nbLabel class="price-label" [for]="priceField">Price</label>
      <nb-slider class="price" range [min]="0" [max]="500" [step]="10" [formControl]="price" nbValidation #priceField="nbValidation" />

      <nb-slider class="seats" aria-label="Seats" [min]="1" [step]="1" [formControl]="seats" />

      <nb-slider class="size" aria-label="Size" [min]="0" [max]="100" [step]="1" transform="sqrt" [formControl]="size" />

      <nb-slider class="bass" vertical aria-label="Bass" [min]="-6" [max]="6" [step]="1" [center]="0" [formControl]="bass" />
    </div>
  `,
  styleUrl: './slider.spec.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [ReactiveFormsModule, NbSliderModule, NbValidationModule],
})
class SliderHostComponent {
  readonly dir = signal('ltr');
  readonly volume = new FormControl<NbSliderValue>(40);
  readonly price = new FormControl<NbSliderValue>({ start: 50, end: 250 });
  readonly seats = new FormControl<NbSliderValue>(5);
  readonly size = new FormControl<NbSliderValue>(25);
  readonly bass = new FormControl<NbSliderValue>(0);
  readonly percent = (value: number) => `${value}%`;
}

describe('nb-slider', () => {
  let fixture: ComponentFixture<SliderHostComponent>;
  let host: SliderHostComponent;

  const element = (selector: string) => fixture.nativeElement.querySelector(selector) as HTMLElement;
  const thumbs = (slider: string) => [...element(slider).querySelectorAll('[role="slider"]')] as HTMLElement[];
  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };
  /** A pointer event at a fraction of the slider's track, along it. */
  const pointer = (slider: string, type: string, along: number) => {
    const track = element(slider).querySelector('.slider-track') as HTMLElement;
    const rect = track.getBoundingClientRect();
    const vertical = element(slider).classList.contains('vertical');
    element(slider).dispatchEvent(
      new PointerEvent(type, {
        bubbles: true,
        button: 0,
        pointerId: 1,
        clientX: vertical ? rect.left + rect.width / 2 : rect.left + rect.width * along,
        clientY: vertical ? rect.bottom - rect.height * along : rect.top + rect.height / 2,
      }),
    );
  };
  const key = async (thumb: HTMLElement, name: string) => {
    thumb.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true }));
    await render();
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] });
    fixture = TestBed.createComponent(SliderHostComponent);
    host = fixture.componentInstance;
    document.body.appendChild(fixture.nativeElement);
    await render();
  });

  afterEach(() => fixture.destroy());

  it('should be a labelled slider with its value, limits and formatted text', () => {
    const [thumb] = thumbs('.volume');
    expect(thumb.getAttribute('aria-valuenow')).toBe('40');
    expect(thumb.getAttribute('aria-valuemin')).toBe('0');
    expect(thumb.getAttribute('aria-valuemax')).toBe('100');
    expect(thumb.getAttribute('aria-valuetext')).toBe('40%');
    expect(thumb.tabIndex).toBe(0);
    const label = document.getElementById(thumb.getAttribute('aria-labelledby') ?? '');
    expect(label?.textContent).toContain('Volume');
    // Labels for the limits, and a tick at each step, filled up to the thumb.
    expect([...element('.volume').querySelectorAll('.slider-label')].map((mark) => mark.textContent?.trim())).toEqual([
      '0%',
      '100%',
    ]);
    expect(element('.volume').querySelectorAll('.slider-tick').length).toBe(11);
    expect(element('.volume').querySelectorAll('.slider-tick.active').length).toBe(5);
  });

  it('should move by steps with the keyboard, and to the limits with Home and End', async () => {
    const [thumb] = thumbs('.volume');
    await key(thumb, 'ArrowRight');
    expect(host.volume.value).toBe(50);
    await key(thumb, 'ArrowDown');
    expect(host.volume.value).toBe(40);
    await key(thumb, 'PageUp');
    expect(host.volume.value).toBe(100);
    await key(thumb, 'ArrowUp');
    expect(host.volume.value).toBe(100);
    await key(thumb, 'Home');
    expect(host.volume.value).toBe(0);
    await key(thumb, 'End');
    expect(host.volume.value).toBe(100);
  });

  it('should reverse the left and right arrows in right-to-left text', async () => {
    host.dir.set('rtl');
    await render();
    const [thumb] = thumbs('.volume');
    await key(thumb, 'ArrowRight');
    expect(host.volume.value).toBe(30);
    // The pointer measures from the right too.
    pointer('.volume', 'pointerdown', 0.2);
    pointer('.volume', 'pointerup', 0.2);
    await render();
    expect(host.volume.value).toBe(80);
  });

  it('should pick the step the pointer has reached', async () => {
    pointer('.volume', 'pointerdown', 0.78);
    pointer('.volume', 'pointerup', 0.78);
    await render();
    expect(host.volume.value).toBe(70);
    pointer('.volume', 'pointerdown', 1);
    pointer('.volume', 'pointerup', 1);
    await render();
    expect(host.volume.value).toBe(100);
  });

  it('should draw the track through a transform, and find the value back from the pointer', async () => {
    const [thumb] = thumbs('.size');
    // 25 of 100 is drawn halfway with sqrt.
    expect(Number(thumb.style.getPropertyValue('--nb-slider-position'))).toBeCloseTo(0.5);
    pointer('.size', 'pointerdown', 0.3);
    pointer('.size', 'pointerup', 0.3);
    await render();
    expect(host.size.value).toBe(9);
  });

  it('should set the value where the pointer presses and drags, and focus the thumb', async () => {
    const [thumb] = thumbs('.volume');
    pointer('.volume', 'pointerdown', 0.72);
    await render();
    expect(host.volume.value).toBe(70);
    expect(document.activeElement).toBe(thumb);
    expect(element('.volume').classList).toContain('dragging');

    pointer('.volume', 'pointermove', 0.21);
    await render();
    expect(host.volume.value).toBe(20);
    pointer('.volume', 'pointerup', 0.21);
    await render();
    expect(element('.volume').classList).not.toContain('dragging');
    expect(host.volume.touched).toBe(true);
  });

  it('should show the value above the thumb while it moves', async () => {
    const bubble = element('.volume .slider-value');
    expect(getComputedStyle(bubble).opacity).toBe('0');
    pointer('.volume', 'pointerdown', 0.5);
    await render();
    await expect.poll(() => getComputedStyle(bubble).opacity).toBe('1');
    expect(bubble.textContent?.trim()).toBe('50%');
    pointer('.volume', 'pointerup', 0.5);
  });

  it('should pick a range with two named thumbs', async () => {
    const [start, end] = thumbs('.price');
    const label = element('.price-label');
    expect(start.getAttribute('aria-labelledby')?.split(' ')).toContain(label.id);
    const name = (thumb: HTMLElement) =>
      (thumb.getAttribute('aria-labelledby') ?? '')
        .split(' ')
        .map((id) => document.getElementById(id)?.textContent?.trim())
        .join(' ');
    expect(name(start)).toBe('Price Start');
    expect(name(end)).toBe('Price End');
    // Either thumb can go anywhere, as they pass each other.
    expect(start.getAttribute('aria-valuemax')).toBe('500');
    expect(end.getAttribute('aria-valuemin')).toBe('0');

    // The pointer moves the nearest thumb.
    pointer('.price', 'pointerdown', 0.8);
    pointer('.price', 'pointerup', 0.8);
    await render();
    expect(host.price.value).toEqual({ start: 50, end: 400 });

  });

  it('should let a range\'s thumbs pass each other, going on with the moving one', async () => {
    const [start, end] = thumbs('.price');
    // Drag the start past the end: they swap, and the drag goes on with the end.
    pointer('.price', 'pointerdown', 0.1);
    await render();
    expect(document.activeElement).toBe(start);
    pointer('.price', 'pointermove', 0.9);
    await render();
    expect(host.price.value).toEqual({ start: 250, end: 450 });
    expect(document.activeElement).toBe(end);
    expect(end.classList).toContain('dragging');
    pointer('.price', 'pointermove', 0.96);
    await render();
    expect(host.price.value).toEqual({ start: 250, end: 480 });
    pointer('.price', 'pointerup', 0.96);
    await render();

    // With the keyboard too: the end goes below the start, and the focus with it.
    end.focus();
    await key(end, 'Home');
    expect(host.price.value).toEqual({ start: 0, end: 250 });
    expect(document.activeElement).toBe(start);
    await key(start, 'ArrowRight');
    expect(host.price.value).toEqual({ start: 10, end: 250 });
  });

  it('should reach any value towards an open end', async () => {
    const [thumb] = thumbs('.seats');
    expect(thumb.hasAttribute('aria-valuemax')).toBe(true);
    pointer('.seats', 'pointerdown', 0.5);
    await render();
    const middle = host.seats.value as number;
    pointer('.seats', 'pointermove', 0.97);
    await render();
    const further = host.seats.value as number;
    pointer('.seats', 'pointerup', 0.97);
    expect(middle).toBe(3);
    expect(further).toBeGreaterThan(50);

    // End moves ten steps on an open end.
    await key(thumb, 'End');
    expect(host.seats.value).toBe(further + 10);
    // No label for the open end.
    expect([...element('.seats').querySelectorAll('.slider-label')].map((mark) => mark.textContent?.trim())).toEqual([
      '1',
    ]);
  });

  it('should stand up, with the minimum at the bottom, filled from the center', async () => {
    const track = element('.bass .slider-track').getBoundingClientRect();
    expect(track.height).toBeGreaterThan(track.width * 10);
    pointer('.bass', 'pointerdown', 0.75);
    pointer('.bass', 'pointerup', 0.75);
    await render();
    expect(host.bass.value).toBe(3);
    const fill = element('.bass .slider-fill').getBoundingClientRect();
    const thumb = thumbs('.bass')[0].getBoundingClientRect();
    expect(fill.top).toBeCloseTo(thumb.top + thumb.height / 2, 0);
    expect(fill.bottom).toBeCloseTo(track.top + track.height / 2, 0);
    expect(thumbs('.bass')[0].getAttribute('aria-orientation')).toBe('vertical');
  });

  it('should report values outside the limits, and a range out of order', async () => {
    host.volume.setValue(150);
    await render();
    expect(host.volume.errors?.['max']).toEqual(expect.objectContaining({ kind: 'max', max: 100, actual: 150 }));
    // Shown where it is, with the end opened past it, and the slider's own limit for assistive technologies.
    const [thumb] = thumbs('.volume');
    expect(thumb.getAttribute('aria-valuenow')).toBe('150');
    expect(thumb.getAttribute('aria-valuemax')).toBe('100');
    expect(Number(thumb.style.getPropertyValue('--nb-slider-position'))).toBeCloseTo(150 / 170);
    expect([...element('.volume').querySelectorAll('.slider-label')].map((mark) => mark.textContent?.trim())).toEqual([
      '0%',
    ]);
    // Moving it brings it back within the limits, which close the end again.
    await key(thumb, 'ArrowRight');
    expect(host.volume.value).toBe(100);
    expect(element('.volume').querySelectorAll('.slider-label').length).toBe(2);

    host.price.setValue({ start: 300, end: 100 } satisfies NbSliderRange);
    await render();
    expect(host.price.errors?.['nbSliderOrder']).toEqual(expect.objectContaining({ kind: 'nbSliderOrder' }));
    expect(host.price.errors?.['nbSliderOrder'].message).toBeTruthy();
  });

  it('should take no input while disabled', async () => {
    host.volume.disable();
    await render();
    const [thumb] = thumbs('.volume');
    expect(thumb.hasAttribute('tabindex')).toBe(false);
    expect(thumb.getAttribute('aria-disabled')).toBe('true');
    // Not even a click focuses it.
    thumb.focus();
    expect(document.activeElement).not.toBe(thumb);
    // A solid dot, over the thumb's surface, rather than the translucent colour over the track.
    const thumbStyle = getComputedStyle(thumb);
    expect(thumbStyle.backgroundColor).toBe(getComputedStyle(thumb).borderTopColor);
    expect(thumbStyle.backgroundImage).toContain('linear-gradient');
    await key(thumb, 'ArrowRight');
    pointer('.volume', 'pointerdown', 0.9);
    pointer('.volume', 'pointerup', 0.9);
    await render();
    expect(host.volume.value).toBe(40);
  });
});

@Component({
  // The theme applies in an element with its class.
  template: `
    <div class="nb-theme-default" style="width: 20rem">
      @for (size of sizes; track size) {
        <nb-slider [size]="size" [attr.data-size]="size" [value]="5" [max]="10" aria-label="Volume" />
      }
      <nb-slider class="app-size" [value]="5" [max]="10" aria-label="Volume" />
    </div>
  `,
  styleUrl: './slider.spec.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [NbSliderComponent],
  providers: [provideNbComponentDefaults({ size: 'large' })],
})
class SliderSizesHostComponent {
  readonly sizes: NbComponentSize[] = ['tiny', 'small', 'medium', 'large', 'giant'];
}

describe('nb-slider sizes', () => {
  it('should scale its thumb and track with its size, and take the app\'s size, as the other controls do', async () => {
    TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] });
    const fixture = TestBed.createComponent(SliderSizesHostComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    await fixture.whenStable();
    const thumb = (slider: Element) => slider.querySelector('.slider-thumb') as HTMLElement;
    const track = (slider: Element) => slider.querySelector('.slider-track') as HTMLElement;
    const sliders = [...fixture.nativeElement.querySelectorAll('nb-slider[data-size]')] as HTMLElement[];

    const thumbs = sliders.map((slider) => thumb(slider).getBoundingClientRect().width);
    const tracks = sliders.map((slider) => track(slider).getBoundingClientRect().height);
    expect(thumbs).toEqual([12, 16, 20, 24, 28]);
    expect(tracks).toEqual([2, 3, 4, 5, 6]);

    const appSized = fixture.nativeElement.querySelector('.app-size') as HTMLElement;
    expect(appSized.classList).toContain('size-large');
    expect(thumb(appSized).getBoundingClientRect().width).toBe(24);
    fixture.destroy();
  });
});
