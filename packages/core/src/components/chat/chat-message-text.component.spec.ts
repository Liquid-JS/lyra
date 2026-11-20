import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbChatModule, NbThemeModule } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-chat-message-text-test',
  template: `
    <nb-chat-message-text [sender]="sender()" [date]="date()" [dateFormat]="dateFormat()" [message]="message()" />
  `,
  imports: [NbChatModule],
})
export class NbChatMessageTextTestComponent {
  readonly sender = signal<string | undefined>(undefined);
  readonly dateFormat = signal('shortTime');
  readonly message = signal<string | undefined>(undefined);
  readonly date = signal<Date | undefined>(undefined);
}

describe('Chat-message-text component: NbChatMessageTextTestComponent', () => {
  let fixture: ComponentFixture<NbChatMessageTextTestComponent>;
  let component: NbChatMessageTextTestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), NbChatModule, NbChatMessageTextTestComponent],
    });

    fixture = TestBed.createComponent(NbChatMessageTextTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set all inputs', () => {
    component.sender.set('AB');
    component.message.set('new text message');
    component.date.set(new Date());
    component.dateFormat.set('shortTime');
    fixture.detectChanges();

    const msgValue = fixture.nativeElement.querySelector('.text').textContent;
    expect(msgValue).toContain('new text message');

    const senderInitials = fixture.nativeElement.querySelector('.sender').textContent;
    expect(senderInitials).toContain('AB');

    const time = fixture.nativeElement.querySelector('time');
    expect(time).toBeTruthy();
  });

  // The message aligns by its own direction; the sender keeps the bubble's alignment.
  it('should give the message and the sender their own direction', () => {
    component.sender.set('Jane Doe');
    component.message.set('See you tomorrow');
    component.date.set(new Date());
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('.text')?.getAttribute('dir')).toBe('auto');
    expect(element.querySelector('.text')?.textContent?.trim()).toBe('See you tomorrow');
    expect(element.querySelector('.sender')?.hasAttribute('dir')).toBe(false);
    expect(element.querySelector('.sender [dir="auto"]')?.textContent).toBe('Jane Doe');
  });

  it('should not show sender if it is not provided', () => {
    component.message.set('some test message');
    fixture.detectChanges();
    const sender = fixture.nativeElement.querySelector('.sender');
    expect(sender).toBeFalsy();
  });

  it('should not show message if it is not provided', () => {
    component.sender.set('JD');
    fixture.detectChanges();
    const sender = fixture.nativeElement.querySelector('.message');
    expect(sender).toBeFalsy();
  });
});
