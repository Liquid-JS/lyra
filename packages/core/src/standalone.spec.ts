import { assert } from 'vitest';
import { ApplicationRef, Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  NbDatepickerComponent,
  NbDatepickerDirective,
  NbDialogService,
  NbInputDirective,
  NbJSThemesRegistry,
  NbLayoutDirection,
  NbLayoutDirectionService,
  NbLayoutRulerService,
  NbLayoutScrollService,
  NbMediaBreakpointsService,
  NbLayoutColumnComponent,
  NbLayoutComponent,
  NbMenuComponent,
  NbOptionComponent,
  NbSelectComponent,
  NbSidebarComponent,
  NbStatusService,
  NbThemeService,
  NbToastrService,
  NbWindowService,
  provideNbDatepicker,
  provideNbDialog,
  provideNbTheme,
  provideNbToastr,
  provideNbWindow,
} from '@liquid-js/lyr-core';

@Component({
  template: '<p class="standalone-content">Content</p>',
})
class NbStandaloneContentComponent {}

@Component({
  template: `
    <nb-layout>
      <nb-sidebar>
        <nb-menu [items]="items" />
      </nb-sidebar>
      <nb-layout-column>
        <input nbInput [nbDatepicker]="picker" />
        <nb-datepicker #picker />
        <nb-select placeholder="Pick">
          <nb-option value="a">A</nb-option>
        </nb-select>
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [
    NbLayoutComponent,
    NbLayoutColumnComponent,
    NbSidebarComponent,
    NbMenuComponent,
    NbInputDirective,
    NbDatepickerDirective,
    NbDatepickerComponent,
    NbSelectComponent,
    NbOptionComponent,
  ],
})
class NbStandaloneAppComponent {
  readonly items = [{ title: 'Home', link: '/' }];
  readonly picker = viewChild.required(NbDatepickerComponent);
}

// The menu and sidebar services are provided in root, so they need no provide function.
describe('standalone usage', () => {
  let appRef: ApplicationRef;
  let layout: HTMLElement;

  const query = (selector: string) => {
    const el = layout.querySelector(selector);
    assert(el, `${selector} not rendered`);
    return el;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideNbTheme(),
        provideNbDatepicker(),
        provideNbDialog(),
        provideNbToastr(),
        provideNbWindow(),
      ],
    });
    const fixture = TestBed.createComponent(NbStandaloneAppComponent);
    fixture.detectChanges();
    appRef = TestBed.inject(ApplicationRef);
    layout = fixture.nativeElement.querySelector('nb-layout');
  });

  it('should render components imported without their modules', () => {
    expect(query('nb-sidebar nb-menu .menu-title').textContent).toContain('Home');
    expect(query('nb-select button').textContent).toContain('Pick');
  });

  it('should open the datepicker calendar', () => {
    const fixture = TestBed.createComponent(NbStandaloneAppComponent);
    fixture.detectChanges();
    fixture.componentInstance.picker().show();
    appRef.tick();

    expect(fixture.nativeElement.querySelector('nb-calendar')).not.toBeNull();
  });

  it('should open a dialog, a toast and a window', () => {
    TestBed.inject(NbDialogService).open(NbStandaloneContentComponent);
    TestBed.inject(NbToastrService).show('Toast message');
    TestBed.inject(NbWindowService).open(NbStandaloneContentComponent, { title: 'Window' });
    appRef.tick();

    expect(layout.querySelector('nb-dialog-container .standalone-content')).not.toBeNull();
    expect(query('nb-toast').textContent).toContain('Toast message');
    expect(layout.querySelector('nb-window .standalone-content')).not.toBeNull();
  });
});

describe('theme services without provideNbTheme()', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should provide themselves with the default options', () => {
    const themeService = TestBed.inject(NbThemeService);
    expect(themeService.currentTheme).toBe('default');
    expect(TestBed.inject(NbMediaBreakpointsService).getBreakpointsMap()).toEqual(
      expect.objectContaining({ xs: 0, md: 768 }),
    );
    expect(TestBed.inject(NbJSThemesRegistry).has('cosmic')).toBe(true);
    expect(TestBed.inject(NbLayoutDirectionService).isLtr()).toBe(true);
    expect(TestBed.inject(NbLayoutScrollService)).toBeTruthy();
    expect(TestBed.inject(NbLayoutRulerService)).toBeTruthy();
    expect(TestBed.inject(NbStatusService).isCustomStatus('primary')).toBe(false);
  });

  it('should use the options provideNbTheme() sets', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideNbTheme({ name: 'dark' }, [], undefined, NbLayoutDirection.RTL)],
    });
    expect(TestBed.inject(NbThemeService).currentTheme).toBe('dark');
    expect(TestBed.inject(NbLayoutDirectionService).isRtl()).toBe(true);
  });
});
