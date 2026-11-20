import { all, type NgdExampleApp } from '../example-app';

/** A course platform: the catalogue, a course with its chapters, a lesson player with notes, and a quiz. */
export const LEARN_APP: NgdExampleApp = {
  id: 'learn',
  name: 'Learn',
  brand: 'Acme Learn',
  summary:
    'A course platform: a catalogue with filters, a course with its chapters and reviews, a lesson player with notes and a transcript, and a quiz that scores itself. Serif headings on warm paper.',
  showcase: true,
  theme: {
    id: 'learn',
    name: 'Learn',
    base: 'default',
    colors: { primary: '#4f46e5', success: '#4e8a57', info: '#2a7fa8', warning: '#d98a10', danger: '#d1483b' },
    fontPrimary: '"DM Sans", system-ui, sans-serif',
    fontSecondary: '"DM Serif Display", Georgia, serif',
    fonts: ['DM Sans:wght@400;500;600;700', 'DM Serif Display'],
    radius: 0.75,
    variables: {
      // Warm paper: the page, the tinted bands, and the greys between.
      'layout-background-color': '#faf7f2',
      'color-basic-200': '#f6f2ea',
      'color-basic-300': '#efe9df',
      'color-basic-400': '#e3dcd0',
      'color-basic-500': '#cdc5b7',
      'color-basic-600': '#9b927f',
      'color-basic-700': '#5f584c',
      'color-basic-800': '#2d2822',
      'color-basic-900': '#211d18',
      'text-hint-color': 'var(--color-basic-700)',
      // Boxes stay boxes beside the round radios, whatever the radius.
      'checkbox-border-radius': '0.25rem',
      // White cards with a hairline and a soft, warm shadow.
      'card-border-color': 'var(--color-basic-400)',
      'card-shadow': '0 1px 2px rgba(45, 40, 34, 0.04), 0 10px 30px -18px rgba(45, 40, 34, 0.22)',
      // Serif headings, at a regular weight, which is where a display serif reads best.
      'text-heading-1-font-weight': '400',
      'text-heading-2-font-weight': '400',
      'text-heading-3-font-weight': '400',
      'text-heading-4-font-weight': '400',
      'text-heading-5-font-weight': '400',
      'text-heading-6-font-weight': '400',
      'text-heading-1-font-size': '2.75rem',
      'text-heading-1-line-height': '3.25rem',
      'text-heading-2-font-size': '2rem',
      'text-heading-2-line-height': '2.5rem',
      'text-heading-3-font-size': '1.625rem',
      'text-heading-3-line-height': '2.125rem',
      'text-heading-4-font-size': '1.375rem',
      'text-heading-4-line-height': '1.875rem',
      // Buttons in the sans, without shouting.
      'button-filled-text-transform': 'none',
      'button-outline-text-transform': 'none',
      'button-ghost-text-transform': 'none',
      'button-hero-text-transform': 'none',
      'text-button-font-weight': '600',
    },
  },
  devices: ['laptop', 'phone'],
  screens: [
    { id: 'showcase/learn/catalogue', title: 'Catalogue', files: all('showcase/learn/learn-catalogue.component') },
    { id: 'showcase/learn/course', title: 'Course', pageTitle: 'Design Systems that Scale', files: all('showcase/learn/learn-course.component') },
    { id: 'showcase/learn/lesson', title: 'Lesson', pageTitle: 'Documenting a component', files: all('showcase/learn/learn-lesson.component') },
    { id: 'showcase/learn/quiz', title: 'Quiz', files: all('showcase/learn/learn-quiz.component') },
  ],
  files: [
    'showcase/learn/learn.routes.ts',
    ...all('showcase/learn/learn-shell.component'),
    'showcase/learn/parts/learn-course-card.component.ts',
    'showcase/learn/parts/learn-stars.component.ts',
    'showcase/learn/learn-data.ts',
  ],
};
