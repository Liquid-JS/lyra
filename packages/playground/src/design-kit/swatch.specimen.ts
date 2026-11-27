import { Component } from '@angular/core'
import { NbSwatchModule } from '@liquid-js/lyr-core'

import { combinations, kit, SIZES } from './specimen'

/** The swatches' sizes, in px, for the triangle of a two-colour swatch's second colour. */
const SIZE_PX: Record<string, number> = { tiny: 16, small: 24, medium: 32, large: 40, giant: 48 }

/**
 * A swatch of each size, shape and fill, available or not, in each state: chosen in a group of its own, hovered,
 * focused and disabled. A two-colour swatch draws its second colour as a triangle of its own, which a design can
 * colour as it can the first, under the fill's edge; code splits `color`'s colours the same way.
 */
@Component({
    template: `
        <div class="specimens">
            @for (item of items; track $index) {
            <nb-swatch-group [size]="item.size"
                [shape]="item.shape"
                [value]="item.state === 'selected' ? 'kit' : null"
                [disabled]="item.state === 'disabled'"
                aria-label="Colour">
                <nb-swatch value="kit"
                    label="Colour"
                    [attr.data-kit]="kit('swatch', item)"
                    [attr.data-kit-state]="item.state === 'hover' || item.state === 'focus' ? item.state : null"
                    data-kit-target=".swatch"
                    [color]="item.fill === 'picture' ? undefined : item.fill === 'split' ? '#1d1d1f' : '#1f2a44'"
                    [image]="item.fill === 'picture' ? 'assets/design-kit/swatch-picture.png' : undefined"
                    [unavailable]="item.unavailable"
                    [class.kit-split]="item.fill === 'split'">
                    @if (item.fill === 'split') {
                    <span class="kit-second"
                        [style.border-width]="'0 0 ' + px(item.size) + 'px ' + px(item.size) + 'px'"></span>
                    <span class="kit-edge"></span>
                    }
                </nb-swatch>
            </nb-swatch-group>
            }
        </div>
    `,
    styles: `
        .kit-second {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 0;
            height: 0;
            border-style: solid;
            border-color: transparent transparent #ffffff transparent;
        }

        /* The fill's edge over both colours, as code draws it over its split background, e.g. on a white half: the edge
           alone, not the fill's under it too. */
        :host ::ng-deep .kit-split .swatch-fill {
            box-shadow: none;
        }

        .kit-edge {
            position: absolute;
            inset: 0;
            border-radius: inherit;
            box-sizing: border-box;
            border: var(--swatch-border-width) solid var(--swatch-border-color);
        }
    `,
    imports: [NbSwatchModule]
})
export class SwatchSpecimenComponent {
    readonly kit = kit
    readonly px = (size: string) => SIZE_PX[size] ?? 32
    readonly items = combinations({
        size: SIZES,
        shape: ['round', 'semi-round', 'rectangle'] as const,
        fill: ['color', 'split', 'picture'] as const,
        unavailable: [false, true],
        state: ['default', 'hover', 'focus', 'selected', 'disabled'] as const
    })
}
