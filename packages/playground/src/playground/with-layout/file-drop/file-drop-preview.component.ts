import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  NbButtonComponent,
  NbCardBodyComponent,
  NbCardComponent,
  NbFileDropModule,
  NbIconComponent,
} from '@liquid-js/lyr-core';

const uploadedLogo =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="#3366ff"/>' +
      '<path d="M28 64V32h8v24h16v8z" fill="#fff"/></svg>',
  );

@Component({
  selector: 'nb-file-drop-preview',
  templateUrl: './file-drop-preview.component.html',
  styleUrls: ['./file-drop-preview.component.scss'],
  imports: [
    ReactiveFormsModule,
    NbCardComponent,
    NbCardBodyComponent,
    NbFileDropModule,
    NbButtonComponent,
    NbIconComponent,
  ],
})
export class FileDropPreviewComponent {
  // The value starts as the URL of the logo already uploaded (inline here); a dropped image replaces it.
  readonly logo = new FormControl<File | string | null>(uploadedLogo);
}
