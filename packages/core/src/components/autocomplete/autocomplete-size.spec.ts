import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  NbAutocompleteModule,
  NbComponentSize,
  NbInputDirective,
  NbThemeModule,
  provideNbComponentDefaults,
} from '@liquid-js/lyr-core';

@Component({
  template: `
    <input nbInput [fieldSize]="fieldSize()" [nbAutocomplete]="auto" />
    <nb-autocomplete #auto [size]="size()">
      <nb-option value="one">One</nb-option>
    </nb-autocomplete>
    <input class="plain" [nbAutocomplete]="plain" />
    <nb-autocomplete #plain>
      <nb-option value="two">Two</nb-option>
    </nb-autocomplete>
  `,
  imports: [NbAutocompleteModule, NbInputDirective],
})
class AutocompleteSizeHostComponent {
  readonly fieldSize = signal<NbComponentSize | undefined>(undefined);
  readonly size = signal<NbComponentSize | undefined>(undefined);
}

describe('nb-autocomplete size', () => {
  let fixture: ComponentFixture<AutocompleteSizeHostComponent>;

  const list = () => document.querySelector('nb-option-list');
  const open = async (selector: string) => {
    const input = fixture.nativeElement.querySelector(selector) as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    await expect.poll(list).toBeTruthy();
  };

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), AutocompleteSizeHostComponent],
      providers: [provideNbComponentDefaults({ input: { size: 'small' } })],
    }).createComponent(AutocompleteSizeHostComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    document.querySelectorAll('.cdk-overlay-container').forEach((container) => container.remove());
  });

  it('should match the field it is attached to, as it changes, unless it has a size', async () => {
    await open('input[nbInput]');
    expect(list()?.classList).toContain('size-small');

    fixture.componentInstance.fieldSize.set('large');
    fixture.detectChanges();
    expect(list()?.classList).toContain('size-large');

    fixture.componentInstance.size.set('tiny');
    fixture.detectChanges();
    expect(list()?.classList).toContain('size-tiny');
  });

  it('should take the app\'s size for fields on an input that is not a field', async () => {
    await open('input.plain');
    expect(list()?.classList).toContain('size-small');
  });
});
