import { Component, signal, ViewEncapsulation } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NbChatModule, NbThemeModule } from '@liquid-js/lyr-core'

@Component({
    // The theme applies in an element with its class.
    template: `
    <div class="nb-theme-default" dir="ltr" style="width: 24rem">
      <nb-chat-form [dropFiles]="dropFiles()" [buttonTitle]="buttonTitle()" (send)="sent.push($event)" />
    </div>
  `,
    styleUrl: './chat-form-input.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbChatModule]
})
class ChatFormHostComponent {
    readonly dropFiles = signal(true)
    readonly buttonTitle = signal('')
    readonly sent = new Array<{ message: string, files: File[] }>()
}

describe('NbChatFormComponent message field', () => {
    let fixture: ComponentFixture<ChatFormHostComponent>
    let host: ChatFormHostComponent
    let field: HTMLTextAreaElement

    const render = async () => {
        fixture.detectChanges()
        await fixture.whenStable()
    }
    const type = async (text: string) => {
        field.value = text
        field.dispatchEvent(new Event('input'))
        await render()
    }
    const enter = async (init: KeyboardEventInit = {}) => {
        const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true, ...init })
        field.dispatchEvent(event)
        await render()
        return event
    }
    const paste = async (files: File[]) => {
        const data = new DataTransfer()
        files.forEach((file) => data.items.add(file))
        const event = new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true })
        field.dispatchEvent(event)
        await render()
        return event
    }

    beforeEach(async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot(), NbChatModule.forRoot()] })
        fixture = TestBed.createComponent(ChatFormHostComponent)
        host = fixture.componentInstance
        await render()
        field = fixture.nativeElement.querySelector('textarea')
    })

    /** The send button's and the field's boxes, and where the field's text ends. */
    const boxes = () => {
        const button = (fixture.nativeElement as HTMLElement).querySelector('.send-button') as HTMLElement
        const style = getComputedStyle(field)
        const box = field.getBoundingClientRect()
        return {
            field: box,
            button: button.getBoundingClientRect(),
            textEnd: box.right - parseFloat(style.borderRightWidth) - parseFloat(style.paddingRight)
        }
    }

    it('should keep the send button in the field\'s corner, by the last line of a long message', async () => {
        await type('A message long enough to wrap onto several lines of the field, so the field grows taller than one line.')
        const { field: box, button, textEnd } = boxes()
        expect(box.height).toBeGreaterThan(button.height * 2)
        expect(box.right - button.right).toBeCloseTo(4, 0)
        expect(box.bottom - button.bottom).toBeCloseTo(4, 0)
        expect(textEnd).toBeLessThanOrEqual(button.left)
    })

    it('should end the text before a send button with a title', async () => {
        host.buttonTitle.set('Send message')
        await render()
        // The button reports its width after the next layout.
        for (let frame = 0; frame < 2; frame++) {
            await new Promise((resolve) => requestAnimationFrame(resolve))
        }
        const { field: box, button, textEnd } = boxes()
        expect(button.width).toBeGreaterThan(button.height * 2)
        expect(box.right - button.right).toBeCloseTo(4, 0)
        expect(textEnd).toBeLessThanOrEqual(button.left)
    })

    it('should send the message on Enter and clear the field', async () => {
        await type('Hello')
        const event = await enter()

        expect(event.defaultPrevented).toBe(true)
        expect(host.sent.map((sent) => sent.message)).toEqual(['Hello'])
        expect(field.value).toBe('')
    })

    it('should start a new line on Shift+Enter, and not send while composing', async () => {
        await type('Hello')
        expect((await enter({ shiftKey: true })).defaultPrevented).toBe(false)
        expect((await enter({ isComposing: true })).defaultPrevented).toBe(false)
        expect(host.sent).toEqual([])

        await type('Hello\nworld')
        await enter()
        expect(host.sent.map((sent) => sent.message)).toEqual(['Hello\nworld'])
    })

    const growsAndShrinks = async () => {
        const oneLine = field.getBoundingClientRect().height

        await type('One\nTwo\nThree')
        const threeLines = field.getBoundingClientRect().height
        expect(threeLines).toBeGreaterThan(oneLine * 2)
        expect(field.scrollHeight).toBeLessThanOrEqual(field.clientHeight)

        await type(Array.from({ length: 20 }, (_, i) => `Line ${i}`).join('\n'))
        // 8rem
        expect(field.getBoundingClientRect().height).toBe(128)
        expect(field.scrollHeight).toBeGreaterThan(field.clientHeight)

        await enter()
        expect(field.getBoundingClientRect().height).toBe(oneLine)
    }

    it('should grow with the message up to its maximum height, then scroll, and shrink when it is sent', growsAndShrinks)

    it("should size the field itself where the browser can't", async () => {
        fixture.destroy()
        vi.spyOn(CSS, 'supports').mockReturnValue(false)
        fixture = TestBed.createComponent(ChatFormHostComponent)
        host = fixture.componentInstance
        await render()
        field = fixture.nativeElement.querySelector('textarea')
        field.style.setProperty('field-sizing', 'fixed')

        await growsAndShrinks()
        vi.restoreAllMocks()
    })

    it('should add pasted files, e.g. a screenshot, when it takes files', async () => {
        const event = await paste([new File(['image'], 'screenshot.png', { type: 'image/png' })])

        expect(event.defaultPrevented).toBe(true)
        const remove = fixture.nativeElement.querySelector('.dropped-files button.remove') as HTMLButtonElement
        expect(remove.getAttribute('aria-label')).toBe('Remove screenshot.png')

        remove.click()
        await render()
        expect(fixture.nativeElement.querySelector('.dropped-files')).toBeNull()
    })

    it('should leave pasted text, and files when it takes none, to the field', async () => {
        const data = new DataTransfer()
        data.setData('text/plain', 'Hello')
        const text = new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true })
        field.dispatchEvent(text)
        expect(text.defaultPrevented).toBe(false)

        host.dropFiles.set(false)
        await render()
        const event = await paste([new File(['image'], 'screenshot.png', { type: 'image/png' })])
        expect(event.defaultPrevented).toBe(false)
        expect(fixture.nativeElement.querySelector('.dropped-files')).toBeNull()
    })
})

