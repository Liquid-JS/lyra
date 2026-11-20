import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { dirname, join, normalize } from '@angular-devkit/core';
import * as ts from 'typescript';

import {
  addImportsToComponent,
  getAppComponentPath,
  getBootstrappedComponentPath,
  getComponentTemplateDescriptor,
  getProject,
  isStandaloneProject,
  TemplateDescriptor,
  writeText,
} from '../../util/index.js';
import { wrapHtmlFileTemplateInLayout, wrapInlineTemplateInLayout } from './layout-content.js';
import { Schema } from '../schema.js';

/** The layout components the wrapped template uses, which a standalone root component imports. */
const LAYOUT_COMPONENTS = ['NbLayoutComponent', 'NbLayoutHeaderComponent', 'NbLayoutColumnComponent', 'NbLayoutFooterComponent'];

/**
 * Wraps the root component's template, inline or in its own file, in `nb-layout` with a header, a column and a
 * footer; Lyra's components need a layout around them. A standalone root component also gets the layout components
 * in its `imports`.
 */
export function wrapRootComponentInLayout(options: Schema): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const project = await getProject(tree, options.project);
    const standalone = isStandaloneProject(tree, project);
    const componentPath = (standalone ? getBootstrappedComponentPath(tree, project) : undefined) ??
      await getAppComponentPath(tree, options.project);
    const templateDescriptor: TemplateDescriptor = getComponentTemplateDescriptor(tree, componentPath);

    if (templateDescriptor.isInline()) {
      wrapInlineTemplate(tree, templateDescriptor);
    } else {
      wrapHtmlFileTemplate(tree, templateDescriptor);
    }

    // After wrapping, which edits the component file by the positions of its first parse.
    if (standalone && !addImportsToComponent(tree, componentPath, LAYOUT_COMPONENTS, '@liquid-js/lyr-core')) {
      context.logger.warn(`Could not add ${LAYOUT_COMPONENTS.join(', ')} to the imports of ${componentPath}; ` +
        'please import them there yourself.');
    }
  };
}

function wrapInlineTemplate(tree: Tree, templateDescriptor: TemplateDescriptor) {
  const { templateProp, componentPath, template } = templateDescriptor;

  const wrappedTemplate = wrapInlineTemplateInLayout(template);
  const recorder = tree.beginUpdate(componentPath)
    .remove(templateProp.initializer.pos, templateProp.initializer.getFullText().length)
    .insertLeft(templateProp.initializer.pos, wrappedTemplate);

  tree.commitUpdate(recorder);
}

function wrapHtmlFileTemplate(tree: Tree, templateDescriptor: TemplateDescriptor) {
  const { templateUrlProp, componentPath, template } = templateDescriptor;

  const templateUrl = (templateUrlProp.initializer as ts.StringLiteral).text;
  const dir = dirname(normalize(componentPath));
  const templatePath = join(dir, templateUrl);

  writeText(tree, templatePath, wrapHtmlFileTemplateInLayout(template));
}
