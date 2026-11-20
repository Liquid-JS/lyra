import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  OnInit,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { Location } from '@angular/common';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { EMPTY, fromEvent, merge, of as observableOf } from 'rxjs';
import { debounceTime, delay, filter, switchMap } from 'rxjs/operators';
import {
  NB_DOCUMENT,
  NB_WINDOW,
  NbButtonComponent,
  NbComponentDefaults,
  NbContextMenuDirective,
  NbIconComponent,
  NbLayoutDirection,
  NbLayoutDirectionService,
  NbMenuItem,
  NbMenuService,
  NbThemeService,
  NB_COMPONENT_DEFAULTS,
  NbWindowService,
} from '@liquid-js/lyr-core';
import { NgdAnalytics, NgdIframeCommunicatorService, NgdIframeMessage, NgdSeoService } from '../@theme/services';
import { NgdThemeDrafts } from '../blocks/components/theme-editor-block/theme-drafts.service';
import { NgdThemeWindowComponent } from '../blocks/components/theme-editor-block/theme-window.component';
import {
  EXAMPLE_APPS,
  examplePageDescription,
  examplePageTitle,
  examplePicture,
  findExampleScreen,
  findExampleTheme,
  themeId,
} from '../blocks/components/example-gallery-block/example-apps';
import { googleFontsUrl, themeDefaults } from '../blocks/components/theme-editor-block/theme-export';
import { NgdExampleCodeComponent } from '../blocks/components/example-gallery-block/example-code.component';
import { NgdDeviceFrameComponent } from '../blocks/components/theme-editor-block/device-frame.component';
import { markExampleText } from './example-text-direction';

/** What a docs page sends an example: a theme, and from the theme editor, its variables, defaults and direction. */
interface NgdExampleMessage {
  theme?: string;
  variables?: Record<string, string>;
  defaults?: NbComponentDefaults;
  direction?: NbLayoutDirection;
  fonts?: string[];
}

/** What an example in a frame reports: its height as it loads or changes, and the page it shows as it navigates. */
interface NgdExampleReport {
  height?: number;
  page?: string;
}

/** The example in a phone beside the page: the example id its frame reports as, and the page it opened on. */
interface NgdPhoneView {
  id: string;
  url: string;
}

/** The component defaults an example's components take, which the theme editor sets. */
class NgdExampleDefaults {
  readonly defaults = signal<NbComponentDefaults>({});
}

// The examples the theme editor shows, which take the theme it edits when opened full screen.
const THEMED_EXAMPLES = ['theme-editor/', 'showcase/'];

// The narrowest window that shows an example on a phone: a large screen's, where it's narrow already otherwise.
const PHONE_VIEW_MIN_WIDTH = 992;
// The phone's own screen height, and the space kept above and below it and for its bezel.
const PHONE_HEIGHT = 844;
const PHONE_MARGIN = 64 + 24;

/**
 * Shows an example on its own: in a docs page's frame, which sends it the theme to show, or full screen. A full-screen
 * example the theme editor shows takes the theme being edited, or the one its link names (`?theme=`), with a button
 * whose menu goes back to the docs, shows the page's code, opens the editor in a window, switches the direction, and on a
 * large screen, shows the example on a phone; customising a named theme starts a draft from it.
 */
@Component({
  selector: 'ngd-example',
  template: `
    <router-outlet />
    @if (phone(); as phone) {
      <div class="phone-view">
        <ngd-device-frame device="phone" label="The example on a phone" [url]="phone.url" [height]="phoneHeight()" />
      </div>
    }
    @if (customisable) {
      <!-- Fixed itself: a focused button is positioned relatively, which would undo it on the button. -->
      <div class="controls" [style.bottom.px]="controlsBottom()">
        <button
          nbButton
          status="primary"
          shape="round"
          size="giant"
          appearance="filled"
          aria-label="Example: docs, code and theme"
          nbContextMenuPlacement="top"
          nbContextMenuTag="example-controls"
          [nbContextMenu]="menu()">
          <nb-icon icon="options-2-outline" />
        </button>
      </div>
    }
  `,
  styleUrls: ['./example.component.scss'],
  imports: [NbButtonComponent, NbContextMenuDirective, NbIconComponent, NgdDeviceFrameComponent, RouterOutlet],
  // On a phone, the page is the phone's, not the window's.
  host: { '[class.phone-shown]': '!!phone()', '[class.sized-to-content]': 'framed && !inDevice' },
  providers: [
    // The theme's component defaults, which the page's components follow as they change.
    NgdExampleDefaults,
    { provide: NB_COMPONENT_DEFAULTS, useFactory: () => inject(NgdExampleDefaults).defaults.asReadonly() },
  ],
})
export class NgdExampleComponent implements OnInit, AfterViewInit {
  private readonly communicator = inject(NgdIframeCommunicatorService);
  private readonly themeService = inject(NbThemeService);
  private readonly router = inject(Router);
  private readonly analytics = inject(NgdAnalytics);
  private readonly document = inject(NB_DOCUMENT);
  private readonly window = inject(NB_WINDOW);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly directionService = inject(NbLayoutDirectionService);
  private readonly windowService = inject(NbWindowService);
  private readonly exampleDefaults = inject(NgdExampleDefaults);
  private readonly location = inject(Location);
  private readonly menuService = inject(NbMenuService);