@Component({
    template: `
    <div class="nb-theme-default" dir="ltr" style="width: 24rem">
      @if (shown()) {
        <nb-chat-form buttonTitle="Send message" animate.leave="nb-chat-form-spec-leave" />
      }
    </div>
  `,
    styleUrl: './chat-form-input.spec.scss',
    styles: `
    .nb-chat-form-spec-leave { animation: nb-chat-form-spec-hold 1s; }
    @keyframes nb-chat-form-spec-hold { to { opacity: 1; } }
  `,
    encapsulation: ViewEncapsulation.None,
    imports: [NbChatModule]
})
class ChatFormLeavingHostComponent {
    readonly shown = signal(true)
}

describe('NbChatFormComponent leaving', () => {
    it('should keep its text clear of the send button while it leaves with an animation', async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot(), NbChatModule.forRoot()], animationsEnabled: true })
        const fixture = TestBed.createComponent(ChatFormLeavingHostComponent)
        fixture.detectChanges()
        await fixture.whenStable()
        for (let frame = 0; frame < 2; frame++) {
            await new Promise((resolve) => requestAnimationFrame(resolve))
        }
        const form = fixture.nativeElement.querySelector('nb-chat-form') as HTMLElement
        const field = form.querySelector('textarea') as HTMLTextAreaElement
        const padding = () => parseFloat(getComputedStyle(field).paddingRight)
        const before = padding()
        expect(before).toBeGreaterThan((form.querySelector('.send-button') as HTMLElement).getBoundingClientRect().height * 2)

        fixture.componentInstance.shown.set(false)
        fixture.detectChanges()

        expect(form.isConnected).toBe(true)
        expect(padding()).toBe(before)
    })
})
