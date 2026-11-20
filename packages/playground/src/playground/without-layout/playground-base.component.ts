import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { NbThemeService } from '@liquid-js/lyr-core';

import { loadPlaygroundTheme } from '../playground-theme';
import { RouterOutlet } from '@angular/router';

@Component({
  templateUrl: './playground-base.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet],
})
export class PlaygroundBaseComponent implements OnInit {
  private readonly themeService = inject(NbThemeService);

  readonly themeLoaded = loadPlaygroundTheme();

  ngOnInit() {
    // The theme the user chose, or the system's, which a page that set another (e.g. a theme test) leaves.
    this.themeService.setThemePreference(this.themeService.themePreference());
  }
}
