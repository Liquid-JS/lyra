import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NbCardBodyComponent, NbCardComponent, NbFileDropModule, NbValidationModule } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-file-drop-showcase',
  templateUrl: './file-drop-showcase.component.html',
  imports: [ReactiveFormsModule, NbCardComponent, NbCardBodyComponent, NbFileDropModule, NbValidationModule],
})
export class FileDropShowcaseComponent {
  readonly attachment = new FormControl<File | null>(null, Validators.required);
}
