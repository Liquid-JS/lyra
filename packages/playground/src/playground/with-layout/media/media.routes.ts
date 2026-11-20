import { Routes } from '@angular/router';

export const MEDIA_ROUTES: Routes = [
  {
    path: 'video-showcase.component',
    loadComponent: () => import('./video-showcase.component').then((m) => m.VideoShowcaseComponent),
  },
  {
    path: 'video-stream.component',
    loadComponent: () => import('./video-stream.component').then((m) => m.VideoStreamComponent),
  },
  {
    path: 'audio-showcase.component',
    loadComponent: () => import('./audio-showcase.component').then((m) => m.AudioShowcaseComponent),
  },
];
