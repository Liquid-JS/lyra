import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  NB_PREFERENCE_STORAGE,
  NbPreferenceStorage,
  NbContentSizeSwitcherComponent,
  NbThemeModule,
  NbThemeSelectComponent,
  NbThemeService,
  NbThemeOptions,
} from '@liquid-js/lyr-core';

const themes: NbThemeOptions['themes'] = [
  { name: 'default', scheme: 'light' },
  { name: 'dark', scheme: 'dark', label: 'Night' },
  { name: 'contrast', scheme: 'dark', contrast: 'more' },
];

/** Fakes the system's preferences for `matchMedia`. */
function fakeSystem(dark: boolean, moreContrast = false) {
  const listeners = new Set<() => void>();
  const preferences = { dark, moreContrast };
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        get matches() {
          return query.includes('dark') ? preferences.dark : query.includes('contrast') ? preferences.moreContrast : false;
        },
        addEventListener: (_: string, listener: () => void) => listeners.add(listener),
        removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
      }) as unknown as MediaQueryList,
  );
  return {
    set(nextDark: boolean, nextMoreContrast = false) {
      Object.assign(preferences, { dark: nextDark, moreContrast: nextMoreContrast });
      listeners.forEach((listener) => listener());
    },
  };
}

/** A storage that answers later, as one on a server would. */
function fakeStorage(saved: Record<string, string> = {}): NbPreferenceStorage & { saved: Record<string, string> } {
  return {
    saved,
    get: (key) => Promise.resolve(saved[key]),
    set: (key, value) => {
      if (value === null) {
        delete saved[key];
      } else {
        saved[key] = value;
      }
      return Promise.resolve();
    },
  };
}

const settle = () => new Promise((resolve) => setTimeout(resolve));

function createService(options: NbThemeOptions, storage = fakeStorage()) {
  TestBed.configureTestingModule({
    imports: [NbThemeModule.forRoot(options)],
    providers: [{ provide: NB_PREFERENCE_STORAGE, useValue: storage }],
  });
  return TestBed.inject(NbThemeService);
}

describe('NbThemeService preferences', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.documentElement.style.removeProperty('font-size');
  });

  it('should show the declared theme that fits the system, and follow it', () => {
    const system = fakeSystem(true);
    const service = createService({ name: 'default', themes });
    expect(service.themePreference()).toBe('system');
    expect(service.theme()).toBe('dark');

    system.set(false);
    expect(service.theme()).toBe('default');
    // A high-contrast theme only when the system asks for more contrast.
    system.set(true, true);
    expect(service.theme()).toBe('contrast');
  });

  it('should keep the start theme without declared themes', () => {
    fakeSystem(true);
    const service = createService({ name: 'corporate' });
    expect(service.theme()).toBe('corporate');
    expect(service.themePreference()).toBe('corporate');
  });

  it('should save the user\'s choice and restore it, also from storage that answers later', async () => {
    fakeSystem(false);
    const storage = fakeStorage();
    const service = createService({ name: 'default', themes, preferences: true }, storage);
    service.setThemePreference('dark');
    service.setContentSize('large');
    await settle();
    expect(storage.saved).toEqual({ 'nb-theme': 'dark', 'nb-content-size': 'large' });

    TestBed.resetTestingModule();
    const restored = createService({ name: 'default', themes, preferences: true }, storage);
    expect(restored.theme()).toBe('default');
    await settle();
    expect(restored.theme()).toBe('dark');
    expect(restored.themePreference()).toBe('dark');
    expect(restored.contentSize()).toBe('large');
    expect(document.documentElement.style.fontSize).toBe('112.5%');

    // Back to the system's theme, which forgets the choice.
    restored.setThemePreference('system');
    await settle();
    expect(restored.theme()).toBe('default');
    expect(storage.saved['nb-theme']).toBeUndefined();
  });

  it('should use its own storage keys, and keep nothing without preferences', async () => {
    fakeSystem(false);
    const storage = fakeStorage();
    createService({ name: 'default', themes, preferences: { key: 'shop' } }, storage).setThemePreference('dark');
    await settle();
    expect(storage.saved).toEqual({ 'shop-theme': 'dark' });

    TestBed.resetTestingModule();
    const other = fakeStorage();
    createService({ name: 'default', themes }, other).setThemePreference('dark');
    await settle();
    expect(other.saved).toEqual({});
  });

  it('should scale the root font size, and keep the browser\'s for medium', () => {
    fakeSystem(false);
    const service = createService({ name: 'default' });
    service.setContentSize('small');
    expect(document.documentElement.style.fontSize).toBe('87.5%');
    service.setContentSize('medium');
    expect(document.documentElement.style.fontSize).toBe('');
  });
});

@Component({
  template: '<nb-theme-select />',
  imports: [NbThemeSelectComponent],
})
class ThemeSelectHostComponent {}

describe('nb-theme-select', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.querySelectorAll('.cdk-overlay-container').forEach((container) => container.remove());
  });

  it('should offer System and the declared themes, named, and change the theme', async () => {
    fakeSystem(false);
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot({ name: 'default', themes }), ThemeSelectHostComponent],
      providers: [{ provide: NB_PREFERENCE_STORAGE, useValue: fakeStorage() }],
    });
    const fixture = TestBed.createComponent(ThemeSelectHostComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('nb-select button') as HTMLButtonElement;
    expect(button.textContent?.trim()).toBe('System');
    const label = document.getElementById(button.getAttribute('aria-labelledby')?.split(' ')[0] ?? '');
    expect(label?.textContent).toBe('Theme');

    button.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const options = Array.from(document.querySelectorAll('nb-option')).map((option) => option.textContent?.trim());
    expect(options).toEqual(['System', 'Default', 'Night', 'Contrast']);

    (Array.from(document.querySelectorAll('nb-option'))[1] as HTMLElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(TestBed.inject(NbThemeService).theme()).toBe('default');
    expect(TestBed.inject(NbThemeService).themePreference()).toBe('default');
    fixture.destroy();
  });
});

@Component({
  template: '<nb-content-size-switcher />',
  imports: [NbContentSizeSwitcherComponent],
})
class ContentSizeHostComponent {}

describe('nb-content-size-switcher', () => {
  afterEach(() => document.documentElement.style.removeProperty('font-size'));

  it('should offer each size as a named button with an "A" in its size, and set it', async () => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), ContentSizeHostComponent],
      providers: [{ provide: NB_PREFERENCE_STORAGE, useValue: fakeStorage() }],
    });
    const fixture = TestBed.createComponent(ContentSizeHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const group = fixture.nativeElement.querySelector('nb-button-group') as HTMLElement;
    expect(group.getAttribute('role')).toBe('group');
    expect(group.getAttribute('aria-label')).toBe('Text size');
    const buttons = Array.from(group.querySelectorAll('button')) as HTMLButtonElement[];
    expect(buttons.map((button) => button.getAttribute('aria-label'))).toEqual(['Small', 'Medium', 'Large', 'Larger']);
    expect(buttons.map((button) => (button.querySelector('.glyph') as HTMLElement).style.fontSize)).toEqual([
      '0.875em',
      '1em',
      '1.125em',
      '1.25em',
    ]);
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');

    buttons[3].click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(TestBed.inject(NbThemeService).contentSize()).toBe('larger');
    expect(document.documentElement.style.fontSize).toBe('125%');
    expect(buttons[3].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false');

    // A second click keeps the size.
    buttons[3].click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(TestBed.inject(NbThemeService).contentSize()).toBe('larger');
    expect(buttons[3].getAttribute('aria-pressed')).toBe('true');
  });
});
