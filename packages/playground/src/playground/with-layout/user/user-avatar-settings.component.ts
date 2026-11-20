import { Component } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbUserComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-user-avatar-settings',
  templateUrl: './user-avatar-settings.component.html',
  imports: [NbCardComponent, NbCardBodyComponent, NbUserComponent],
})
export class UserAvatarSettingsComponent {
  base64image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAG1BMVEVEeef///+4zPaKq/ChvPPn7' +
    'vxymu3Q3flbieqI1HvuAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAQUlEQVQ4jWNgGAWjgP6ASdncAEaiAhaGiACmFhCJLsMaIiDAEQEi0WXYEiMC' +
    'OCJAJIY9KuYGTC0gknpuHwXDGwAA5fsIZw0iYWYAAAAASUVORK5CYII=';
}
