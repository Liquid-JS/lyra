import { PlatformLocation } from '@angular/common';
import { ApplicationConfig, inject, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';

import { appConfig } from './app.config';
import { NGD_DATA_LOADER } from './docs-data';
import { serverRoutes } from './app.routes.server';

/** The app as the build prerenders its pages. */
export const serverConfig: ApplicationConfig = mergeApplicationConfig(appConfig, {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // The API data is more than HttpClient takes on a server; the build serves the data files to `fetch` too.
    {
      provide: NGD_DATA_LOADER,
      useFactory: () => {
        const location = inject(PlatformLocation);
        const base = new URL(location.getBaseHrefFromDOM(), location.href);
        return async <T>(file: string) => (await fetch(new URL(file, base))).json() as Promise<T>;
      },
    },
  ],
});
