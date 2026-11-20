import { Routes } from '@angular/router';

export const MARKDOWN_ROUTES: Routes = [
  {
    path: 'markdown-editor-showcase.component',
    loadComponent: () =>
      import('./markdown-editor-showcase.component').then((m) => m.MarkdownEditorShowcaseComponent),
  },
  {
    path: 'markdown-editor-status.component',
    loadComponent: () => import('./markdown-editor-status.component').then((m) => m.MarkdownEditorStatusComponent),
  },
  {
    path: 'markdown-viewer-showcase.component',
    loadComponent: () =>
      import('./markdown-viewer-showcase.component').then((m) => m.MarkdownViewerShowcaseComponent),
  },
  {
    path: 'markdown-viewer-templates.component',
    loadComponent: () =>
      import('./markdown-viewer-templates.component').then((m) => m.MarkdownViewerTemplatesComponent),
  },
];
