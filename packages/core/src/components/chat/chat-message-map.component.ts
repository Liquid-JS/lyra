import { Component, inject, input } from '@angular/core'
import { NbChatOptions } from './chat.options'
import { NbChatMessageFileComponent } from './chat-message-file.component'

/**
 * A `map` message: its text, and a static Google Maps picture of the location, which needs the `messageGoogleMapKey`
 * of `provideNbChat`.
 */
@Component({
    selector: 'nb-chat-message-map',
    templateUrl: './chat-message-map.component.html',
    imports: [NbChatMessageFileComponent]
})
export class NbChatMessageMapComponent {

    /**
     * The message text.
     */
    readonly message = input<string>()

    /**
     * The sender's name.
     */
    readonly sender = input<string>()

    /**
     * When the message was sent.
     */
    readonly date = input<Date>()

    /**
     * `DatePipe` format of the date; `shortTime` by default.
     */
    readonly dateFormat = input<string>('shortTime')

    /**
     * Latitude of the location.
     */
    readonly latitude = input<number>()

    /**
     * Longitude of the location.
     */
    readonly longitude = input<number>()

    get file() {
        return {

            url: `https://maps.googleapis.com/maps/api/staticmap?center=${this.latitude()},${this.longitude()}&zoom=12&size=400x400&key=${this.mapKey}`,
            type: 'image/png',
            icon: 'location'
        }
    }

    mapKey = inject(NbChatOptions, { optional: true })?.messageGoogleMapKey
}
