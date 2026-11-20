import { EnvironmentProviders, inject, makeEnvironmentProviders, NgModule, provideEnvironmentInitializer } from '@angular/core'

import { NbIconComponent } from './icon.component'
import { NbIconLibraries } from './icon-libraries'
import { NbIcons } from './icon-pack'

/**
 * Adds icons to a registered SVG pack when the app starts, as `NbIconLibraries.registerSvgIcons` does; list it after the
 * pack's own provider (e.g. `provideNbIcons()`), which registers the pack.
 *
 * ```ts
 * import vegan from './icons/vegan.svg' with { loader: 'text' };
 *
 * providers: [provideNbIcons(), provideNbSvgIcons('icons', { vegan })];
 * ```
 */
export function provideNbSvgIcons(pack: string, icons: NbIcons): EnvironmentProviders {
    return makeEnvironmentProviders([
        provideEnvironmentInitializer(() => inject(NbIconLibraries).registerSvgIcons(pack, icons))
    ])
}

@NgModule({
    imports: [NbIconComponent],
    exports: [NbIconComponent]
})
export class NbIconModule {}
