import { assert } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, viewChild, viewChildren, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  NbButtonModule,
  NbButtonGroupComponent,
  NbButtonGroupModule,
  NbButtonToggleDirective,
  NbComponentSize,
  NbComponentShape,
  NbComponentStatus,
  NbButtonToggleAppearance,
  NbThemeModule,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-button-group-test',
  template: `
    <nb-button-group
      [size]="size()"
      [status]="status()"
      [shape]="shape()"
      [appearance]="appearance()"
      [disabled]="groupDisabled()"
      [multiple]="multiple()"
      (valueChange)="onValueChange($event)"
    >
      <button nbButtonToggle value="A">A</button>
      <button nbButtonToggle value="B">B</button>
      <button nbButtonToggle value="C">C</button>
      <button nbButtonToggle value="D">D</button>
      <button nbButtonToggle value="E">E</button>
      @if (showLastButton()) {
        <button nbButtonToggle value="F">F</button>
      }
    </nb-button-group>
  `,
  imports: [NbButtonGroupModule, NbButtonModule],
})
export class NbButtonGroupTestComponent {
  readonly size = signal<NbComponentSize>('large');
  readonly shape = signal<NbComponentShape>('round');
  readonly status = signal<NbComponentStatus>('danger');
  readonly appearance = signal<NbButtonToggleAppearance>('outline');
  readonly groupDisabled = signal<boolean>(false);
  readonly multiple = signal<boolean>(false);

  readonly showLastButton = signal(false);

  readonly buttonGroup = viewChild.required(NbButtonGroupComponent);
  readonly toggleButtons = viewChildren(NbButtonToggleDirective);

  onValueChange(_value: unknown) {}
}

type Track = 'design' | 'product' | 'data';

// A group bound both ways, whose values have the type of what it's bound to.
@Component({
  selector: 'nb-button-group-value-test',
  template: `
    <nb-button-group [(value)]="track" (valueChange)="changed($event)">
      <button nbButtonToggle value="design">Design</button>
      <button nbButtonToggle value="product">Product</button>
      <button nbButtonToggle value="data">Data</button>
    </nb-button-group>
  `,
  imports: [NbButtonGroupModule, NbButtonModule],
})
export class NbButtonGroupValueTestComponent {
  readonly track = signal<Track | null>('product');
  readonly toggleButtons = viewChildren(NbButtonToggleDirective);
  readonly emitted = new Array<Track | null>();

  // Typed: the group's value is a track, one at a time without `multiple`.
  changed(track: Track | null) {
    this.emitted.push(track);
  }
}

describe('Component: NbButtonGroup with a value', () => {
  let fixture: ComponentFixture<NbButtonGroupValueTestComponent>;

  const pressed = () =>
    fixture.componentInstance
      .toggleButtons()
      .filter((toggle) => toggle.isPressed())
      .map((toggle) => toggle.value());

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), NbButtonGroupValueTestComponent],
    });
    fixture = TestBed.createComponent(NbButtonGroupValueTestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should press the toggles with the values it is given', async () => {
    expect(pressed()).toEqual(['product']);
    fixture.componentInstance.track.set('data');
    await fixture.whenStable();
    expect(pressed()).toEqual(['data']);
  });

  it('should set the value it is bound to as toggles are pressed', async () => {
    fixture.nativeElement.querySelectorAll('[nbButtonToggle]')[0].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.track()).toBe('design');
    expect(fixture.componentInstance.emitted.at(-1)).toBe('design');
    expect(pressed()).toEqual(['design']);
  });
});

// A group in forms, as a radio group: one value without `multiple`, its values with it.
@Component({
  selector: 'nb-button-group-form-test',
  template: `
    <nb-button-group [formControl]="plan">
      <button nbButtonToggle value="free">Free</button>
      <button nbButtonToggle value="pro">Pro</button>
    </nb-button-group>
    <nb-button-group multiple [formControl]="days">
      <button nbButtonToggle value="mon">Mon</button>
      <button nbButtonToggle value="tue">Tue</button>
      <button nbButtonToggle value="wed">Wed</button>
    </nb-button-group>
    <button class="after">After</button>
  `,
  imports: [NbButtonGroupModule, NbButtonModule, ReactiveFormsModule],
})
export class NbButtonGroupFormTestComponent {
  readonly plan = new FormControl<string | null>('pro');
  readonly days = new FormControl<string[]>(['tue']);
}

