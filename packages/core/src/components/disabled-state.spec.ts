import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  NbCheckboxModule,
  NbFileDropModule,
  NbSliderModule,
  NbTagModule,
  NbThemeModule,
  NbToggleModule,
} from '@liquid-js/lyr-core';

// The same control with both a `disabled` input and a form control: whichever changed last wins, in every control.
@Component({
  template: `
    <nb-checkbox [formControl]="checkbox" [disabled]="disabled()">Checkbox</nb-checkbox>
    <nb-toggle [formControl]="toggle" [disabled]="disabled()">Toggle</nb-toggle>
    <nb-slider [formControl]="slider" [disabled]="disabled()" aria-label="Slider" />
    <nb-file-drop [formControl]="files" [disabled]="disabled()" />
    <nb-tag-list [formControl]="tags" [disabled]="disabled()"><input nbTagInput /></nb-tag-list>
  `,
  imports: [ReactiveFormsModule, NbCheckboxModule, NbToggleModule, NbSliderModule, NbFileDropModule, NbTagModule],
})
class DisabledHostComponent {
  readonly disabled = signal(false);
  readonly checkbox = new FormControl(false);
  readonly toggle = new FormControl(false);
  readonly slider = new FormControl(5);
  readonly files = new FormControl<File[]>([]);
  readonly tags = new FormControl<string[]>([]);
}

describe('disabled controls', () => {
  let fixture: ComponentFixture<DisabledHostComponent>;

  const disabled = () => {
    const query = (selector: string) => fixture.nativeElement.querySelector(selector) as HTMLElement;
    return {
      checkbox: (query('nb-checkbox input') as HTMLInputElement).disabled,
      toggle: (query('nb-toggle input') as HTMLInputElement).disabled,
      slider: query('nb-slider [role="slider"]').getAttribute('aria-disabled') === 'true',
      files: (query('nb-file-drop input') as HTMLInputElement).disabled,
      tags: (query('nb-tag-list input') as HTMLInputElement).disabled,
    };
  };
  const all = (value: boolean) => ({ checkbox: value, toggle: value, slider: value, files: value, tags: value });
  const controls = () => {
    const host = fixture.componentInstance;
    return [host.checkbox, host.toggle, host.slider, host.files, host.tags];
  };
  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot(), DisabledHostComponent] });
    fixture = TestBed.createComponent(DisabledHostComponent);
    await render();
  });

  afterEach(() => fixture.destroy());

  it('should follow the disabled input or the form, whichever changed last', async () => {
    fixture.componentInstance.disabled.set(true);
    await render();
    expect(disabled()).toEqual(all(true));

    controls().forEach((control) => control.enable());
    await render();
    expect(disabled()).toEqual(all(false));

    controls().forEach((control) => control.disable());
    await render();
    expect(disabled()).toEqual(all(true));

    fixture.componentInstance.disabled.set(false);
    await render();
    expect(disabled()).toEqual(all(false));
  });
});
