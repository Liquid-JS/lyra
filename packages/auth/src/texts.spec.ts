import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { NbTextsService, NbThemeModule, provideNbTexts } from '@liquid-js/lyr-core';
import {
  NbDummyAuthStrategy,
  NbLoginComponent,
  NbPasswordAuthStrategy,
  provideNbAuth,
} from '@liquid-js/lyr-auth';

describe('Authentication texts', () => {
  const configure = (texts: Parameters<typeof provideNbTexts>[0]) =>
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideNbAuth({ strategies: [NbDummyAuthStrategy.setup({ name: 'email' })] }),
        { provide: NbPasswordAuthStrategy, useClass: NbPasswordAuthStrategy },
        provideNbTexts(texts),
      ],
    });

  it("should show a strategy's messages from the texts when the backend sends none", async () => {
    configure({ authStrategy: { loginError: 'Napačen e-naslov ali geslo.', loginSuccess: 'Prijavljeni ste.' } });
    const strategy = TestBed.inject(NbPasswordAuthStrategy);
    const http = TestBed.inject(HttpTestingController);
    strategy.setOptions({ name: 'email' });

    const failure = firstValueFrom(strategy.authenticate({ email: 'a@b.c', password: '123456' }));
    http.expectOne('/api/auth/login').flush({}, { status: 401, statusText: 'Unauthorized' });
    expect((await failure).getErrors()).toEqual(['Napačen e-naslov ali geslo.']);

    const success = firstValueFrom(strategy.authenticate({ email: 'a@b.c', password: '123456' }));
    http.expectOne('/api/auth/login').flush({ data: { token: 'token' } });
    expect((await success).getMessages()).toEqual(['Prijavljeni ste.']);
  });

  it('should take texts set at run time, after the strategy is set up', async () => {
    configure({});
    const strategy = TestBed.inject(NbPasswordAuthStrategy);
    const http = TestBed.inject(HttpTestingController);
    strategy.setOptions({ name: 'email' });

    TestBed.inject(NbTextsService).set({ authStrategy: { loginError: 'Napačen e-naslov ali geslo.' } });

    const failure = firstValueFrom(strategy.authenticate({ email: 'a@b.c', password: '123456' }));
    http.expectOne('/api/auth/login').flush({}, { status: 401, statusText: 'Unauthorized' });
    expect((await failure).getErrors()).toEqual(['Napačen e-naslov ali geslo.']);
  });

  it("should keep the messages a strategy's options give", async () => {
    configure({ authStrategy: { loginError: 'Napačen e-naslov ali geslo.' } });
    const strategy = TestBed.inject(NbPasswordAuthStrategy);
    const http = TestBed.inject(HttpTestingController);
    strategy.setOptions({ name: 'email', login: { defaultErrors: ['Own message'] } });

    const failure = firstValueFrom(strategy.authenticate({ email: 'a@b.c', password: '123456' }));
    http.expectOne('/api/auth/login').flush({}, { status: 401, statusText: 'Unauthorized' });
    expect((await failure).getErrors()).toEqual(['Own message']);
  });

  it('should show the login page in the texts, with the password length in one message', async () => {
    configure({
      auth: {
        loginTitle: 'Prijava',
        passwordLength: (min, max) => `Geslo naj ima od ${min} do ${max} znakov`,
      },
    });
    const fixture = TestBed.createComponent(NbLoginComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('#title')?.textContent?.trim()).toBe('Prijava');
    // The other texts stay English.
    expect(root.querySelector('.sub-title')?.textContent?.trim()).toBe('Hello! Log in with your email.');
    expect(root.querySelector('#input-password')?.getAttribute('placeholder')).toBe('Password');
  });
});
