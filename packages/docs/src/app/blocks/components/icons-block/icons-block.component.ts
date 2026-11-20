import { Component, computed, inject, signal } from '@angular/core'
import {
    NbButtonGroupComponent,
    NbButtonToggleDirective,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbDialogService,
    NbFormFieldComponent,
    NbIconComponent,
    NbInputDirective,
    NbPrefixDirective,
    NbTooltipDirective
} from '@liquid-js/lyr-core'
import { NB_ICON_KEYWORDS, NB_ICONS } from '@liquid-js/lyr-icons'
import { NgdFragmentTargetDirective } from '../../../@theme/components/fragment-target/fragment-target.directive'
import { NGD_ICON_CATEGORIES } from './icon-categories'
import { NgdIconDialogComponent } from './icon-dialog.component'

type NgdIconStyle = 'fill' | 'outline'

interface NgdIcon {
    /** The name without its style, e.g. `star`. */
    base: string
    /** What a search matches: the name's words and the icon's keywords. */
    terms: string[]
}

const BASES = [...new Set(Object.keys(NB_ICONS).map((name) => name.replace(/-outline$/, '')))]
const LISTED = new Set(NGD_ICON_CATEGORIES.flatMap(({ icons }) => icons))

/** The icons by category, and any the categories don't list under More. */
const CATEGORIES: Array<{ name: string, id: string, icons: NgdIcon[] }> = [
    ...NGD_ICON_CATEGORIES,
    { name: 'More', icons: BASES.filter((base) => !LISTED.has(base)) }
]
    .map(({ name, icons }) => ({
        name,
        // Its link's fragment, e.g. `editing-text`.
        id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        icons: icons
            .filter((base) => BASES.includes(base))
            .map((base) => ({ base, terms: [...base.split('-'), ...(NB_ICON_KEYWORDS[base] ?? [])] }))
    }))
    .filter(({ icons }) => icons.length)

/**
 * The icons Lyra comes with, by category: find one by name or by what it's for, and open it to see it filled or
 * outlined, download it or copy how to use it.
 */
@Component({
    selector: 'ngd-icons-block',
    templateUrl: './icons-block.component.html',
    styleUrls: ['./icons-block.component.scss'],
    imports: [
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NbFormFieldComponent,
        NbPrefixDirective,
        NbInputDirective,
        NbIconComponent,
        NbButtonGroupComponent,
        NbButtonToggleDirective,
        NbTooltipDirective,
        NgdFragmentTargetDirective
    ]
})
export class NgdIconsBlockComponent {
    private readonly dialogs = inject(NbDialogService)

    readonly query = signal('')
    readonly style = signal<NgdIconStyle>('outline')

    /** The categories with the icons the search finds in them. */
    readonly categories = computed(() => {
        const words = this.query().toLowerCase().split(/\s+/).filter(Boolean)
        // Every word matches the start of a term: "arr" finds arrows, "sign in" finds log-in.
        return CATEGORIES.map(({ name, id, icons }) => ({
            name,
            id,
            icons: icons.filter(({ terms }) =>
                words.every((word) => terms.some((term) => term.split(' ').some((part) => part.startsWith(word))))
            )
        })).filter(({ icons }) => icons.length)
    })

    readonly found = computed(() => this.categories().reduce((sum, { icons }) => sum + icons.length, 0))
    readonly total = BASES.length

    setStyle(style: unknown) {
        if (style === 'fill' || style === 'outline') {
            this.style.set(style)
        }
    }

    /** The icon's name in the style shown, or in the one style it comes in. */
    nameOf(base: string): string {
        const [preferred, other] = this.style() === 'outline' ? [`${base}-outline`, base] : [base, `${base}-outline`]
        return preferred in NB_ICONS ? preferred : other
    }

    open(base: string) {
        this.dialogs.open(NgdIconDialogComponent, { context: { base, fill: this.style() === 'fill' } })
    }
}
