import { Component } from '@angular/core'
import { NbButtonComponent, NbPopoverDirective, NbTooltipDirective } from '@liquid-js/lyr-core'

import { combinations, kit, STATUSES } from './specimen'

/** Tooltips in each status and a popover, open, as the capture opens them, without what opens them. */
@Component({
    template: `
        <div class="specimens"
            style="gap: 6rem; padding: 4rem">
            @for (tooltip of tooltips; track $index) {
            <div [attr.data-kit]="kit('tooltip', tooltip)"
                data-kit-open="button"
                data-kit-overlay-only>
                <button nbButton
                    size="small"
                    nbTooltip="A short hint"
                    [nbTooltipStatus]="tooltip.status">Hover</button>
            </div>
            }
            <div [attr.data-kit]="kit('popover', {})"
                data-kit-open="button"
                data-kit-overlay-only>
                <button nbButton
                    size="small"
                    nbPopover="More about this, in a few words.">Open</button>
            </div>
        </div>
    `,
    imports: [NbButtonComponent, NbTooltipDirective, NbPopoverDirective]
})
export class TooltipSpecimenComponent {
    readonly kit = kit
    readonly tooltips = combinations({ status: ['', ...STATUSES] as const })
}