  private readonly id = this.getId();
  /** Opened full screen, not in a docs page's frame, and an example the editor shows. */
  protected readonly customisable =
    !!this.window && this.window.parent === this.window && THEMED_EXAMPLES.some((prefix) => this.id.startsWith(prefix));
  /** Shown in a docs page's frame, which takes its height. */
  protected readonly framed = !!this.window && this.window.parent !== this.window;
  /**
   * Shown in a device's frame, e.g. the theme editor's or the phone view's, whose fixed screen it fills, rather than a
   * docs page's frame, which is as tall as the example. Its link says so as it opens; links within the app drop it.
   */
  protected readonly inDevice = this.router.parseUrl(this.router.url).queryParamMap.get('frame') === 'device';
  /** The page shown, as an example id, which follows the example's own links, e.g. from a shop's products to its cart. */
  private readonly page = signal(this.id);
  /** The example app and screen shown, whose code it shows: by the page, or one like it, e.g. another product. */
  protected readonly example = computed(() => {
    const page = this.page();
    const parent = page.split('/').slice(0, -1).join('/');
    return (
      findExampleScreen(page) ??
      EXAMPLE_APPS.flatMap((app) => app.screens.map((screen) => ({ app, screen }))).find(
        ({ screen }) => screen.id.split('/').slice(0, -1).join('/') === parent && parent.split('/').length > 2,
      ) ??
      findExampleScreen(this.id)
    );
  });
  /** The theme the link names, shown as it is until it's customised; without one, the theme being edited. */
  private readonly namedTheme = signal(this.router.parseUrl(this.router.url).queryParamMap.get('theme') ?? undefined);
  private readonly themes = this.customisable ? inject(NgdThemeDrafts) : undefined;
  /** The named theme as a draft, when it's an example's own. */
  private readonly ownTheme = computed(() => {
    const named = this.namedTheme();
    const own = named ? findExampleTheme(named) : undefined;
    return own && this.themes?.draftOf(own);
  });
  // The example's theme is over a base theme, whose values are loaded once the theme is known.
  private readonly loadOwnBase = effect(() => {
    const named = this.namedTheme();
    const own = named ? findExampleTheme(named) : undefined;
    if (own) {
      untracked(() => void this.themes?.loadThemes(own.base));
    }
  });

  /** The theme the page shows: its own, the named one, or the one being edited. */
  private readonly theme = computed(() => {
    const themes = this.themes;
    if (!themes) {
      return undefined;
    }
    const named = this.namedTheme();
    const own = this.ownTheme();
    return own
      ? { theme: own.base, variables: themes.variablesOf(own), defaults: themeDefaults(own), fonts: own.fonts }
      : named
        ? { theme: named, variables: {}, defaults: {} }
        : {
          theme: themes.draft().base,
          variables: themes.variables(),
          defaults: themes.defaults(),
          fonts: themes.draft().fonts,
        };
  });

  /** The page reads right to left. */
  protected readonly rtl = signal(this.directionService.isRtl());
  /** The window's size, which the phone view needs. */
  private readonly windowSize = signal({ width: this.window?.innerWidth ?? 0, height: this.window?.innerHeight ?? 0 });
  /** The window is wide enough to show the example on a phone. */
  protected readonly wide = computed(() => this.windowSize().width >= PHONE_VIEW_MIN_WIDTH);
  /** The example on a phone, when it's shown on one. */
  protected readonly phone = signal<NgdPhoneView | undefined>(undefined);
  /** The phone's screen height: its own, or less to fit the window. */
  protected readonly phoneHeight = computed(() =>
    Math.max(480, Math.min(PHONE_HEIGHT, this.windowSize().height - PHONE_MARGIN)),
  );
  private readonly phoneFrame = viewChild(NgdDeviceFrameComponent);
  // The phone's page is listening for its theme: it reported its height.
  private phoneListening = false;
  /** What the phone's page is sent: the page's theme and direction. */
  private readonly phoneMessage = computed(() => {
    const phone = this.phone();
    const theme = this.theme();
    return phone && theme
      ? { ...theme, id: phone.id, direction: this.rtl() ? NbLayoutDirection.RTL : NbLayoutDirection.LTR }
      : undefined;
  });

