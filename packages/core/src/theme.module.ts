import { EnvironmentProviders, makeEnvironmentProviders, NgModule, ModuleWithProviders } from '@angular/core'
import { DatePipe, isPlatformBrowser } from '@angular/common'

import { NB_MEDIA_BREAKPOINTS, NbThemeOptions, NB_THEME_OPTIONS, NB_JS_THEMES, NbJSThemeOptions, DEFAULT_MEDIA_BREAKPOINTS, NbMediaBreakpoint, NbLayoutDirection, NB_LAYOUT_DIRECTION } from '@liquid-js/lyr-core/base'
import { NbCdkAdapterModule } from '@liquid-js/lyr-core/cdk'
import { NbDateService, NbNativeDateService } from '@liquid-js/lyr-core/calendar-kit'

export function windowFactory(platformId: Parameters<typeof isPlatformBrowser>[0]): Window | undefined {
    if (isPlatformBrowser(platformId)) {
        return window
    }

    // Outside the browser there's no window, so code that uses it checks for it; an app that has one on the server
    // can provide its own through `NB_WINDOW`.
    return undefined
}

/**
 * Provides the theme and the services every Lyra component relies on, in place of `NbThemeModule.forRoot()`.
 *
 * @param nbThemeOptions the theme to start with, `default` if not set
 * @param nbJSThemes JS themes to add to the built-in ones; one with a built-in theme's name is merged over it
 * @param nbMediaBreakpoints media breakpoints, `DEFAULT_MEDIA_BREAKPOINTS` if not set
 * @param layoutDirection the layout direction, LTR if not set
 */
export function provideNbTheme(
    nbThemeOptions: NbThemeOptions = { name: 'default' },
    nbJSThemes?: NbJSThemeOptions[],
    nbMediaBreakpoints?: NbMediaBreakpoint[],
    layoutDirection?: NbLayoutDirection
): EnvironmentProviders {
    return makeEnvironmentProviders([
    // The theme services provide themselves; these set the values that differ from the token defaults.
        { provide: NB_THEME_OPTIONS, useValue: nbThemeOptions || {} },
        { provide: NB_JS_THEMES, useValue: nbJSThemes || [] },
        { provide: NB_MEDIA_BREAKPOINTS, useValue: nbMediaBreakpoints || DEFAULT_MEDIA_BREAKPOINTS },
        { provide: NB_LAYOUT_DIRECTION, useValue: layoutDirection || NbLayoutDirection.LTR },
        // The CDK's overlay services, adapted to the layout's own scroll. Lyra's overlay services provide themselves, so an
        // app without overlays doesn't bundle them.
        ...NbCdkAdapterModule.forRoot().providers,
        // Defaults for the calendars and pickers; a date service module provided after this one replaces them.
        { provide: NbDateService, useClass: NbNativeDateService },
        DatePipe
    ])
}

@NgModule({})
export class NbThemeModule {

    /**
     * Provides the theme for an app bootstrapped with an NgModule; `provideNbTheme` takes the same arguments.
     */
    static forRoot(nbThemeOptions: NbThemeOptions = { name: 'default' },
        nbJSThemes?: NbJSThemeOptions[],
        nbMediaBreakpoints?: NbMediaBreakpoint[],
        layoutDirection?: NbLayoutDirection): ModuleWithProviders<NbThemeModule> {
        return {
            ngModule: NbThemeModule,
            providers: [provideNbTheme(nbThemeOptions, nbJSThemes, nbMediaBreakpoints, layoutDirection)]
        }
    }
}
