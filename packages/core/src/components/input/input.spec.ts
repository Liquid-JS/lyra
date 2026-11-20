import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbThemeModule } from '@liquid-js/lyr-core';
import { By } from '@angular/platform-browser';
import { NbComponentStatus, NbComponentSize, NbComponentShape, NbInputModule } from '@liquid-js/lyr-core';

@Component({
  template: `
    <input #inputEl nbInput [fieldSize]="size()" [status]="status()" [shape]="shape()" [fullWidth]="fullWidth()" [ghost]="ghost()" />
    <textarea #textareaEl nbInput [fieldSize]="size()" [status]="status()" [shape]="shape()" [fullWidth]="fullWidth()" [ghost]="ghost()">
    </textarea>
  `,
  imports: [NbInputModule],
})
class InputTestComponent {
  readonly size = signal<NbComponentSize>('medium');
  readonly status = signal<NbComponentStatus>('basic');
  readonly shape = signal<NbComponentShape>('rectangle');
  readonly fullWidth = signal(false);
  readonly ghost = signal(false);
}

describe('Directive: NbInput', () => {
  let inputTestComponent: InputTestComponent;
  let fixture: ComponentFixture<InputTestComponent>;
  let inputElement: Element;
  let textareaElement: Element;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), NbInputModule, InputTestComponent],
    }).createComponent(InputTestComponent);

    inputTestComponent = fixture.componentInstance;

    inputElement = fixture.debugElement.query(By.css('textarea')).nativeElement;
    textareaElement = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should set status', () => {
    inputTestComponent.status.set('danger');
    fixture.detectChanges();

    expect(inputElement.classList).toContain('status-danger');
    expect(textareaElement.classList).toContain('status-danger');
  });

  it('should set size', () => {
    inputTestComponent.size.set('large');
    fixture.detectChanges();

    expect(inputElement.classList).toContain('size-large');
    expect(textareaElement.classList).toContain('size-large');
  });

  it('should set shape class', () => {
    inputTestComponent.shape.set('semi-round');
    fixture.detectChanges();

    expect(inputElement.classList).toContain('shape-semi-round');
    expect(textareaElement.classList).toContain('shape-semi-round');
  });

  it('should set full width', () => {
    inputTestComponent.fullWidth.set(true);
    fixture.detectChanges();

    expect(inputElement.classList).toContain('input-full-width');
    expect(textareaElement.classList).toContain('input-full-width');
  });

  it('should set ghost', () => {
    inputTestComponent.ghost.set(true);
    fixture.detectChanges();

    expect(inputElement.classList).toContain('input-ghost');
    expect(textareaElement.classList).toContain('input-ghost');
  });
});
