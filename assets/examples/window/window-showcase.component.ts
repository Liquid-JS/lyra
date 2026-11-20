import { Component, inject } from '@angular/core'
import { NbWindowService, NbButtonComponent } from '@liquid-js/lyr-core'
import { FormComponent } from './components/form.component'

@Component({
    template: '<button (click)="openWindow()" nbButton>Open window</button>',
    styleUrls: ['./window.scss'],
    imports: [NbButtonComponent]
})
export class WindowShowcaseComponent {
    private readonly windowService = inject(NbWindowService)

    openWindow() {
        this.windowService.open(FormComponent, { title: 'Window' })
    }
}
