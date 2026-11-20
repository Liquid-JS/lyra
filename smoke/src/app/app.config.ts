import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, REMOVE_STYLES_ON_COMPONENT_DESTROY } from '@angular/platform-browser';
import { provideNbAuth } from '@liquid-js/lyr-auth';
import { provideNbTheme } from '@liquid-js/lyr-core';
import { provideNbDateFnsDate } from '@liquid-js/lyr-date-fns';
import { provideNbIcons } from '@liquid-js/lyr-icons';
import { provideNbMomentDate } from '@liquid-js/lyr-moment';
import { provideNbSecurity } from '@liquid-js/lyr-security';
import { provideHighlightOptions } from 'nxt-highlightjs';

export const appConfig: ApplicationConfig = {
  providers: [
    // Lyra works with and without zone.js. The playground and docs run zoneless, so this app covers zone.js.
    provideZoneChangeDetection(),
    provideClientHydration(),
    provideNbTheme({ name: 'default' }),
    provideNbAuth(),
    provideNbSecurity(),
    provideNbMomentDate(),
    provideNbDateFnsDate(),
    provideNbIcons(),
    provideHighlightOptions({
      coreLibraryLoader: () => import('highlight.js/lib/core').then((m) => m.default),
      languages: { typescript: () => import('highlight.js/lib/languages/typescript').then((m) => m.default) },
    }),
    { provide: REMOVE_STYLES_ON_COMPONENT_DESTROY, useValue: false },
  ],
};
