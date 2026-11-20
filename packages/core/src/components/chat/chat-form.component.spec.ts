import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbChatFormComponent, NbChatModule, NbThemeModule } from '@liquid-js/lyr-core';

describe('NbChatFormComponent', () => {
  let fixture: ComponentFixture<NbChatFormComponent>;
  let chatFormComponent: NbChatFormComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), NbChatModule.forRoot()],
    });

    fixture = TestBed.createComponent(NbChatFormComponent);
    chatFormComponent = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('inputStatus', () => {

    it('should return basic status by default', () => {
      expect(chatFormComponent.inputStatus()).toEqual('basic');
    });

    it('should return component status if input focused', () => {
      chatFormComponent.status.set('info');
      chatFormComponent.inputFocus.set(true);

      expect(chatFormComponent.inputStatus()).toEqual('info');
    });

    it('should return component status if input hovered', () => {
      chatFormComponent.status.set('info');
      chatFormComponent.inputHover.set(true);

      expect(chatFormComponent.inputStatus()).toEqual('info');
    });

    it('should return primary if file over and status is basic or control', () => {
      chatFormComponent.fileOver.set(true);

      expect(chatFormComponent.inputStatus()).toEqual('primary');
    });

    it('should return status if file over and status is not basic nor control', () => {
      chatFormComponent.status.set('info');
      chatFormComponent.fileOver.set(true);

      expect(chatFormComponent.inputStatus()).toEqual('info');
    });
  });

  describe('buttonStatus', () => {

    it('should return primary if status is basic or control', () => {
      chatFormComponent.status.set('basic');
      expect(chatFormComponent.buttonStatus()).toEqual('primary');

      chatFormComponent.status.set('control');
      expect(chatFormComponent.buttonStatus()).toEqual('primary');
    });

    it('should return status if status is not basic nor control', () => {
      chatFormComponent.status.set('info');

      expect(chatFormComponent.buttonStatus()).toEqual('info');
    });
  });

  describe('chat-form input change event', () => {
    it('should emit changed input event', async () => {
      const onInputChange = vi.fn();
      const chatFormInput = fixture.nativeElement.querySelector('textarea');
      fixture.componentInstance.onInputChange.subscribe(onInputChange);
      chatFormInput.value = 'new input value';
      chatFormInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();
      expect(onInputChange).toHaveBeenCalled();
    });

    // The message takes its own direction; the empty field keeps the page's, for the placeholder.
    it('should take the direction of the message', () => {
      const chatFormInput: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
      expect(chatFormInput.hasAttribute('dir')).toBe(false);

      chatFormInput.value = 'new input value';
      chatFormInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(chatFormInput.getAttribute('dir')).toBe('auto');

      chatFormInput.value = '';
      chatFormInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(chatFormInput.hasAttribute('dir')).toBe(false);
    });
  });
});
