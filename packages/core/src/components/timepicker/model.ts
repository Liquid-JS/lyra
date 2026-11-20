import { InjectionToken } from '@angular/core';
import type { NbTimepickerLocalizationConfig } from '@liquid-js/lyr-core/base';

export const NB_TIME_PICKER_CONFIG = new InjectionToken<NbTimePickerConfig>('NB_TIME_PICKER_CONFIG');

export const NB_DEFAULT_TIMEPICKER_LOCALIZATION_CONFIG: NbTimepickerLocalizationConfig = {
  hoursText: 'Hr',
  minutesText: 'Min',
  secondsText: 'Sec',
  ampmText: 'Am/Pm',
  timeText: 'Time',
};

export interface NbTimePickerConfig {
  twelveHoursFormat?: boolean;
  format?: string;
  localization?: Partial<NbTimepickerLocalizationConfig>;
}

export interface NbSelectedTimeModel {
  value: string;
}

export interface NbSelectedTimePayload<D> {
  time: D;
  save?: boolean;
}
