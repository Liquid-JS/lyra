import { Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NbChatModule, NbThemeModule } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-chat-message-quote-test',
    template: `
    <nb-chat-message-quote [sender]="sender()"
      [date]="date()"
      [dateFormat]="dateFormat()"
      [message]="message()"
      [quote]="quote()"
     />
  `,
    imports: [NbChatModule]
})
export class NbChatMessageQuoteTestComponent {
    readonly sender = signal<string | undefined>(undefined)
    readonly dateFormat = signal('shortTime')
    readonly message = signal<string | undefined>(undefined)
    readonly date = signal<Date | undefined>(undefined)
    readonly quote = signal<string | undefined>(undefined)
}

describe('Chat-message-quote component: NbChatMessageQuoteTestComponent', () => {
    let fixture: ComponentFixture<NbChatMessageQuoteTestComponent>
    let component: NbChatMessageQuoteTestComponent

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbChatModule, NbChatMessageQuoteTestComponent]
        })

        fixture = TestBed.createComponent(NbChatMessageQuoteTestComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should be created', () => {
        expect(component).toBeTruthy()
    })

    it('quote should be created', () => {
        component.message.set('some test message')
        component.date.set(new Date())
        component.dateFormat.set('shortTime')
        component.quote.set('quote')
        fixture.detectChanges()
        const quoteElement = fixture.nativeElement.querySelector('.quote')
        expect(quoteElement).toBeTruthy()
        // The quote aligns by its own direction.
        expect(quoteElement.getAttribute('dir')).toBe('auto')
        expect(quoteElement.textContent?.trim()).toBe('quote')
    })

    it('should be created inner chat message', () => {
        component.message.set('some test message')
        component.date.set(new Date())
        component.dateFormat.set('shortTime')
        component.quote.set('quote')
        fixture.detectChanges()
        const quoteElement = fixture.nativeElement.querySelector('nb-chat-message-text')
        expect(quoteElement).toBeTruthy()
    })
})
