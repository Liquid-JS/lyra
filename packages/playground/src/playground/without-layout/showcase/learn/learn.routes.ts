import { Routes } from '@angular/router';

/** A course platform's pages, in its frame. */
export const LEARN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./learn-shell.component').then((m) => m.LearnShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'catalogue' },
      {
        path: 'catalogue',
        data: { title: 'Catalogue' },
        loadComponent: () => import('./learn-catalogue.component').then((m) => m.LearnCatalogueComponent),
      },
      {
        path: 'course',
        data: { title: 'Course' },
        loadComponent: () => import('./learn-course.component').then((m) => m.LearnCourseComponent),
      },
      {
        path: 'lesson',
        data: { title: 'Lesson' },
        loadComponent: () => import('./learn-lesson.component').then((m) => m.LearnLessonComponent),
      },
      {
        path: 'quiz',
        data: { title: 'Quiz' },
        loadComponent: () => import('./learn-quiz.component').then((m) => m.LearnQuizComponent),
      },
    ],
  },
];
