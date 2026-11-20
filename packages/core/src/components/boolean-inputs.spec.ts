import { Component, viewChild } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { RouterModule } from '@angular/router'

import {
    NbCalendarComponent,
    NbCalendarModule,
    NbCardModule,
    NbChatFormComponent,
    NbChatModule,
    NbFlipCardComponent,
    NbPopoverDirective,
    NbPopoverModule,
    NbThemeModule,
    NbTooltipDirective,
    NbTooltipModule
} from '@liquid-js/lyr-core'

// Flags written as plain attributes: on their own they turn on, and "false" turns them off.
@Component({
    template: `
    <nb-chat-form dropFiles showButton="false" />
    <nb-calendar boundingMonth="false" showNavigation="false" />
    <nb-flip-card showToggleButton="false">
      <nb-card-front><nb-card>Front</nb-card></nb-card-front>
      <nb-card-back><nb-card>Back</nb-card></nb-card-back>
    </nb-flip-card>
    <button nbTooltip="Tip" nbTooltipDisabled>Tooltip</button>
    <button nbPopover="Popover" nbPopoverDisabled>Popover</button>
  `,
    imports: [NbChatModule, NbCalendarModule, NbCardModule, NbTooltipModule, NbPopoverModule]
})
class BooleanAttributesHostComponent {
    readonly chatForm = viewChild.required(NbChatFormComponent)
    readonly calendar = viewChild.required(NbCalendarComponent)
    readonly flipCard = viewChild.required(NbFlipCardComponent)
    readonly tooltip = viewChild.required(NbTooltipDirective)
    readonly popover = viewChild.required(NbPopoverDirective)
}

describe('boolean inputs', () => {
    it('should read plain attributes as flags', async () => {
        TestBed.configureTestingModule({
            imports: [RouterModule.forRoot([]), NbThemeModule.forRoot(), NbChatModule.forRoot()]
        })
        const fixture = TestBed.createComponent(BooleanAttributesHostComponent)
        fixture.detectChanges()
        await fixture.whenStable()
        const host = fixture.componentInstance

        expect(host.chatForm().dropFiles()).toBe(true)
        expect(host.chatForm().showButton()).toBe(false)
        expect(host.calendar().boundingMonth()).toBe(false)
        expect(host.calendar().showNavigation()).toBe(false)
        expect(host.flipCard().showToggleButton()).toBe(false)
        expect(host.tooltip().disabled()).toBe(true)
        expect(host.popover().isDisabled()).toBe(true)
    })
})
