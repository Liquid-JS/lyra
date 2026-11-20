import { Component } from '@angular/core'

/**
 * Holds the front `nb-card` of an `nb-flip-card` or `nb-reveal-card`.
 */
@Component({
    selector: 'nb-card-front',
    template: '<ng-content select="nb-card" />'
})
export class NbCardFrontComponent {}

/**
 * Holds the back `nb-card` of an `nb-flip-card` or `nb-reveal-card`.
 */
@Component({
    selector: 'nb-card-back',
    template: '<ng-content select="nb-card" />'
})
export class NbCardBackComponent {}
