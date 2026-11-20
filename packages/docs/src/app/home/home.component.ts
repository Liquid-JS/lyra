import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NbIconComponent, NbLayoutColumnComponent, NbLayoutComponent, NbThemeService } from '@liquid-js/lyr-core';

import {
  EXAMPLE_APPS,
  NgdExampleApp,
  examplePicture,
  themeId,
} from '../blocks/components/example-gallery-block/example-apps';
import { NgdFooterComponent } from '../@theme/components/footer/footer.component';
import { NGD_SITE_DESCRIPTION, NGD_SITE_TITLE, NgdSeoService } from '../@theme/services';
import { NgdHeaderComponent } from '../@theme/components/header/header.component';

/** A picture of an example app's first screen, linking to it in its theme. */
interface NgdShot {
  app: NgdExampleApp;
  picture: string;
  link: string;
  theme: string;
  phone: boolean;
}

// The showcases the home page shows, in its collage's order: large, two beside it, and a phone.
const SHOTS = ['website-midnight', 'shop-boutique', 'web-app-slate', 'mobile-app-candy'];

function shotOf(id: string): NgdShot {
  const app = EXAMPLE_APPS.find((item) => item.id === id);
  if (!app) {
    throw new Error(`No example app ${id}`);
  }
  const [screen] = app.screens;
  return {
    app,
    picture: examplePicture(app, screen),
    link: `/example/${screen.id}`,
    theme: themeId(app.theme),
    phone: app.devices[0] === 'phone',
  };
}

/** A picture of a showcase app on a real device, which links to the app in its theme. */
interface NgdDeviceTile {
  app: NgdExampleApp;
  /** The screen's name, e.g. Events. */
  screen: string;
  device: 'laptop' | 'desktop computer' | 'tablet' | 'phone';
  picture: string;
  link: string;
  theme: string;
  /** The picture's proportions, which the tile keeps. */
  ratio: number;
}

// The collage's rows: app, its screen, the device, and the picture's proportions. `yarn docs:home-devices` makes the
// pictures, with the same screens.
const DEVICE_ROWS: [string, string, NgdDeviceTile['device'], number][][] = [
  [
    ['relay', 'home', 'laptop', 1200 / 950],
    ['pulse', 'today', 'phone', 1200 / 1500],
    ['summit', 'home', 'laptop', 1260 / 940],
    ['portfolio', 'home', 'tablet', 980 / 870],
    ['hub', 'tickets', 'laptop', 1200 / 950],
    ['book', 'book', 'phone', 1300 / 1900],
    ['learn', 'lesson', 'laptop', 1400 / 1000],
    ['wallet', 'budgets', 'phone', 1040 / 1740],
    ['stay', 'listing', 'tablet', 1100 / 1300],
  ],
  [
    ['book', 'home', 'laptop', 1300 / 880],
    ['wallet', 'overview', 'phone', 1540 / 1060],
    ['learn', 'catalogue', 'tablet', 960 / 850],
    ['stay', 'search', 'phone', 880 / 940],
    ['relay', 'events', 'laptop', 1300 / 950],
    ['summit', 'agenda', 'phone', 760 / 900],
    ['portfolio', 'work', 'desktop computer', 1500 / 1000],
    ['pulse', 'trends', 'phone', 700 / 700],
    ['hub', 'home', 'laptop', 1240 / 930],
  ],
];

function deviceTileOf([id, screen, device, ratio]: (typeof DEVICE_ROWS)[number][number]): NgdDeviceTile {
  const app = EXAMPLE_APPS.find((item) => item.id === id);
  const title = app?.screens.find((item) => item.id === `showcase/${id}/${screen}`)?.title;
  if (!app || !title) {
    throw new Error(`No example app ${id} with a screen ${screen}`);
  }
  return {
    app,
    screen: title,
    device,
    picture: `assets/home-pictures/devices/${id}-${screen}.webp`,
    link: `/example/showcase/${id}/${screen}`,
    theme: themeId(app.theme),
    ratio,
  };
}

/**
 * The docs' home: the library first, with what's in it, then its design in the example apps' pictures, what it's
 * built for, forms and data, theming, auth, security and extras.
 */
@Component({
  selector: 'ngd-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    NbIconComponent,
    NbLayoutComponent,
    NbLayoutColumnComponent,
    NgdFooterComponent,
    NgdHeaderComponent,
    RouterLink,
  ],
})
export class NgdHomeComponent {
  protected readonly numbers = [
    { value: '54', label: 'Components' },
    { value: '7', label: 'Extras' },
    { value: '6', label: 'Themes' },
    { value: '274', label: 'Icons' },
    { value: '3,700', label: 'Theme variables' },
  ];

  protected readonly shots = SHOTS.map(shotOf);
  protected readonly deviceRows = DEVICE_ROWS.map((row) => row.map(deviceTileOf));

  protected readonly pillars = [
    {
      icon: 'grid-outline',
      title: 'Components',
      text: 'From buttons and forms to data tables, calendars, charts and chat: standalone, signal-based and zoneless.',
    },
    {
      icon: 'color-palette-outline',
      title: 'A design system',
      text: 'Six themes, a theme variable for every detail, and shapes, sizes and appearances set once for a whole app.',
    },
    {
      icon: 'globe-2-outline',
      title: 'Built for real apps',
      text: 'Keyboard and screen reader support, right to left, translations, and pages rendered on the server.',
    },
  ];

  protected readonly forms = [
    'Validation that shows each field’s errors, with rules as functions, directives or signal forms',
    'Inputs for dates, times, phone numbers, colours and masked values',
    'A data table that sorts, filters, pages and selects, with rows that expand',
  ];

  protected readonly theming = [
    'Pick a colour and get its shades; set fonts, corners and text size',
    'Make buttons round or controls smaller for the whole app at once',
    'See it on the example apps and on every control in every state',
    'Copy the result as Sass, CSS variables or component defaults',
  ];

  protected readonly more = [
    {
      icon: 'person-outline',
      title: 'Auth',
      text: 'Sign-in pages and strategies for passwords, OAuth2 with PKCE and Firebase, with tokens kept for you.',
      link: '/extras/auth/introduction',
    },
    {
      icon: 'shield-outline',
      title: 'Security',
      text: 'Roles and permissions, with an access check for templates and code.',
      link: '/extras/security/introduction',
    },
    {
      icon: 'cube-outline',
      title: 'Extras',
      text: 'A markdown editor and viewer, charts, QR codes, phone numbers, colour pickers and input masks.',
      link: '/extras',
    },
  ];

  constructor() {
    inject(NgdSeoService).setPage({ title: NGD_SITE_TITLE, description: NGD_SITE_DESCRIPTION, path: '' });
    inject(NbThemeService).changeTheme('docs-home');
  }
}
