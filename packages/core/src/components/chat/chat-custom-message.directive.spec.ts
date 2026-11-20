import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbChatModule, NbThemeModule, NbChatCustomMessageService } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-custom-message-directive-test',
  template: `
    <div *nbCustomMessage="customMessageType">
      <p>Hello world</p>
    </div>
  `,
  imports: [NbChatModule],
})
export class NbCustomMessageTestComponent {
  customMessageType = 'simpleMessageType';
}

describe('Directive chat-custom-message-directive: NbCustomMessageTestComponent', () => {
  let fixture: ComponentFixture<NbCustomMessageTestComponent>;
  let component: NbCustomMessageTestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), NbChatModule, NbCustomMessageTestComponent],
      providers: [NbChatCustomMessageService],
    });

    fixture = TestBed.createComponent(NbCustomMessageTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
