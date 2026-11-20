import { assert } from 'vitest';
import { Component, TemplateRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { userEvent } from 'vitest/browser';

import {
  NbDialogModule,
  NbDialogService,
  NbPopoverModule,
  NbThemeModule,
  NbTooltipModule,
  NbWindowModule,
  NbWindowService,
} from '@liquid-js/lyr-core';

@Component({
  template: `
    <button class="page-popover" [nbPopover]="popoverContent">Page popover</button>
    <ng-template #popoverContent><button class="in-popover">In the popover</button></ng-template>
    <ng-template #withPopover>
      <button class="dialog-popover" [nbPopover]="popoverContent">Dialog popover</button>
      <button class="dialog-tooltip" nbTooltip="A hint">Dialog tooltip</button>
    </ng-template>
    <ng-template #plain><button class="in-dialog">In the dialog</button></ng-template>
  `,
  imports: [NbPopoverModule, NbTooltipModule],
})
class EscapeHostComponent {
  readonly withPopover = viewChild.required<TemplateRef<unknown>>('withPopover');
  readonly plain = viewChild.required<TemplateRef<unknown>>('plain');
}

describe('Escape with overlays open', () => {
  let fixture: ComponentFixture<EscapeHostComponent>;
  let dialogs: NbDialogService;

  const element = <T extends HTMLElement = HTMLElement>(selector: string) => {
    const found = document.querySelector<T>(selector);
    assert(found, `${selector} not rendered`);
    return found;
  };
  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };
  const settle = () => new Promise((resolve) => setTimeout(resolve, 200));
  const escape = async () => {
    await userEvent.keyboard('{Escape}');
    await render();
  };
  const openPopover = async (selector: string) => {
    element(selector).click();
    await render();
    await expect.poll(() => document.querySelector('.in-popover')).toBeTruthy();
    element('.in-popover').focus();
  };

  beforeEach(async () => {
    fixture = TestBed.configureTestingModule({
      imports: [
        NbThemeModule.forRoot(),
        NbDialogModule.forRoot(),
        NbWindowModule.forRoot(),
        EscapeHostComponent,
      ],
    }).createComponent(EscapeHostComponent);
    document.body.appendChild(fixture.nativeElement);
    dialogs = TestBed.inject(NbDialogService);
    await render();
  });

  afterEach(() => {
    fixture.destroy();
    document.querySelectorAll('.cdk-overlay-container').forEach((container) => container.remove());
  });

  it('should close a popover in a dialog, back to its button, and then the dialog', async () => {
    const closed = vi.fn();
    dialogs.open(fixture.componentInstance.withPopover()).onClose.subscribe(closed);
    await render();
    await openPopover('.dialog-popover');

    await escape();
    expect(document.querySelector('.in-popover')).toBeNull();
    expect(document.activeElement).toBe(element('.dialog-popover'));
    await settle();
    expect(closed).not.toHaveBeenCalled();

    await escape();
    await expect.poll(() => closed.mock.calls.length).toBe(1);
  });

  it('should close a tooltip in a dialog, and then the dialog', async () => {
    const closed = vi.fn();
    dialogs.open(fixture.componentInstance.withPopover()).onClose.subscribe(closed);
    await render();
    element('.dialog-tooltip').dispatchEvent(new Event('mouseenter'));
    await expect.poll(() => document.querySelector('nb-tooltip')).toBeTruthy();

    await escape();
    expect(document.querySelector('nb-tooltip')).toBeNull();
    await settle();
    expect(closed).not.toHaveBeenCalled();

    await escape();
    await expect.poll(() => closed.mock.calls.length).toBe(1);
  });

  it('should close only the dialog on top', async () => {
    const first = vi.fn();
    const second = vi.fn();
    dialogs.open(fixture.componentInstance.plain()).onClose.subscribe(first);
    dialogs.open(fixture.componentInstance.plain()).onClose.subscribe(second);
    await render();

    await escape();
    await expect.poll(() => second.mock.calls.length).toBe(1);
    expect(first).not.toHaveBeenCalled();
  });

  it('should cancel a confirmation opened from a dialog, not the dialog', async () => {
    const closed = vi.fn();
    dialogs.open(fixture.componentInstance.plain()).onClose.subscribe(closed);
    await render();
    const confirmed = dialogs.confirm({ title: 'Delete the invoice?' });
    await render();

    await escape();
    await expect(confirmed).resolves.toBe(false);
    await settle();
    expect(closed).not.toHaveBeenCalled();
  });

  it('should keep Escape from what is under a dialog that does not close on it', async () => {
    await openPopover('.page-popover');
    const closed = vi.fn();
    dialogs.open(fixture.componentInstance.plain(), { closeOnEsc: false }).onClose.subscribe(closed);
    await render();

    await escape();
    await settle();
    expect(closed).not.toHaveBeenCalled();
    expect(document.querySelector('.in-popover')).toBeTruthy();
  });

  it('should close the window in front, not a minimized one', async () => {
    const windows = TestBed.inject(NbWindowService);
    const first = vi.fn();
    const second = vi.fn();
    const firstRef = windows.open(fixture.componentInstance.plain(), { title: 'First' });
    firstRef.onClose.subscribe(first);
    const secondRef = windows.open(fixture.componentInstance.plain(), { title: 'Second' });
    secondRef.onClose.subscribe(second);
    await render();

    firstRef.toFront();
    await escape();
    // A window fades out before it's closed.
    await settle();
    expect(first).toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled();

    secondRef.minimize();
    await escape();
    await settle();
    expect(second).not.toHaveBeenCalled();
  });
});
