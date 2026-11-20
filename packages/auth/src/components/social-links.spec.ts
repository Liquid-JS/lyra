import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { NbIconLibraries, NbThemeModule } from '@liquid-js/lyr-core';
import { NbDummyAuthStrategy, NbLoginComponent, NbRegisterComponent, provideNbAuth } from '@liquid-js/lyr-auth';

describe('Authentication social links', () => {
  const socialLinks = [
    { url: 'https://example.com/code', title: 'Code' },
    { url: 'https://example.com/', title: 'Home page', icon: 'home-outline' },
  ];

  const pages: [string, Type<unknown>][] = [
    ['login', NbLoginComponent],
    ['register', NbRegisterComponent],
  ];
  for (const [page, component] of pages) {
    it(`should name an icon link by its title on the ${page} page`, async () => {
      TestBed.configureTestingModule({
        imports: [NbThemeModule.forRoot()],
        providers: [
          provideRouter([]),
          provideNbAuth({
            strategies: [NbDummyAuthStrategy.setup({ name: 'email' })],
            forms: { login: { socialLinks }, register: { socialLinks } },
          }),
        ],
      });
      const icons = TestBed.inject(NbIconLibraries);
      icons.registerSvgPack('test', { 'home-outline': '<svg></svg>' });
      icons.setDefaultPack('test');
      const fixture = TestBed.createComponent(component);
      fixture.detectChanges();
      await fixture.whenStable();
      const [text, icon] = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.socials a'));

      expect(text.textContent?.trim()).toBe('Code');
      expect(text.hasAttribute('aria-label')).toBe(false);
      expect(icon.getAttribute('aria-label')).toBe('Home page');
      expect(icon.querySelector('nb-icon')).not.toBeNull();
    });
  }
});
