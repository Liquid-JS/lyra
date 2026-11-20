import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';

import { NgdAppComponent } from './app/app.component';
import { serverConfig } from './app/app.config.server';

/** The docs app as the build prerenders its pages. */
// eslint-disable-next-line no-restricted-syntax -- Angular's server build calls the default export.
export default (context: BootstrapContext) => bootstrapApplication(NgdAppComponent, serverConfig, context);
