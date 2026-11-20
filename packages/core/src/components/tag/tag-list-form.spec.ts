import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { NbTagModule, NbThemeModule, NbValidationModule } from '@liquid-js/lyr-core';

@Component({
  template: `
    <nb-tag-list [formControl]="control" [tagValidator]="validator()" nbValidation>
      <input nbTagInput aria-label="Emails" [separatorKeys]="separators" />
    </nb-tag-list>
  `,
  imports: [ReactiveFormsModule, NbTagModule, NbValidationModule],
})
class TagFormHostComponent {
  readonly control = new FormControl<string[]>(['a@example.com'], Validators.required);
  readonly separators = [ENTER, COMMA];
  readonly validator = signal<(tag: string) => boolean>(() => true);
}

describe('NbTagListComponent as a form control', () => {
  let fixture: ComponentFixture<TagFormHostComponent>;
  let host: TagFormHostComponent;

  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };
  const list = () => fixture.nativeElement.querySelector('nb-tag-list') as HTMLElement;
  const input = () => list().querySelector('input') as HTMLInputElement;
  const tagTexts = () => [...list().querySelectorAll('nb-tag')].map((tag) => tag.textContent?.trim());
  // The separator keys are key codes, which synthetic keyboard events leave at 0.
  const keyCodes: Record<string, number> = { Enter: ENTER, ',': COMMA };
  const press = async (key: string) => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true });
    Object.defineProperty(event, 'keyCode', { value: keyCodes[key] });
    input().dispatchEvent(event);
    await render();
  };
  const type = async (text: string) => {
    input().value = text;
    input().dispatchEvent(new Event('input'));
    await render();
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] });
    fixture = TestBed.createComponent(TagFormHostComponent);
    host = fixture.componentInstance;
    await render();
  });

  it('should show a tag for each value', () => {
    expect(tagTexts()).toEqual(['a@example.com']);
  });

  it('should add typed text on a separator key', async () => {
    await type('b@example.com');
    await press('Enter');

    expect(host.control.value).toEqual(['a@example.com', 'b@example.com']);
    expect(tagTexts()).toEqual(['a@example.com', 'b@example.com']);
    expect(input().value).toBe('');
  });

  it('should skip duplicates and empty text', async () => {
    await type(' a@example.com , ,c@example.com');
    await press('Enter');

    expect(host.control.value).toEqual(['a@example.com', 'c@example.com']);
  });

  it('should keep rejected text in the input', async () => {
    host.validator.set((tag) => tag.includes('@'));
    await render();
    await type('b@example.com, nope, also-nope');
    await press('Enter');

    expect(host.control.value).toEqual(['a@example.com', 'b@example.com']);
    expect(input().value).toBe('nope, also-nope');
  });

  it('should add text left in the input when it loses focus, and mark the control touched', async () => {
    input().focus();
    await type('d@example.com');
    input().blur();
    await render();

    expect(host.control.value).toEqual(['a@example.com', 'd@example.com']);
    expect(host.control.touched).toBe(true);
  });

  it('should split a pasted list into tags', async () => {
    input().dispatchEvent(new Event('paste'));
    input().value = 'e@example.com, f@example.com';
    await new Promise((resolve) => setTimeout(resolve));
    await render();

    expect(host.control.value).toEqual(['a@example.com', 'e@example.com', 'f@example.com']);
  });

  it('should remove a tag with its remove button', async () => {
    (list().querySelector('nb-tag .nb-tag-remove, nb-tag nb-icon') as HTMLElement).click();
    await render();

    expect(host.control.value).toEqual([]);
    expect(tagTexts()).toEqual([]);
  });

  it('should move to the tags and remove them with Backspace, without its default action', async () => {
    const backspace = (target: HTMLElement) => {
      const event = new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, cancelable: true });
      Object.defineProperty(event, 'keyCode', { value: 8 });
      target.dispatchEvent(event);
      return event;
    };
    input().focus();
    // Outside a text field Backspace goes back in some browsers, so neither press may keep its default.
    expect(backspace(input()).defaultPrevented).toBe(true);
    await render();
    expect(document.activeElement).toBe(list());

    expect(backspace(list()).defaultPrevented).toBe(true);
    await render();
    expect(host.control.value).toEqual([]);
  });

  it('should show values written to the control', async () => {
    host.control.setValue(['x', 'y']);
    await render();

    expect(tagTexts()).toEqual(['x', 'y']);
  });

  it('should disable its input and tags with the control', async () => {
    host.control.disable();
    await render();

    expect(input().disabled).toBe(true);
    expect(list().querySelector('nb-tag nb-icon')).toBeNull();
  });

  it('should show validation on the list and its input', async () => {
    host.control.setValue([]);
    host.control.markAsTouched();
    await render();

    expect(list().classList).toContain('status-danger');
    expect(input().getAttribute('aria-invalid')).toBe('true');
    expect(list().hasAttribute('aria-invalid')).toBe(false);
  });
});
