import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbCardBodyComponent, NbCardComponent, NbOptionComponent, NbSelectComponent } from '@liquid-js/lyr-core';
import { NbColorPickerComponent } from '@liquid-js/lyr-extras/color-picker';
import { NbMarkdownEditorComponent } from '@liquid-js/lyr-extras/markdown-editor';
import { NbMaskDirective } from '@liquid-js/lyr-extras/mask';
import { NbMarkdownViewerComponent } from '@liquid-js/lyr-extras/markdown-viewer';
import { NbPhoneInputComponent } from '@liquid-js/lyr-extras/phone-input';
import { NbQrCodeComponent } from '@liquid-js/lyr-extras/qr-code';

@Component({
  selector: 'bs-root',
  template: `
    <nb-card><nb-card-body>Lyra works!</nb-card-body></nb-card>
    <nb-qr-code data="https://liquid-js.github.io/lyra/" />
    <nb-markdown-viewer [markdown]="markdown" />
    <nb-markdown-editor aria-label="Notes" />
    <nb-phone-input [(ngModel)]="phone" aria-label="Phone" />
    <input class="masked" nbMask="(###) ###-####" [(ngModel)]="masked" aria-label="Masked phone" />
    <nb-color-picker [(ngModel)]="color" outputFormat="hex" aria-label="Brand color" clearable />
    <!-- Typed from the published types: one value or null, and an array with multiple. -->
    <nb-select aria-label="City" [selected]="city" (selectedChange)="selectCity($event)">
      <nb-option value="London">London</nb-option>
    </nb-select>
    <nb-select multiple aria-label="Cities" [selected]="cities" (selectedChange)="selectCities($event)">
      <nb-option value="London">London</nb-option>
    </nb-select>
  `,
  imports: [
    FormsModule,
    NbCardComponent,
    NbCardBodyComponent,
    NbQrCodeComponent,
    NbMarkdownViewerComponent,
    NbMarkdownEditorComponent,
    NbPhoneInputComponent,
    NbMaskDirective,
    NbColorPickerComponent,
    NbSelectComponent,
    NbOptionComponent,
  ],
})
export class AppComponent {
  readonly markdown = '## Rendered markdown\n\n```ts\nconst highlighted = true;\n```';
  phone = '+12015550123';
  masked = '2015550123';
  color: string | null = '#3366ff';
  city: string | null = null;
  cities = new Array<string>();

  selectCity(city: string | null) {
    this.city = city;
  }

  selectCities(cities: string[]) {
    this.cities = cities;
  }
}