describe('Component: NbButtonGroup in a form', () => {
  let fixture: ComponentFixture<NbButtonGroupFormTestComponent>;
  let host: NbButtonGroupFormTestComponent;

  const toggles = (group: number) =>
    Array.from(
      fixture.nativeElement.querySelectorAll('nb-button-group')[group].querySelectorAll('[nbButtonToggle]'),
    ) as HTMLButtonElement[];
  const pressed = (group: number) =>
    toggles(group)
      .filter((toggle) => toggle.getAttribute('aria-pressed') === 'true')
      .map((toggle) => toggle.textContent?.trim());
  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot(), NbButtonGroupFormTestComponent] });
    fixture = TestBed.createComponent(NbButtonGroupFormTestComponent);
    host = fixture.componentInstance;
    document.body.appendChild(fixture.nativeElement);
    await render();
  });

  afterEach(() => fixture.destroy());

  it('should press the toggles of the form value, and give the form one value, or its values with multiple', async () => {
    expect(pressed(0)).toEqual(['Pro']);
    expect(pressed(1)).toEqual(['Tue']);

    toggles(0)[0].click();
    toggles(1)[2].click();
    await render();
    expect(host.plan.value).toBe('free');
    expect(host.days.value).toEqual(['tue', 'wed']);

    host.plan.setValue(null);
    host.days.setValue(['mon']);
    await render();
    expect(pressed(0)).toEqual([]);
    expect(pressed(1)).toEqual(['Mon']);
  });

  it('should be touched once left, and disabled with its control', async () => {
    toggles(0)[0].focus();
    (fixture.nativeElement.querySelector('.after') as HTMLButtonElement).focus();
    expect(host.plan.touched).toBe(true);

    host.plan.disable();
    await render();
    expect(toggles(0).every((toggle) => toggle.disabled || toggle.getAttribute('aria-disabled') === 'true')).toBe(true);
  });
});

describe('Component: NbButtonGroup', () => {
  let fixture: ComponentFixture<NbButtonGroupTestComponent>;
  let testComponent: NbButtonGroupTestComponent;
  let buttonGroup: NbButtonGroupComponent;
  let toggleButtons: () => readonly NbButtonToggleDirective[];

  const lastToggleButton = () => {
    const button = toggleButtons().at(-1);
    assert(button, 'no toggle buttons rendered');
    return button;
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), NbButtonGroupModule, NbButtonModule, NbButtonGroupTestComponent],
    });

    fixture = TestBed.createComponent(NbButtonGroupTestComponent);
    testComponent = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    buttonGroup = testComponent.buttonGroup();
    toggleButtons = testComponent.toggleButtons;
  });

  it('should change buttons status after initialization', () => {
    toggleButtons().forEach((button) => expect(button.properties().status).toEqual(buttonGroup.status()));
  });

  it('should change buttons size after initialization', () => {
    toggleButtons().forEach((button) => expect(button.properties().size).toEqual(buttonGroup.size()));
  });

  it('should change buttons appearance after initialization', () => {
    toggleButtons().forEach((button) => expect(button.properties().appearance).toEqual(buttonGroup.appearance()));
  });

  it('should change buttons shape after initialization', () => {
    toggleButtons().forEach((button) => expect(button.properties().shape).toEqual(buttonGroup.shape()));
  });

  it('should show the basic status on toggles that are not pressed', () => {
    testComponent.status.set('success');
    fixture.detectChanges();
    const toggles: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('[nbButtonToggle]'));
    toggles.forEach((toggle) => {
      expect(toggle.classList).toContain('status-basic');
      expect(toggle.classList).not.toContain('status-success');
    });

    toggles[0].click();
    fixture.detectChanges();
    expect(toggles[0].classList).toContain('status-success');
    expect(toggles[0].classList).not.toContain('status-basic');
  });

  it('should change buttons disabled state after initialization', () => {
    testComponent.groupDisabled.set(true);
    fixture.detectChanges();
    toggleButtons().forEach((button) => expect(button.properties().disabled).toEqual(true));
  });

  it('should change the status of newly added buttons', async () => {
    testComponent.showLastButton.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(lastToggleButton().properties().status).toEqual(buttonGroup.status());
  });

  it('should change the size of newly added buttons', async () => {
    testComponent.showLastButton.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(lastToggleButton().properties().size).toEqual(buttonGroup.size());
  });

  it('should change the appearance of newly added buttons', async () => {
    testComponent.showLastButton.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(lastToggleButton().properties().appearance).toEqual(buttonGroup.appearance());
  });

  it('should change the shape of newly added buttons', async () => {
    testComponent.showLastButton.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(lastToggleButton().properties().shape).toEqual(buttonGroup.shape());
  });

  it('should change disabled state of newly added buttons', async () => {
    testComponent.groupDisabled.set(true);
    testComponent.showLastButton.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(lastToggleButton().properties().disabled).toEqual(true);
  });

  it('should correctly emit active buttons', async () => {
    const clickButton = (el: HTMLElement, index = 0) => {
      el.querySelectorAll<HTMLButtonElement>('[nbButtonToggle]')[index].click();
    };
    const nativeElement = fixture.nativeElement;
    vi.spyOn(testComponent, 'onValueChange');
    testComponent.showLastButton.set(true);
    testComponent.multiple.set(true);
    fixture.detectChanges();

    clickButton(nativeElement, 0);
    await fixture.whenStable();
    expect(testComponent.onValueChange).toHaveBeenCalledWith(['A']);

    clickButton(nativeElement, 5);
    await fixture.whenStable();
    expect(testComponent.onValueChange).toHaveBeenCalledWith(['A', 'F']);
  });
});
