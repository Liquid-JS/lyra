import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NbCardBodyComponent, NbCardComponent, NbTagModule, NbValidationModule } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-tag-form',
  templateUrl: './tag-form.component.html',
  imports: [JsonPipe, ReactiveFormsModule, NbCardComponent, NbCardBodyComponent, NbTagModule, NbValidationModule],
})
export class TagFormComponent {
  readonly recipients = new FormControl(['ana@example.com'], Validators.required);
  readonly separators = [ENTER, COMMA];
  readonly isEmail = (tag: string) => /^[^\s@]+@[^\s@]+$/.test(tag);
}
