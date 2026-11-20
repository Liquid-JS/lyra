import { Component, OnDestroy, signal, TemplateRef, viewChild } from '@angular/core'
import {
    NbButtonComponent,
    NbPopoverDirective,
    NbOverlayContent,
    NbPosition,
    NbTrigger,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbTabsetComponent,
    NbTabComponent,
    NbListComponent,
    NbListItemComponent
} from '@liquid-js/lyr-core'
import { PopoverListComponent, PopoverTabsComponent } from './components/dynamic.components'

@Component({
    selector: 'nb-popover-dynamic-code',
    templateUrl: './popover-dynamic-code.component.html',
    styleUrls: ['./popover-dynamic.scss'],
    imports: [
        NbButtonComponent,
        NbPopoverDirective,
        NbCardComponent,
        NbCardHeaderComponent,
        NbTabsetComponent,
        NbTabComponent,
        NbCardBodyComponent,
        NbListComponent,
        NbListItemComponent
    ]
})
export class PopoverDynamicCodeComponent implements OnDestroy {
    readonly templateTabs = viewChild.required('tabs', { read: TemplateRef })
    readonly templateList = viewChild.required('list', { read: TemplateRef })

    readonly componentList = PopoverListComponent
    readonly componentTabs = PopoverTabsComponent
    readonly textContent = 'Hello World'

    // The popover's inputs are bound to these, so changing them rebuilds the popover.
    readonly content = signal<NbOverlayContent>(this.componentList)
    readonly trigger = signal<NbTrigger | `${NbTrigger}`>(NbTrigger.CLICK)
    readonly placement = signal<NbPosition | `${NbPosition}`>(NbPosition.BOTTOM)

    readonly interval = signal<ReturnType<typeof setInterval> | undefined>(undefined)

    stopRuntimeChange() {
        clearInterval(this.interval())
        this.interval.set(undefined)
    }

    changeComponent(component: NbOverlayContent) {
        this.content.set(component)
    }

    changeTrigger(trigger: NbTrigger | `${NbTrigger}`) {
        this.trigger.set(trigger)
    }

    changePlacement(placement: NbPosition | `${NbPosition}`) {
        this.placement.set(placement)
    }

    startRuntimeChange() {
        if (!this.interval()) {
            const items = [
                this.componentList,
                this.componentTabs,
                this.templateList(),
                this.templateTabs(),
                this.textContent
            ]
            this.interval.set(
                setInterval(() => this.changeComponent(items[Math.floor(Math.random() * items.length)]), 2000)
            )
        }
    }

    ngOnDestroy() {
        clearInterval(this.interval())
    }
}
