import { Routes } from '@angular/router';
import {
  NB_BAR_CHART_PARTS,
  NB_LINE_CHART_PARTS,
  NB_PIE_CHART_PARTS,
  provideNbCharts,
} from '@liquid-js/lyr-extras/chart';

export const CHART_ROUTES: Routes = [
  {
    path: '',
    // The chart types the examples draw.
    providers: [provideNbCharts(...NB_LINE_CHART_PARTS, ...NB_BAR_CHART_PARTS, ...NB_PIE_CHART_PARTS)],
    children: [
      {
        path: 'chart-showcase.component',
        loadComponent: () => import('./chart-showcase.component').then((m) => m.ChartShowcaseComponent),
      },
    ],
  },
];
