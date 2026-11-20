import { Component, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
    NB_WINDOW,
    NbButtonComponent,
    NbButtonGroupComponent,
    NbButtonToggleDirective,
    NbCardBodyComponent,
    NbCardComponent,
    NbIconComponent,
    NbToastrService
} from '@liquid-js/lyr-core'

import { ShowcaseGlowComponent } from '../shared/showcase-glow.component'
import { ShowcaseLogoComponent } from '../shared/showcase-logo.component'
import { CODE_SAMPLES, CodeLanguage, CUSTOMER_LOGOS, FEATURES, STATS, STEPS } from './relay-data'

/** Relay's landing page: what it does, in one request; who uses it; what's in it; how it works; and where to start. */
@Component({
    selector: 'npg-relay-home',
    templateUrl: './relay-home.component.html',
    styleUrls: ['./relay-home.component.scss'],
    imports: [
        NbButtonComponent,
        NbButtonGroupComponent,
        NbButtonToggleDirective,
        NbCardBodyComponent,
        NbCardComponent,
        NbIconComponent,
        RouterLink,
        ShowcaseGlowComponent,
        ShowcaseLogoComponent
    ]
})
export class RelayHomeComponent {
    private readonly toastr = inject(NbToastrService)
    private readonly window = inject(NB_WINDOW)

    readonly languages: Array<{ id: CodeLanguage, label: string }> = [
        { id: 'curl', label: 'curl' },
        { id: 'node', label: 'Node' },
        { id: 'python', label: 'Python' }
    ]
    readonly language = signal<CodeLanguage>('curl')
    readonly samples = CODE_SAMPLES
    readonly logos = CUSTOMER_LOGOS
    readonly features = FEATURES
    readonly steps = STEPS
    readonly stats = STATS

    pick(language: unknown) {
        if (language === 'curl' || language === 'node' || language === 'python') {
            this.language.set(language)
        }
    }

    async copy() {
        const sample = this.samples[this.language()]
        try {
            await this.window?.navigator.clipboard.writeText(sample)
            this.toastr.success('Paste it into your terminal or editor.', 'Copied', { duration: 2500 })
        } catch {
            this.toastr.warning('Select the sample and copy it.', 'Nothing copied', { duration: 3000 })
        }
    }
}
