import { Component, OnInit, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { NgdAnalytics } from './@theme/services/analytics.service'

@Component({
    selector: 'ngd-app-root',
    template: ' <router-outlet /> ',
    imports: [RouterOutlet]
})
export class NgdAppComponent implements OnInit {
    private readonly analytics = inject(NgdAnalytics)

    ngOnInit() {
        this.analytics.trackPageViews()
    }
}
