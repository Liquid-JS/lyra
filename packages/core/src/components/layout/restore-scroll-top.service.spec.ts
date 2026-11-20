import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NbRestoreScrollTopHelper } from '@liquid-js/lyr-core';

let restoreHelper: NbRestoreScrollTopHelper;
let router: Router;
let fixture: ComponentFixture<TestBootstrapComponent>;

@Component({
  template: '<router-outlet />',
  imports: [RouterModule],
})
class TestBootstrapComponent {}

@Component({
  template: '',
  imports: [RouterModule],
})
class TestComponent {}

describe('NbRestoreScrollTopHelper', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();

    fixture = TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([
          { path: '', component: TestComponent },
          { path: 'about', component: TestComponent },
        ]),
        TestComponent, TestBootstrapComponent,
      ],
      providers: [NbRestoreScrollTopHelper],
    }).createComponent(TestBootstrapComponent);

    fixture.detectChanges();
  });

  beforeEach(inject([NbRestoreScrollTopHelper, Router], (_restoreHelper: NbRestoreScrollTopHelper, _router: Router) => {
    restoreHelper = _restoreHelper;
    router = _router;
  }));

  afterEach(async () => {
    fixture.destroy();
    await fixture.whenStable();
    fixture.nativeElement.remove();
  });

  // Each navigation is awaited, so none is still running when the test module resets.
  it('should trigger when url is changed', async () => {
    const spy = vi.fn();
    restoreHelper.shouldRestore().subscribe(spy);

    await router.navigate(['/']);
    await router.navigate(['about']);
    await router.navigate(['/']);

    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('should not trigger when url query param is changed', async () => {
    const spy = vi.fn();
    restoreHelper.shouldRestore().subscribe(spy);

    await router.navigate(['/']);
    await router.navigate(['/'], { queryParams: { test: 1 } });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not trigger when url fragment is changed', async () => {
    const spy = vi.fn();
    restoreHelper.shouldRestore().subscribe(spy);

    await router.navigate(['/']);
    await router.navigate(['/'], { fragment: 'some' });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not trigger when url query param & fragment are changed', async () => {
    const spy = vi.fn();
    restoreHelper.shouldRestore().subscribe(spy);

    await router.navigate(['/']);
    await router.navigate(['/'], { fragment: 'some', queryParams: { test: 1 } });

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
