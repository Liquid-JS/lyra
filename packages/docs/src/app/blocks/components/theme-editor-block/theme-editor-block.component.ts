import { Location } from '@angular/common'
import { Component, computed, effect, inject, signal, untracked, viewChildren } from '@angular/core'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import {
    NbButtonComponent,
    NbButtonGroupComponent,
    NbButtonToggleDirective,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbCardHeaderComponent,
    NbCheckboxComponent,
    NbLayoutDirection,
    NbOptionComponent,
    NbOptionGroupComponent,
    NbSelectComponent,
    NbTabComponent,
    NbTabsetComponent
} from '@liquid-js/lyr-core'
import { switchMap } from 'rxjs/operators'

import { NgdIframeCommunicatorService } from '../../../@theme/services'
import { NgdCodeBlockComponent } from '../code-block/code-block.component'
import { NgdDevice, NgdDeviceFrameComponent } from './device-frame.component'
import { NgdThemeCardComponent } from './theme-card.component'
import { NgdThemeControlsComponent } from './theme-controls.component'
import { NgdThemeCard, NgdThemeDrafts, themeLabel } from './theme-drafts.service'
import { BASE_THEMES, NgdPreviewScreen, PREVIEW_SCREENS, themeEditorState } from './theme-editor-state'
import { defaultsTs, designKitScript, themeCss, themeScss } from './theme-export'
import { NgdThemeMessage } from './theme-message'

/** Which devices the preview shows the screen on. */
type NgdDevices = 'both' | NgdDevice

/**
 * Edits a theme over one of Lyra's: status colours with their generated shades, fonts, corner radius, text size and
 * the components' defaults, shown live on example screens in a laptop and a phone, and exported as a theme to register,
 * as CSS variables, and as the defaults' provider. The themes are kept in the browser, in step across tabs.
 */
@Component({
    selector: 'ngd-theme-editor-block',
    templateUrl: './theme-editor-block.component.html',
    styleUrls: ['./theme-editor-block.component.scss'],
    imports: [
        NbButtonComponent,
        NbButtonGroupComponent,
        NbButtonToggleDirective,
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NbCardFooterComponent,
        NbCheckboxComponent,
        NbOptionComponent,
        NbOptionGroupComponent,
        NbSelectComponent,
        NbTabsetComponent,
        NbTabComponent,
        NgdCodeBlockComponent,
        NgdDeviceFrameComponent,
        NgdThemeCardComponent,
        NgdThemeControlsComponent
    ]
})
export class NgdThemeEditorBlockComponent {
    protected readonly themes = inject(NgdThemeDrafts)
    protected readonly communicator = inject(NgdIframeCommunicatorService)
    protected readonly location = inject(Location)
    protected readonly frames = viewChildren(NgdDeviceFrameComponent)

    protected readonly draft = this.themes.draft
    protected readonly label = themeLabel
    protected readonly savedScreen = themeEditorState.signal('screen')

    /** The saved drafts as cards, the one being edited as it is now. */
    protected readonly draftCards = computed<NgdThemeCard[]>(() => {
        const draft = this.draft()
        const drafts = this.themes.drafts().map((item) => (item.id === draft.id ? draft : item))
        if (!drafts.some(({ id }) => id === draft.id)) {
            drafts.push(draft)
        }
        return drafts.map((item) => this.themes.cardOf(item))
    })
    /** How the theme being edited stands: changed since it was saved, not saved yet, or neither. */
    protected readonly editingHint = computed(() =>
        !this.themes.isSaved() ? 'Not saved yet' : this.themes.dirty() ? 'Unsaved changes' : 'Editing'
    )
    /** The base themes, to start a draft from. */
    protected readonly baseCards = computed<NgdThemeCard[]>(() =>
        BASE_THEMES.map((base) => this.themes.cardOf(this.themes.fromBase(base, themeLabel(base), base)))
    )

    /** The screens by group, for the screen picker. */
    protected readonly screenGroups = [...new Set(PREVIEW_SCREENS.map(({ group }) => group))].map((group) => ({
        group,
        screens: PREVIEW_SCREENS.filter((screen) => screen.group === group)
    }))
    /** The screen the preview shows. */
    protected readonly screen = computed<NgdPreviewScreen>(
        () => PREVIEW_SCREENS.find(({ id }) => id === this.savedScreen()) ?? PREVIEW_SCREENS[0]
    )
    protected readonly screenUrl = computed(() => this.location.prepareExternalUrl(`example/${this.screen().id}`))
    /** The devices the preview shows, the screen's own unless picked. */
    protected readonly pickedDevices = signal<NgdDevices | undefined>(undefined)
    protected readonly devices = computed<NgdDevices>(() => this.pickedDevices() ?? this.screen().devices)
    protected readonly deviceOptions: Array<{ value: NgdDevices, label: string }> = [
        { value: 'both', label: 'Both' },
        { value: 'laptop', label: 'Laptop' },
        { value: 'phone', label: 'Phone' }
    ]
    protected readonly rtl = signal(false)

    protected readonly scss = computed(() => themeScss(this.draft(), this.themes.variables()))
    protected readonly css = computed(() => themeCss(this.draft(), this.themes.variables()))
    protected readonly defaultsCode = computed(() => defaultsTs(this.themes.defaults()))
    protected readonly designKit = computed(() => designKitScript(this.draft(), this.themes.variables()))

    constructor() {
    // The base themes' values, for their cards and the drafts over them.
        void this.themes.loadThemes(...BASE_THEMES)
        // The preview takes the theme as it changes.
        effect(() => {
            const message = this.message()
            untracked(() => this.post(message))
        })

        // A page that loaded in a frame says it's listening by reporting its height; it then takes the theme. Its later
        // reports, e.g. after taking it, don't ask for it again.
        toObservable(this.screen)
            .pipe(
                switchMap(({ id }) => this.communicator.receive<{ height: number }>(id)),
                takeUntilDestroyed()
            )
            .subscribe(() => {
                if (this.waitingFrames > 0) {
                    this.waitingFrames--
                    this.post(this.message())
                }
            })
    }

    protected showScreen(id: string) {
        this.pickedDevices.set(undefined)
        void this.savedScreen.set(id)
    }

    // Frames that loaded a page and haven't been sent the theme yet.
    protected waitingFrames = 0

    protected frameLoaded() {
        this.waitingFrames++
    }

    protected pickDevices(value: unknown) {
        const option = this.deviceOptions.find((item) => item.value === value)
        if (option) {
            this.pickedDevices.set(option.value)
        }
    }

    protected message(): NgdThemeMessage {
        return {
            id: this.screen().id,
            theme: this.draft().base,
            variables: this.themes.variables(),
            defaults: this.themes.defaults(),
            direction: this.rtl() ? NbLayoutDirection.RTL : NbLayoutDirection.LTR,
            fonts: this.draft().fonts
        }
    }

    protected post(message: NgdThemeMessage) {
        for (const frame of this.frames()) {
            const target = frame.window
            if (target) {
                this.communicator.send(message, target)
            }
        }
    }
}
