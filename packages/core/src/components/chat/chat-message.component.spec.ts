import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbChatMessageComponent, NbChatModule, NbThemeModule, NbChatCustomMessageService } from '@liquid-js/lyr-core';

interface TestMessage {
  text?: string;
  reply: boolean;
  type: string;
  optionalData?: { href: string; label: string };
  date: Date;
  user: { name: string; avatar: string };
}

@Component({
  selector: 'nb-chat-message-test',
  template: `
    <nb-chat size="large">
      @for (msg of messages(); track msg) {
        <nb-chat-message
          [type]="msg.type"
          [message]="msg.text"
          [reply]="msg.reply"
          [sender]="msg.user.name"
          [date]="msg.date"
          [avatar]="msg.user.avatar"
          [customMessageData]="msg.optionalData"
        >
          <div *nbCustomMessage="'link'; let data">
            <a [href]="data.href">{{ data.label }}</a>
          </div>
        </nb-chat-message>
      }
      <nb-chat-form [dropFiles]="false" />
    </nb-chat>
  `,
  imports: [NbChatModule],
})
export class NbChatMessageTestComponent {
  readonly messages = signal(new Array<TestMessage>());

  loadMessages() {
    this.messages.set([
      {
        reply: false,
        type: 'link',
        optionalData: {
          href: 'https://akveo.github.io/ngx-admin/',
          label: 'Visit Akveo Lyra',
        },
        date: new Date(),
        user: {
          name: 'Frodo Baggins',
          avatar: 'https://i.gifer.com/no.gif',
        },
      },
      {
        text: 'Hello, how are you?',
        reply: true,
        type: 'text',
        date: new Date(),
        user: {
          name: 'Bilbo Baggins',
          avatar: '',
        },
      },
    ]);
  }
}

describe('Chat-message component: NbChatMessageTestComponent', () => {
  let fixture: ComponentFixture<NbChatMessageTestComponent>;
  let component: NbChatMessageTestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), NbChatModule, NbChatMessageTestComponent],
    });

    fixture = TestBed.createComponent(NbChatMessageTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should create custom messages with content', () => {
    component.loadMessages();
    fixture.detectChanges();

    const customMessageElement = fixture.nativeElement.querySelector('a');
    expect(customMessageElement).toBeTruthy();

    const linkHref = customMessageElement.getAttribute('href');
    expect(linkHref).toBe('https://akveo.github.io/ngx-admin/');

    const linkLabel = customMessageElement.textContent;
    expect(linkLabel).toBe('Visit Akveo Lyra');
  });
});

describe('Component: NbChatMessageComponent', () => {
  let chat: NbChatMessageComponent;
  let fixture: ComponentFixture<NbChatMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), NbChatModule],
      providers: [NbChatCustomMessageService],
    });

    fixture = TestBed.createComponent(NbChatMessageComponent);
    chat = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(chat).toBeTruthy();
  });

  it('should show the time by default', () => {
    fixture.componentRef.setInput('type', 'text');
    fixture.componentRef.setInput('sender', 'John Connor');
    fixture.componentRef.setInput('message', 'Hello');
    fixture.componentRef.setInput('date', new Date(2026, 0, 15, 10, 30));
    fixture.detectChanges();

    const time = fixture.nativeElement.querySelector('time').textContent;
    expect(time).toContain('10:30');
    expect(time).not.toContain('2026');
  });

  it('ChatMessageComponent testing getInitials method', () => {
    fixture.componentRef.setInput('sender', '');
    fixture.detectChanges();
    expect(chat.getInitials()).toEqual('');

    fixture.componentRef.setInput('sender', 'John Connor');
    fixture.detectChanges();
    expect(chat.getInitials()).toEqual('JC');
  });

  it('ChatMessageComponent testing _isDefaultMessageType method', () => {
    fixture.componentRef.setInput('type', null);
    expect(chat._isBuiltInMessageType()).toBe(true);
    fixture.componentRef.setInput('type', undefined);
    expect(chat._isBuiltInMessageType()).toBe(true);
    fixture.componentRef.setInput('type', 'text');
    expect(chat._isBuiltInMessageType()).toBe(true);
    fixture.componentRef.setInput('type', 'file');
    expect(chat._isBuiltInMessageType()).toBe(true);
    fixture.componentRef.setInput('type', 'map');
    expect(chat._isBuiltInMessageType()).toBe(true);
    fixture.componentRef.setInput('type', 'quote');
    expect(chat._isBuiltInMessageType()).toBe(true);
    fixture.componentRef.setInput('type', 'link');
    expect(chat._isBuiltInMessageType()).toBe(false);
    fixture.componentRef.setInput('type', 'button');
    expect(chat._isBuiltInMessageType()).toBe(false);
  });
});
