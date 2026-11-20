import {
    Component,
    ComponentRef,
    input,
    OnChanges,
    output,
    TemplateRef,
    Type,
    viewChild,
    ViewContainerRef
} from '@angular/core'

import { setComponentContext } from '@liquid-js/lyr-core/cdk'
import { NbCalendarCell, NbCalendarSize, NbCalendarSizeValues } from '../../model'

@Component({
    selector: 'nb-calendar-picker-row',
    styles: [
        `
      :host {
        display: flex;
        justify-content: space-between;
      }
    `
    ],
    template: '<ng-template />',
    host: {
        role: 'row'
    }
})
export class NbCalendarPickerRowComponent<D, T> implements OnChanges {
    readonly row = input.required<Array<D | undefined>>()
    readonly selectedValue = input<T>()
    readonly visibleDate = input<D>()
    readonly component = input.required<Type<NbCalendarCell<D, T>>>()
    readonly min = input<D>()
    readonly max = input<D>()
    readonly filter = input<(date: D) => boolean>()
    readonly size = input<NbCalendarSize, NbCalendarSizeValues>(NbCalendarSize.MEDIUM, {
        transform: (size) => size as NbCalendarSize
    })

    readonly select = output<D>()

    protected readonly containerRef = viewChild.required(TemplateRef, { read: ViewContainerRef })

    ngOnChanges() {
        const containerRef = this.containerRef()
        containerRef.clear()

        this.row().forEach((date) => {
            const component = containerRef.createComponent(this.component(), { index: containerRef.length })
            this.patchWithContext(component, date)
            component.changeDetectorRef.detectChanges()
        })
    }

    private patchWithContext(component: ComponentRef<NbCalendarCell<D, T>>, date?: D) {
        setComponentContext(component, {
            visibleDate: this.visibleDate(),
            selectedValue: this.selectedValue(),
            date,
            min: this.min(),
            max: this.max(),
            filter: this.filter(),
            size: this.size()
        })
        component.instance.select.subscribe((selected: D) => this.select.emit(selected))
    }
}
