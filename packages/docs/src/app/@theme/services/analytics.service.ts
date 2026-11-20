import { inject, Service } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { Location } from '@angular/common'

import { filter, delay, map } from 'rxjs/operators'
import { NB_WINDOW } from '@liquid-js/lyr-core'

declare global {
    interface Window {
    // Google Tag Manager's queue.
        dataLayer: unknown[]
    }
}

@Service()
export class NgdAnalytics {
    private readonly window = inject(NB_WINDOW)
    private readonly location = inject(Location)
    private readonly router = inject(Router)

    private enabled: boolean

    constructor() {
    // No analytics backend is configured for the Lyra docs.
        this.enabled = false
    }

    trackPageViews() {
        if (this.enabled) {
            this.router.events.pipe(
                filter((event) => event instanceof NavigationEnd),
                map(() => this.location.path()),
                filter((location: string) => this.trackLocation(location)),
                delay(50)
            )
                .subscribe((location: string) => {
                    this.gtmPushToDataLayer({ event: 'pageView', path: location })
                })
        }
    }

    trackEvent(eventName: string, eventVal: string = '') {
        if (this.enabled) {
            this.gtmPushToDataLayer({ event: eventName, eventValue: eventVal })
        }
    }

    private trackLocation(path: string) {
        if (path.match(/\/components\/[a-zA-Z-]+\/?$/) ||
            path.match(/\/docs\/?$/) ||
            path.match(/\/example\//)) {

            return !!path.match(/\/components\/components-overview\/?$/)
        }
        return true
    }

    private gtmPushToDataLayer(params: Record<string, string>) {
        this.window?.dataLayer.push(params)
    }
}
