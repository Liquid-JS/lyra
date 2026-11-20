import { mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, RenderMode, withRoutes } from '@angular/ssr';

import { appConfig } from './app.config';

export const config = mergeApplicationConfig(appConfig, {
  providers: [provideServerRendering(withRoutes([{ path: '**', renderMode: RenderMode.Server }]))],
});
