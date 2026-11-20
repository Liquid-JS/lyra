import { Component, TemplateRef, inject, viewChild } from '@angular/core'
import { NbWindowService, NbButtonComponent } from '@liquid-js/lyr-core'

@Component({
    templateUrl: './template-window.component.html',
    styleUrls: ['./window.scss'],
    imports: [NbButtonComponent]
})
export class TemplateWindowComponent {
    private readonly windowService = inject(NbWindowService)

    readonly contentTemplate = viewChild.required<TemplateRef<any>>('contentTemplate')

    openWindow() {
        this.windowService.open(this.contentTemplate(), {
            title: 'Window content from template',
            context: { text: 'some text to pass into template' }
        })
    }
}
