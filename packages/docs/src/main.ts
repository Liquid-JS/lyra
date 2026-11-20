import { bootstrapApplication } from '@angular/platform-browser';

import { NgdAppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(NgdAppComponent, appConfig).catch((err) => console.error(err));
