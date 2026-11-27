import { Component } from '@angular/core'
import { NbTabComponent, NbTabsetComponent } from '@liquid-js/lyr-core'

import { combinations, kit } from './specimen'

/**
 * Tabs: the active one, one with a badge, one with an icon and a plain one, as wide as their titles or the set; a
 * disabled one is the Tab symbol's look.
 */
@Component({
    template: `
        <div class="specimens">
            @for (tabset of tabsets; track $index) {
            <nb-tabset [attr.data-kit]="kit('tabset', tabset)"
                [fullWidth]="tabset.fullWidth"
                style="width: 36rem">
                <nb-tab tabTitle="Overview"
                    [active]="true">Overview content</nb-tab>
                <nb-tab tabTitle="Activity"
                    badgeText="3"
                    badgeStatus="danger">Activity content</nb-tab>
                <nb-tab tabTitle="Files"
                    tabIcon="folder-outline">Files content</nb-tab>
                <nb-tab tabTitle="Archive">Archive content</nb-tab>
            </nb-tabset>
            }
        </div>
    `,
    imports: [NbTabsetComponent, NbTabComponent]
})
export class TabsetSpecimenComponent {
    readonly kit = kit
    readonly tabsets = combinations({ fullWidth: [false, true] })
}
