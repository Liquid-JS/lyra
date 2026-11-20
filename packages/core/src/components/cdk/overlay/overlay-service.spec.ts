import { assert } from 'vitest';
import {
  booleanAttribute,
  Component,
  ComponentRef,
  input,
  model,
  OnChanges,
  signal,
  SimpleChanges,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { setComponentContext } from './overlay-service';

@Component({
  template: '{{ title() }} {{ count() }} {{ label }} {{ note() }} {{ plain }}',
})
class NbContextTargetComponent implements OnChanges {
  readonly title = input<string>();
  count = input(0);
  disabled = input(false, { transform: booleanAttribute });
  value = model('');
  readonly _label = input<string>(undefined, { alias: 'label' });
  note = signal('');
  plain?: string;

  changes = new Array<SimpleChanges>();

  get label() {
    return this._label();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.changes.push(changes);
  }
}

describe('setComponentContext', () => {
  it('should set inputs by property and public name, signals and plain fields', () => {
    const fixture = TestBed.createComponent(NbContextTargetComponent);
    fixture.detectChanges();

    setComponentContext(fixture.componentRef, { title: 'A', count: 2, label: 'B', note: 'C', plain: 'D' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent.trim()).toBe('A 2 B C D');
  });

  it('should record input changes', () => {
    const fixture = TestBed.createComponent(NbContextTargetComponent);
    fixture.detectChanges();

    setComponentContext(fixture.componentRef, { title: 'A', _label: 'B' });
    fixture.detectChanges();

    const lastChange = fixture.componentInstance.changes.at(-1);
    assert(lastChange, 'no input changes recorded');
    expect(Object.keys(lastChange)).toEqual(['title', '_label']);
  });

  it('should re-render an OnPush component for a field that is not an input', () => {
    const fixture = TestBed.createComponent(NbContextTargetComponent);
    fixture.detectChanges();

    setComponentContext(fixture.componentRef, { plain: 'D' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent.replace(/\s+/g, ' ').trim()).toBe('0 D');
  });

  it('should type the context from the component', () => {
    // Compiled, not run: each `@ts-expect-error` fails the build once the type accepts the value it marks.
    const typeChecks = (ref: ComponentRef<NbContextTargetComponent>) => {
      setComponentContext(ref, { title: 'A', count: 1, disabled: '', value: 'B', note: 'C', plain: 'D' });
      // @ts-expect-error a signal input takes its value, not a signal
      setComponentContext(ref, { count: signal(1) });
      // @ts-expect-error the value has the input's type
      setComponentContext(ref, { count: '1' });
      // @ts-expect-error a writable signal takes its value
      setComponentContext(ref, { note: 1 });
      // @ts-expect-error only members of the component
      setComponentContext(ref, { unknown: 1 });
    };
    expect(typeChecks).toBeDefined();
  });
});
