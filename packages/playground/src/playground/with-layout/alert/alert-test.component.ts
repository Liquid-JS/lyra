import { Component } from '@angular/core';
import { NbAlertComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-alert-test',
  templateUrl: './alert-test.component.html',
  imports: [NbAlertComponent],
})
export class AlertTestComponent {
  sizes = ['tiny', 'small', 'medium', 'large', 'giant'];
  statuses = ['primary', 'success', 'info', 'warning', 'danger'];
  accents = ['primary', 'success', 'info', 'warning', 'danger'];

  alerts: any[];
  accentAlerts: any;

  constructor() {
    this.alerts = this.prepareAlerts();
    this.accentAlerts = this.prepareAccentAlerts();
  }

  onClose(alert: any) {
    const index = this.alerts.indexOf(alert);
    if (index >= 0) {
      this.alerts.splice(index, 1);
    }
  }

  private prepareAlerts(): any[] {
    return this.statuses.flatMap((status) => this.sizes.map((size) => ({ size, status })));
  }

  private prepareAccentAlerts() {
    return this.statuses.flatMap((status) => this.accents.map((accent) => ({ size: 'small', status, accent })));
  }
}
