# Create Lyra Page

A page with a sticky header and a sidebar:

```ts
import { Component } from '@angular/core';
import {
  NbButtonComponent,
  NbLayoutColumnComponent,
  NbLayoutComponent,
  NbLayoutHeaderComponent,
  NbSidebarComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'app-some-page',
  imports: [NbLayoutComponent, NbLayoutHeaderComponent, NbLayoutColumnComponent, NbSidebarComponent, NbButtonComponent],
  template: `
    <nb-layout>
      <nb-layout-header fixed>Company Name</nb-layout-header>

      <nb-sidebar>Sidebar Content</nb-sidebar>

      <nb-layout-column>
        Page Content <button nbButton>Hello World</button>
      </nb-layout-column>
    </nb-layout>
  `,
})
export class SomePageComponent {}
```

The application providers need `provideRouter(routes)` next to `provideNbTheme()`.
With NgModules, import `NbLayoutModule`, `NbSidebarModule` and `NbButtonModule` into the page's module instead.

![image](assets/images/articles/sample-page.png)

<div class="note note-info">
  <div class="note-title">Adding into existing page</div>
  <div class="note-body">
    `<nb-layout></nb-layout>` is the required root of every Lyra page: place an existing page's content inside it.
  </div>
</div>

---

## Related Articles

- [NbLayout, NbLayoutColumn, NbLayoutHeader, NbLayoutFooter](components/global/layout)
- [Design System Intro](/theme/design-system/design-system-intro)
- [Design System Rules](theme/design-system/design-system-theme)
- [Enabling Customizable Themes](theme/customization/enable-customizable-theme)
- [Deploying to production server](docs/guides/server-deployment)
