import { SchematicsException, Tree } from '@angular-devkit/schematics'
import * as ts from 'typescript'

/*
 * Source helpers the schematics use, here rather than from `@angular/cdk/schematics`: `ng add` installs the CDK while
 * it runs, and Node, having looked for the CDK before it was there, then can't import it.
 */

/** A TypeScript file of the tree, parsed with its parents set. */
export function parseSourceFile(tree: Tree, path: string): ts.SourceFile {
    const buffer = tree.read(path)
    if (!buffer) {
        throw new SchematicsException(`Could not read file (${path}).`)
    }
    return ts.createSourceFile(path, buffer.toString(), ts.ScriptTarget.Latest, true)
}

/**
 * The metadata object literals of the file's decorators with the given name, e.g. `Component`, where it's imported
 * from the given module, e.g. `@angular/core`, under its own name or another.
 */
export function getDecoratorMetadata(source: ts.SourceFile, name: string, moduleName: string): ts.ObjectLiteralExpression[] {
    const localNames = new Set<string>()
    for (const statement of source.statements) {
        const bindings = ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier) && statement.moduleSpecifier.text === moduleName
            ? statement.importClause?.namedBindings
            : undefined
        if (bindings && ts.isNamedImports(bindings)) {
            for (const element of bindings.elements) {
                if ((element.propertyName ?? element.name).text === name) {
                    localNames.add(element.name.text)
                }
            }
        }
    }

    const found: ts.ObjectLiteralExpression[] = []
    const visit = (node: ts.Node) => {
        if (ts.isDecorator(node) && ts.isCallExpression(node.expression)) {
            const call = node.expression
            const [metadata] = call.arguments
            if (ts.isIdentifier(call.expression) && localNames.has(call.expression.text) && metadata && ts.isObjectLiteralExpression(metadata)) {
                found.push(metadata)
            }
        }
        ts.forEachChild(node, visit)
    }
    visit(source)
    return found
}

/** Whether the NgModule in the file lists the given class, as written, in its `imports`. */
export function hasNgModuleImport(tree: Tree, modulePath: string, className: string): boolean {
    const [metadata] = getDecoratorMetadata(parseSourceFile(tree, modulePath), 'NgModule', '@angular/core')
    if (!metadata) {
        throw new SchematicsException(`Could not find NgModule declaration inside: "${modulePath}"`)
    }
    const imports = metadata.properties.find(
        (property): property is ts.PropertyAssignment => ts.isPropertyAssignment(property) && property.name.getText() === 'imports'
    )
    if (!imports || !ts.isArrayLiteralExpression(imports.initializer)) {
        return false
    }
    return imports.initializer.elements.some((element) => element.getText() === className)
}