  constructor() {
    this.describePage();
    this.restoreOnLeave();
    if (this.themes) {
      effect(() => {
        const message = this.theme();
        if (message) {
          untracked(() => this.changeTheme(message));
        }
      });
      // The phone's page follows the theme and direction once it's listening.
      effect(() => {
        const message = this.phoneMessage();
        untracked(() => this.sendPhone(message));
      });
    }
    this.followTextDirection();
  }

  /**
   * The page's title and metadata as it changes: an example app's page as the made-up app would title it, marked as
   * Lyra's example, with a description that says it's a mockup and its picture for link previews; any other example by
   * its name. Search engines leave them out: the docs pages, which show them in frames, are what they list.
   */
  private describePage() {
    const seo = inject(NgdSeoService);
    effect(() => {
      const page = this.page();
      const path = `example/${page}`;
      const found = findExampleScreen(page);
      if (!found) {
        const name = (page.split('/').pop() ?? '').replace(/\.component$/, '').replace(/-/g, ' ');
        const title = name ? `${name.charAt(0).toUpperCase()}${name.slice(1)} | Lyra example` : 'Lyra example';
        seo.setPage({ title, path, index: false });
        return;
      }
      // The app in the theme the link names, e.g. the boutique shop rather than the shop, which have the same pages.
      const theme = this.namedTheme();
      const app =
        EXAMPLE_APPS.find(
          (item) => themeId(item.theme) === theme && item.screens.some((screen) => screen.id === found.screen.id),
        ) ?? found.app;
      seo.setPage({
        title: examplePageTitle(app, found.screen),
        description: examplePageDescription(app),
        path,
        index: false,
        image: examplePicture(app, found.screen),
      });
    });
  }

  // Back to the docs loads them afresh; back through the browser's history keeps the page, with what the example
  // changed in it: its theme, the theme editor's variables, its fonts and its direction go with the example.
  private restoreOnLeave() {
    const preference = this.themeService.themePreference();
    const direction = this.directionService.getDirection();
    this.destroyRef.onDestroy(() => {
      const { style } = this.document.body;
      this.variables.forEach((name) => style.removeProperty(`--${name}`));
      this.variables = [];
      this.document.head.querySelector('#ngd-example-fonts')?.remove();
      if (this.themeService.themePreference() !== preference) {
        this.themeService.setThemePreference(preference);
      }
      if (this.directionService.getDirection() !== direction) {
        this.directionService.setDirection(direction);
      }
    });
  }

