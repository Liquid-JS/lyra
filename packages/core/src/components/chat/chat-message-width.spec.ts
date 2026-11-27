import { Component, ViewEncapsulation } from '@angular/core'
import { TestBed } from '@angular/core/testing'

import { NbChatModule, NbThemeModule } from '@liquid-js/lyr-core'

const LONG = 'My invoice shows the wrong address, and the one before it did too, so could you check them both?'

@Component({
    // The theme applies in an element with its class.
    template: `
    <div class="nb-theme-default" dir="ltr" style="width: 28rem">
      <nb-chat class="wide" title="Support" [scrollBottom]="false">
        <nb-chat-message [message]="long" sender="Alex Taylor" />
      </nb-chat>
      <nb-chat class="narrow" title="Support" [scrollBottom]="false" style="--chat-message-max-width: 75%">
        <nb-chat-message [message]="long" sender="Alex Taylor" />
        <nb-chat-message message="Thanks!" sender="Jane Doe" reply />
      </nb-chat>
    </div>
  `,
    styleUrl: './chat-form-input.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbChatModule]
})
class ChatWidthHostComponent {
    readonly long = LONG
}

describe('A chat message\'s bubble', () => {
    it('should grow to the room beside the avatar, or as wide as chat-message-max-width lets it', async () => {
        const fixture = TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] }).createComponent(ChatWidthHostComponent)
        await fixture.whenStable()
        const element = fixture.nativeElement as HTMLElement
        const bubble = (chat: string, index = 0) => element.querySelectorAll<HTMLElement>(`.${chat} nb-chat-message-text .text`)[index]
        const room = (chat: string) => (element.querySelector(`.${chat} nb-chat-message-text`) as HTMLElement).getBoundingClientRect().width

        expect(bubble('wide').getBoundingClientRect().width).toBeCloseTo(room('wide'), 0)
        expect(bubble('narrow').getBoundingClientRect().width).toBeCloseTo(room('narrow') * 0.75, 0)
        // A short message keeps its own width.
        expect(bubble('narrow', 1).getBoundingClientRect().width).toBeLessThan(room('narrow') * 0.5)
    })
})
