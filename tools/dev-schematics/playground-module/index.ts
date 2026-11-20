import { chain, Rule } from '@angular-devkit/schematics';
import { generateMissingRoutes } from './generate-missing-routes.js';
import { addRoutes } from './add-routes.js';

export function playgroundModule(): Rule {
  return () => chain([generateMissingRoutes, addRoutes]);
}
