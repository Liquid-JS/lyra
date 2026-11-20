import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  NbAccordionComponent,
  NbButtonComponent,
  NbButtonToggleDirective,
  NbCardComponent,
  NbChatComponent,
  NbComponentDefaults,
  NbIconComponent,
  NbIconLibraries,
  NbInputDirective,
  NbPaginationComponent,
  NbSelectComponent,
  NbThemeModule,
  provideNbComponentDefaults,
} from '@liquid-js/lyr-core';

@Component({
  template: `
    <button nbButton #defaultButton>Save</button>
    <button nbButton shape="rectangle" size="small" #ownButton>Cancel</button>
    <button nbButtonToggle #toggle>Bold</button>
    <input nbInput #field />
    <nb-select #select />
    <nb-card #card />
    <nb-chat #chat />
    <nb-accordion #accordion />
    <nb-pagination #pagination />
  `,
  imports: [
    NbAccordionComponent,
    NbButtonComponent,
    NbButtonToggleDirective,
    NbCardComponent,
    NbChatComponent,
    NbInputDirective,
    NbPaginationComponent,
    NbSelectComponent,
  ],
})
class DefaultsTestComponent {
  readonly defaultButton = viewChild.required('defaultButton', { read: NbButtonComponent });
  readonly ownButton = viewChild.required('ownButton', { read: NbButtonComponent });
  readonly toggle = viewChild.required('toggle', { read: NbButtonToggleDirective });
  readonly field = viewChild.required('field', { read: NbInputDirective });
  readonly select = viewChild.required('select', { read: NbSelectComponent });
  readonly card = viewChild.required('card', { read: NbCardComponent });
  readonly chat = viewChild.required('chat', { read: NbChatComponent });
  readonly accordion = viewChild.required('accordion', { read: NbAccordionComponent });
  readonly pagination = viewChild.required('pagination', { read: NbPaginationComponent });
}

function render(...defaults: NbComponentDefaults[]) {
  TestBed.configureTestingModule({
    imports: [NbThemeModule.forRoot(), DefaultsTestComponent],
    providers: defaults.length ? [provideNbComponentDefaults(defaults[0])] : [],
  });
  if (defaults[1]) {
    TestBed.overrideComponent(DefaultsTestComponent, { set: { providers: [provideNbComponentDefaults(defaults[1])] } });
  }
  const fixture = TestBed.createComponent(DefaultsTestComponent);
  fixture.detectChanges();
  return fixture.componentInstance;
}