  // Right to left, marks the example's English text as the page changes, so it reads left to right where the page
  // puts it; left to right, it needs none.
  private followTextDirection() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    afterNextRender(() => {
      const { window } = this;
      if (!window) {
        return;
      }
      let frame = 0;
      const mark = () => {
        window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(() => markExampleText(host));
      };
      const observer = new MutationObserver(mark);
      let rtl = false;
      // A row at one width may not be at another.
      fromEvent(window, 'resize')
        .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => rtl && mark());
      effect(
        () => {
          rtl = this.directionService.getDirection() === NbLayoutDirection.RTL;
          observer.disconnect();
          if (rtl) {
            mark();
            observer.observe(host, { childList: true, subtree: true, characterData: true });
          }
        },
        { injector: this.injector },
      );
      this.destroyRef.onDestroy(() => {
        observer.disconnect();
        window.cancelAnimationFrame(frame);
      });
    });
  }

  ngOnInit() {
    if (this.customisable) {
      this.followControls();
      this.followPhone();
      // An app made for phones opens on one where the window is wide enough to show it.
      if (this.wide() && this.example()?.app.devices[0] === 'phone') {
        this.togglePhone();
      }
    } else if (this.framed) {
      this.reportPages();
      this.reportHeight();
    }
    this.subscribeOnThemeSwitch();
    this.analytics.trackEvent('initExampleView', this.id);
  }

  ngAfterViewInit() {
    observableOf(null)
      .pipe(delay(500))
      .subscribe(() => this.sendHeight());
  }

  /** The docs page an example returns to: the examples page, or the theme editor for an example not on it. */
  protected readonly docsLink = this.location.prepareExternalUrl(
    findExampleScreen(this.id) ? 'examples' : 'theme/theme-editor',
  );

  /** The controls' menu: back to the docs, the page's code when it has some, and customising the theme. */
  protected readonly menu = computed<NbMenuItem[]>(() => [
    { title: 'Back to the docs', icon: 'arrow-back-outline', data: 'docs' },
    ...(this.example() ? [{ title: 'Show the code', icon: 'code-outline', data: 'code' }] : []),
    { title: 'Customise the theme', icon: 'color-palette-outline', data: 'customise' },
    { title: this.rtl() ? 'Left to right' : 'Right to left', icon: 'swap-outline', data: 'rtl' },
    ...(this.phone()
      ? [{ title: 'Show full screen', icon: 'monitor-outline', data: 'phone' }]
      : this.wide()
        ? [{ title: 'Show on a phone', icon: 'smartphone-outline', data: 'phone' }]
        : []),
  ]);

  /** How far the controls are from the bottom, in pixels: clear of a bar along the bottom, e.g. a mobile app's tabs. */
  protected readonly controlsBottom = signal(24);

  // Acts on the controls' menu, places them clear of the page's bottom bar as the page and window change, and follows
  // the page shown.
  private followControls() {
    this.menuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'example-controls'),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ item }) => {
        if (item.data === 'docs') {
          this.backToDocs();
        } else if (item.data === 'code') {
          this.showCode();
        } else if (item.data === 'rtl') {
          this.toggleRtl();
        } else if (item.data === 'phone') {
          this.togglePhone();
        } else {
          void this.customise();
        }
      });
    const navigations = this.router.events.pipe(filter((event) => event instanceof NavigationEnd));
    navigations.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.page.set(this.getId()));
    const window = this.window;
    merge(navigations, window ? fromEvent(window, 'resize') : observableOf(), observableOf(null))
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (window) {
          this.windowSize.set({ width: window.innerWidth, height: window.innerHeight });
        }
        // A window too narrow for the phone shows the page as it is.
        if (this.phone() && !this.wide()) {
          this.togglePhone();
        }
        this.replaceControls();
      });
  }

  private replaceControls() {
    afterNextRender(() => this.placeControls(), { injector: this.injector });
  }

  protected toggleRtl() {
    const rtl = !this.rtl();
    this.rtl.set(rtl);
    this.directionService.setDirection(rtl ? NbLayoutDirection.RTL : NbLayoutDirection.LTR);
  }

  // Shows the page on a phone, or full screen again at the page the phone shows, which the page has followed.
  protected togglePhone() {
    this.phoneListening = false;
    this.phone.set(
      this.phone() ? undefined : { id: this.page(), url: this.location.prepareExternalUrl(this.location.path()) },
    );
    this.replaceControls();
  }

  // Sends the phone's page its theme once it reports its height, and follows the pages it navigates to, so the page
  // shown full screen again, its code and the link are the phone's.
  private followPhone() {
    toObservable(this.phone, { injector: this.injector })
      .pipe(
        switchMap((phone) => (phone ? this.communicator.receive<NgdExampleReport>(phone.id) : EMPTY)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ height, page }) => {
        if (page) {
          this.followPhonePage(page);
        } else if (height !== undefined && !this.phoneListening) {
          this.phoneListening = true;
          this.sendPhone(this.phoneMessage());
        }
      });
  }

  private sendPhone(message?: NgdIframeMessage<NgdExampleMessage>) {
    const target = this.phoneFrame()?.window;
    if (message && target && this.phoneListening) {
      this.communicator.send(message, target);
    }
  }

  // The page the phone shows, under the link's own query, e.g. its theme, which the phone's link may no longer match.
  private followPhonePage(page: string) {
    const [path] = page.split(/[?#]/);
    const query = this.location.path().split('?')[1];
    const url = query ? `${path}?${query}` : path;
    if (this.router.url !== url) {
      void this.router.navigateByUrl(url, { replaceUrl: true });
    }
  }

  // In a frame, reports each page it navigates to, e.g. to a full-screen example showing it on a phone.
  // In a frame, reports its height as it changes, e.g. as a narrower window wraps it onto more lines, so the frame
  // grows with it and doesn't scroll inside.
  private reportHeight() {
    const { body } = this.document;
    let height = body.clientHeight;
    const observer = new ResizeObserver(() => {
      if (body.clientHeight !== height) {
        height = body.clientHeight;
        this.sendHeight();
      }
    });
    observer.observe(body);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  private reportPages() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.communicator.send<NgdExampleReport>({ id: this.id, page: this.router.url }));
  }

  // Finds a bar fixed along the bottom under the controls' corner, and lifts them above it.
  private placeControls() {
    const window = this.window;
    if (!window) {
      return;
    }
    const gap = 24;
    const controls = this.document.querySelector('ngd-example > .controls');
    if (!controls) {
      return;
    }
    // Under the middle of the controls, at their lowest.
    const { left, width } = controls.getBoundingClientRect();
    const corner = this.document.elementsFromPoint(left + width / 2, window.innerHeight - gap);
    const bar = corner
      .filter((element) => !element.closest('.controls, .phone-view, .cdk-overlay-container'))
      .map((element) => fixedAncestor(element))
      .find((element) => element && element.getBoundingClientRect().bottom >= window.innerHeight - 1);
    this.controlsBottom.set(bar ? window.innerHeight - bar.getBoundingClientRect().top + gap / 2 : gap);
  }

  // To the examples page, or the theme editor for an example not on it. Not back through the history: how far back the
  // docs page is can't be told once the example's own pages have been gone back and forth through.
  protected backToDocs() {
    this.window?.location.assign(this.docsLink);
  }

  protected async customise() {
    const named = this.namedTheme();
    if (named && this.themes) {
      // A draft of the named theme, which the editor and this page show from now on, the link's theme dropped.
      if (!(await this.themes.startFrom(this.ownTheme() ?? named))) {
        return;
      }
      this.namedTheme.set(undefined);
      this.location.replaceState(this.location.path().split('?')[0]);
    }
    this.windowService.open(NgdThemeWindowComponent, { title: 'Customise theme' });
  }

  protected showCode() {
    const example = this.example();
    if (example) {
      const { app, screen } = example;
      this.windowService.open(NgdExampleCodeComponent, {
        title: `${app.name}: ${screen.title}`,
        context: { files: screen.files, shared: app.files },
      });
    }
  }

  private subscribeOnThemeSwitch() {
    this.communicator
      .receive<NgdExampleMessage>(this.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((payload) => this.changeTheme(payload));
  }

  // The theme variables the theme editor last set, which its next ones replace.
  private variables = new Array<string>();

  // The theme's fonts, from Google Fonts: one stylesheet link, replaced as the theme's fonts change, and dropped for a
  // theme with none; a message that doesn't say leaves it.
  private loadFonts(fonts: string[] | undefined) {
    if (!fonts) {
      return;
    }
    const { head } = this.document;
    const id = 'ngd-example-fonts';
    const href = fonts.length ? googleFontsUrl(fonts) : undefined;
    let link = head.querySelector<HTMLLinkElement>(`#${id}`);
    if (!href) {
      link?.remove();
      return;
    }
    if (!link) {
      link = this.document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      head.appendChild(link);
    }
    if (link.href !== href) {
      link.href = href;
    }
  }

  private changeTheme({ theme, variables, defaults, direction, fonts }: NgdExampleMessage) {
    this.loadFonts(fonts);
    if (theme && theme !== this.themeService.currentTheme) {
      // As the preference, which the playground's pages apply as they start; the docs don't keep it.
      this.themeService.setThemePreference(theme);
    }
    // On the body, which has the theme's class, so the variables that refer to them follow.
    if (variables) {
      const { style } = this.document.body;
      this.variables.forEach((name) => style.removeProperty(`--${name}`));
      this.variables = Object.keys(variables);
      Object.entries(variables).forEach(([name, value]) => style.setProperty(`--${name}`, value));
    }
    if (defaults) {
      this.exampleDefaults.defaults.set(defaults);
    }
    if (direction && direction !== this.directionService.getDirection()) {
      this.directionService.setDirection(direction);
    }
    this.sendHeight(); // theme change may cause change of height
    // The defaults change the page once it renders.
    afterNextRender(() => this.sendHeight(), { injector: this.injector });
  }

  private getId(): string {
    const splitted = this.router.url.split(/[?#]/)[0].split('/');
    // remove 'example' route prefix
    splitted.splice(0, 2);
    return splitted.join('/');
  }

  private sendHeight() {
    this.communicator.send({ id: this.id, height: this.document.body.clientHeight });
  }
}

// The element, or its nearest ancestor, that's fixed on the screen.
function fixedAncestor(element: Element): Element | undefined {
  for (let node: Element | null = element; node && node !== node.ownerDocument.body; node = node.parentElement) {
    if (getComputedStyle(node).position === 'fixed') {
      return node;
    }
  }
  return undefined;
}
