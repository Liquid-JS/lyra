import { JsonPipe } from '@angular/common'
import { Component, signal } from '@angular/core'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { NbButtonModule, NbCardModule, NbSwatchModule, NbToggleModule, NbValidationModule } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-swatch-form',
    template: `
    <nb-card>
      <nb-card-body class="rows">
        <nb-toggle [checked]="multiple()" (checkedChange)="setMultiple($event)">Several colours</nb-toggle>
        <div>
          <label nbLabel [for]="validation">Colour</label>
          <nb-swatch-group [multiple]="multiple()" [formControl]="colour" nbValidation #validation="nbValidation">
            @for (option of options; track option.value) {
            <nb-swatch [value]="option.value" [label]="option.label" [color]="option.color" />
            }
          </nb-swatch-group>
          <nb-validation-errors [for]="validation" />
        </div>
        <p class="caption">Value: {{ colour.value | json }}</p>
      </nb-card-body>
      <nb-card-footer class="actions">
        <button nbButton size="small" (click)="save()">Save</button>
        <button nbButton size="small" ghost [disabled]="saved() === undefined" (click)="restore()">Restore saved</button>
        <button nbButton size="small" ghost (click)="colour.setValue(null)">Clear</button>
      </nb-card-footer>
    </nb-card>
  `,
    styles: `
    nb-card {
      max-width: 22rem;
    }

    .rows {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }
  `,
    imports: [NbCardModule, NbButtonModule, NbSwatchModule, NbToggleModule, NbValidationModule, ReactiveFormsModule, JsonPipe]
})
export class SwatchFormComponent {
    readonly options = [
        { value: 'navy', label: 'Navy', color: '#1f2a44' },
        { value: 'sand', label: 'Sand', color: '#d8c6a5' },
        { value: 'sage', label: 'Sage', color: '#9caf88' },
        { value: 'black-white', label: 'Black/White', color: ['#1d1d1f', '#ffffff'] }
    ]

    readonly multiple = signal(false)
    readonly colour = new FormControl<string | string[] | null>(null, Validators.required)
    readonly saved = signal<string | string[] | null | undefined>(undefined)

    setMultiple(multiple: boolean) {
        // A single choice becomes a list of one, and a list its first.
        const value = this.colour.value
        this.multiple.set(multiple)
        this.colour.setValue(multiple ? (value == null ? [] : [value].flat()) : ([value ?? []].flat()[0] ?? null))
    }

    save() {
        this.saved.set(this.colour.value)
    }

    restore() {
        const saved = this.saved()
        if (saved !== undefined) {
            this.setMultiple(Array.isArray(saved))
            this.colour.setValue(saved)
        }
    }
}