describe('provideNbComponentDefaults', () => {
  it('should keep the built-in defaults without any', () => {
    const page = render();
    expect(page.defaultButton().properties()).toEqual(
      expect.objectContaining({ shape: 'rectangle', size: 'medium', appearance: 'filled' }),
    );
    expect(page.field().fieldSize()).toBe('medium');
    expect(page.select().appearance()).toBe('outline');
    expect(page.pagination().size()).toBe('small');
  });

  it('should give the controls the shape and size, and each type its own over them', () => {
    const page = render({ shape: 'semi-round', size: 'large', button: { shape: 'round', appearance: 'outline' } });
    expect(page.defaultButton().properties()).toEqual(
      expect.objectContaining({ shape: 'round', size: 'large', appearance: 'outline' }),
    );
    expect(page.field().shape()).toBe('semi-round');
    expect(page.field().fieldSize()).toBe('large');
    expect(page.select().shape()).toBe('semi-round');
    // A pagination isn't a control: its size stays its own.
    expect(page.pagination().size()).toBe('small');
  });

  it('should let a component\'s own inputs win', () => {
    const page = render({ shape: 'round', size: 'large' });
    expect(page.ownButton().properties()).toEqual(expect.objectContaining({ shape: 'rectangle', size: 'small' }));
  });

  it('should give toggles the buttons\' appearance, but not hero', () => {
    expect(render({ button: { appearance: 'ghost' } }).toggle().properties().appearance).toBe('ghost');
    TestBed.resetTestingModule();
    expect(render({ button: { appearance: 'hero' } }).toggle().properties().appearance).toBe('filled');
  });

  it('should follow a signal of defaults as it changes, in the same components', () => {
    const defaults = signal<NbComponentDefaults>({ shape: 'round' });
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), DefaultsTestComponent],
      providers: [provideNbComponentDefaults(defaults)],
    });
    const fixture = TestBed.createComponent(DefaultsTestComponent);
    fixture.detectChanges();
    const button = fixture.componentInstance.defaultButton();
    const element: HTMLElement = fixture.nativeElement.querySelector('button[nbButton]');
    expect(button.properties().shape).toBe('round');

    defaults.set({ shape: 'semi-round', button: { appearance: 'outline' } });
    fixture.detectChanges();
    expect(fixture.componentInstance.defaultButton()).toBe(button);
    expect(button.properties()).toEqual(expect.objectContaining({ shape: 'semi-round', appearance: 'outline' }));
    expect(element.classList).toContain('shape-semi-round');
    // A component's own inputs still win.
    expect(fixture.componentInstance.ownButton().properties().shape).toBe('rectangle');
  });

  it('should give the appearance at the top to each component that has it, and each type\'s own over it', () => {
    const outline = render({ appearance: 'outline', select: { appearance: 'filled' } });
    expect(outline.defaultButton().properties().appearance).toBe('outline');
    expect(outline.toggle().properties().appearance).toBe('outline');
    expect(outline.card().appearance()).toBe('outline');
    expect(outline.select().appearance()).toBe('filled');
    TestBed.resetTestingModule();

    // Cards have no hero appearance, and keep their own.
    const hero = render({ appearance: 'hero' });
    expect(hero.defaultButton().properties().appearance).toBe('hero');
    expect(hero.select().appearance()).toBe('hero');
    expect(hero.card().appearance()).toBe('outline');
    TestBed.resetTestingModule();

    // Nor ghost.
    expect(render({ appearance: 'ghost' }).card().appearance()).toBe('outline');
  });

  it('should give floating at the top to the containers only, and each type\'s own over it', () => {
    const page = render({ appearance: 'floating', accordion: { appearance: 'outline' } });
    expect(page.card().appearance()).toBe('floating');
    expect(page.chat().appearance()).toBe('floating');
    expect(page.accordion().appearance()).toBe('outline');
    // Buttons and selects have no floating appearance, and keep their own.
    expect(page.defaultButton().properties().appearance).toBe('filled');
    expect(page.select().appearance()).toBe('outline');
  });

  it('should let defaults closer to a component override the ones further up, type by type', () => {
    const page = render(
      { size: 'large', select: { appearance: 'filled', shape: 'round' }, card: { appearance: 'filled' } },
      { select: { shape: 'rectangle' } },
    );
    expect(page.select().appearance()).toBe('filled');
    expect(page.select().shape()).toBe('rectangle');
    expect(page.select().size()).toBe('large');
    expect(page.card().appearance()).toBe('filled');
  });
});

@Component({
  template: `
    <nb-icon icon="star-outline" pack="test" #outline />
    <nb-icon icon="star" pack="test" #filled />
    <nb-icon icon="search-outline" pack="test" #onlyOutline />
  `,
  imports: [NbIconComponent],
})
class IconStyleTestComponent {}

describe('NbComponentDefaults.iconStyle', () => {
  function icons(iconStyle?: 'outline' | 'filled') {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), IconStyleTestComponent],
      providers: iconStyle ? [provideNbComponentDefaults({ iconStyle })] : [],
    });
    TestBed.inject(NbIconLibraries).registerSvgPack('test', {
      star: '<svg><path d="filled"/></svg>',
      'star-outline': '<svg><path d="outline"/></svg>',
      'search-outline': '<svg><path d="search"/></svg>',
    });
    const fixture = TestBed.createComponent(IconStyleTestComponent);
    fixture.detectChanges();
    return [...(fixture.nativeElement as HTMLElement).querySelectorAll('nb-icon path')].map((path) =>
      path.getAttribute('d'),
    );
  }

  it('should draw icons as named without a style', () => {
    expect(icons()).toEqual(['outline', 'filled', 'search']);
  });

  it('should draw icons filled where the pack has them', () => {
    expect(icons('filled')).toEqual(['filled', 'filled', 'search']);
  });

  it('should draw icons outlined where the pack has them', () => {
    expect(icons('outline')).toEqual(['outline', 'outline', 'search']);
  });
});
