import { Component } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { NbCardModule, NbSliderModule, NbSliderRange, NbValidationModule } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-slider-transform',
    templateUrl: './slider-transform.component.html',
    styleUrls: ['./slider-example.scss'],
    imports: [ReactiveFormsModule, NbCardModule, NbSliderModule, NbValidationModule]
})
export class SliderTransformComponent {
    readonly price = new FormControl<NbSliderRange>({ start: 20, end: 800 })
    readonly seats = new FormControl(10)
    readonly storage = new FormControl(64)

    readonly formatPrice = (value: number) => `$${value}`
    readonly formatStorage = (value: number) => (value >= 1024 ? `${value / 1024} TB` : `${value} GB`)
    /** Eases in: the first half of the track covers an eighth of the sizes. */
    readonly cubeRoot = (position: number) => Math.cbrt(position)
}
