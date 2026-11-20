import { readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import * as ts from 'typescript';
import { hasDocsPrivateTag, parseComment, type CommentTag, type ParsedComment } from './comment.ts';
import { exampleNodes, type OverviewNode } from './examples.ts';

/**
 * Extracts the API documentation the docs app renders from the library sources.
 *
 * The output follows the JSON that typedoc 0.12 + doc-prsr produced for the original docs:
 * one entry per documented class or interface with its props, methods, `@styles`
 * block, overview nodes and live examples. Member ordering also follows typedoc:
 * properties before accessors, constructors before methods, alphabetical within.
 */

export interface DocProp {
  isDocsPrivate?: boolean;
  inherited?: string;
  kind: 'input' | 'output' | 'property';
  platform: null;
  isStatic: boolean;
  type: string;
  required: null;
  name: string;
  shortDescription?: string;
  description?: string;
}

export interface DocParam {
  name: string;
  type: string;
  required: null;
  shortDescription: string;
  description: string;
}

export interface DocMethod {
  examples: unknown[];
  params: DocParam[];
  platform: null;
  name: string;
  type: [string | null];
  isStatic: boolean;
  shortDescription: string;
  description: string;
  isDocsPrivate: boolean;
  inherited?: string;
}

export interface DocStyle {
  shortDescription: string;
  styles: { name: string; description: string; value?: string; parent?: string }[];
}

export interface DocClass {
  kind: 'component' | 'directive' | 'service' | 'class' | 'interface';
  platform: null;
  examples: unknown[];
  props: DocProp[];
  methods: DocMethod[];
  name: string;
  description: string;
  shortDescription: string;
  styles: DocStyle[];
  liveExamples: OverviewNode[];
  overview: OverviewNode[];
}

type MemberNode =
  | ts.PropertyDeclaration
  | ts.PropertySignature
  | ts.GetAccessorDeclaration
  | ts.SetAccessorDeclaration
  | ts.MethodDeclaration
  | ts.MethodSignature
  | ts.ConstructorDeclaration
  | ts.ParameterDeclaration;

interface Member {
  name: string;
  kind: 'property' | 'accessor' | 'constructor' | 'method';
  nodes: MemberNode[];
  inheritedFrom?: string;
  /** The class or interface the member is declared in, when it's inherited. */
  base?: Owner;
}

type Owner = ts.ClassDeclaration | ts.InterfaceDeclaration;

const LIB_EXCLUDES = ['playground', 'docs'];

export function collectSourceFiles(packagesDir: string): string[] {
  const files = new Array<string>();
  // Packages are directories; files next to them, such as the shared test setup, aren't documented.
  const packages = readdirSync(packagesDir, { withFileTypes: true }).filter((entry) => entry.isDirectory());
  for (const pkg of packages.map((entry) => entry.name).sort()) {
    if (LIB_EXCLUDES.includes(pkg)) {
      continue;
    }
    walk(join(packagesDir, pkg), files);
  }
  return files;
}

function walk(dir: string, files: string[]) {
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', 'schematics', 'dist'].includes(entry.name)) {
        walk(path, files);
      }
    } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts') && !entry.name.endsWith('.d.ts')) {
      files.push(path);
    }
  }
}

export function extractApi(rootDir: string, files: string[]): DocClass[] {
  const configPath = join(rootDir, 'tsconfig.json');
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, rootDir);
  const program = ts.createProgram(files, { ...parsed.options, noEmit: true, skipLibCheck: true });
  const checker = program.getTypeChecker();
  const classes = new Array<DocClass>();

  for (const file of files) {
    const source = program.getSourceFile(file);
    if (!source) {
      continue;
    }
    for (const statement of source.statements) {
      if (ts.isClassDeclaration(statement) || ts.isInterfaceDeclaration(statement)) {
        const comment = commentOf(statement);
        if (comment && statement.name) {
          classes.push(documentClass(statement, comment, checker));
        }
      }
    }
  }

  return classes;
}

function commentOf(node: ts.Node): ParsedComment | undefined {
  const jsDocs = (node as { jsDoc?: ts.JSDoc[] }).jsDoc;
  if (!jsDocs?.length) {
    return undefined;
  }
  return parseComment(jsDocs[jsDocs.length - 1].getText());
}

function documentClass(
  node: ts.ClassDeclaration | ts.InterfaceDeclaration,
  comment: ParsedComment,
  checker: ts.TypeChecker,
): DocClass {
  if (!node.name) {
    throw new Error('A documented class needs a name.');
  }
  const name = node.name.text;
  const members = collectMembers(node, checker);
  const exampleGroups = comment.tags.map(exampleNodes).filter((group) => group !== undefined);
  const methods = documentMethods(members, node, checker);
  for (const method of methods.filter((candidate) => candidate.name === 'constructor')) {
    method.type = [name];
  }

  return {
    kind: classKind(node),
    platform: null,
    examples: [],
    props: documentProps(members, node, checker),
    methods,
    name,
    description: '',
    shortDescription: '',
    styles: documentStyles(comment.tags),
    liveExamples: exampleGroups.filter((group) => group[0].type !== 'inline-example').map((group) => group[0]),
    overview: [
      { type: 'text', content: comment.shortText },
      { type: 'text', content: comment.text },
      ...exampleGroups.filter((group) => group[0].type !== 'additional-example').flat(),
    ].filter((entry) => entry.content),
  };
}

function classKind(node: ts.ClassDeclaration | ts.InterfaceDeclaration): DocClass['kind'] {
  if (ts.isInterfaceDeclaration(node)) {
    return 'interface';
  }
  switch (decoratorName(ts.getDecorators(node)?.[0])) {
    case 'Component':
      return 'component';
    case 'Directive':
      return 'directive';
    case 'Injectable':
    case 'Service':
      return 'service';
    default:
      return 'class';
  }
}

function decoratorName(decorator: ts.Decorator | undefined): string | undefined {
  if (!decorator) {
    return undefined;
  }
  const expression = ts.isCallExpression(decorator.expression) ? decorator.expression.expression : decorator.expression;
  return ts.isIdentifier(expression) ? expression.text : undefined;
}

function decoratorCall(decorator: ts.Decorator | undefined): ts.CallExpression | undefined {
  return decorator && ts.isCallExpression(decorator.expression) ? decorator.expression : undefined;
}

// --- members -----------------------------------------------------------------

function collectMembers(node: ts.ClassDeclaration | ts.InterfaceDeclaration, checker: ts.TypeChecker): Member[] {
  const members = new Map<string, Member>();
  const addFrom = (declaration: ts.ClassDeclaration | ts.InterfaceDeclaration, inheritedFrom?: string) => {
    // Constructor parameter properties (`constructor(public data: T)`) document like declared properties.
    const constructorParameters = declaration.members
      .filter(ts.isConstructorDeclaration)
      .flatMap((constructor) =>
        constructor.parameters.filter((parameter) => ts.isParameterPropertyDeclaration(parameter, constructor)),
      )
      .filter((parameter) => !isHidden(parameter));
    for (const member of [...declaration.members, ...constructorParameters]) {
      // Protected and private members are the class's own workings, not its API.
      if (isHidden(member)) {
        continue;
      }
      const key = memberKey(member as MemberNode);
      if (!key) {
        continue;
      }
      const existing = members.get(key.name);
      if (existing && existing.inheritedFrom === inheritedFrom) {
        existing.nodes.push(member as MemberNode);
      } else if (!existing) {
        members.set(key.name, {
          ...key,
          nodes: [member as MemberNode],
          inheritedFrom,
          ...(inheritedFrom ? { base: declaration } : {}),
        });
      }
    }
    for (const base of baseDeclarations(declaration, checker)) {
      addFrom(base, base.name?.text);
    }
  };
  addFrom(node);
  return [...members.values()];
}

function isHidden(member: ts.Node): boolean {
  const flags = ts.getCombinedModifierFlags(member as ts.Declaration);
  return !!(flags & (ts.ModifierFlags.Private | ts.ModifierFlags.Protected));
}

function memberKey(member: MemberNode): { name: string; kind: Member['kind'] } | undefined {
  if (ts.isConstructorDeclaration(member)) {
    return { name: 'constructor', kind: 'constructor' };
  }
  const nameNode = member.name;
  const name = nameNode && (ts.isIdentifier(nameNode) || ts.isStringLiteral(nameNode)) ? nameNode.text : undefined;
  if (!name) {
    return undefined;
  }
  if (ts.isPropertyDeclaration(member) && member.initializer && isFunctionExpression(member.initializer)) {
    // `onChange = () => {}` documents as a method, as the original docs did.
    return { name, kind: 'method' };
  }
  if (ts.isPropertyDeclaration(member) || ts.isPropertySignature(member) || ts.isParameter(member)) {
    return { name, kind: 'property' };
  }
  if (ts.isGetAccessorDeclaration(member) || ts.isSetAccessorDeclaration(member)) {
    return { name, kind: 'accessor' };
  }
  if (ts.isMethodDeclaration(member) || ts.isMethodSignature(member)) {
    return { name, kind: 'method' };
  }
  return undefined;
}

type MethodLike =
  | ts.MethodDeclaration
  | ts.MethodSignature
  | ts.ConstructorDeclaration
  | ts.ArrowFunction
  | ts.FunctionExpression;

function isFunctionExpression(node: ts.Expression): node is ts.ArrowFunction | ts.FunctionExpression {
  return ts.isArrowFunction(node) || ts.isFunctionExpression(node);
}

function baseDeclarations(
  node: ts.ClassDeclaration | ts.InterfaceDeclaration,
  checker: ts.TypeChecker,
): (ts.ClassDeclaration | ts.InterfaceDeclaration)[] {
  const bases = new Array<ts.ClassDeclaration | ts.InterfaceDeclaration>();
  for (const clause of node.heritageClauses ?? []) {
    if (clause.token !== ts.SyntaxKind.ExtendsKeyword) {
      continue;
    }
    for (const type of clause.types) {
      let symbol = checker.getSymbolAtLocation(type.expression);
      if (symbol && symbol.flags & ts.SymbolFlags.Alias) {
        symbol = checker.getAliasedSymbol(symbol);
      }
      const declaration = symbol?.declarations?.find(
        (candidate) => ts.isClassDeclaration(candidate) || ts.isInterfaceDeclaration(candidate),
      ) as ts.ClassDeclaration | ts.InterfaceDeclaration | undefined;
      const external = declaration?.getSourceFile().fileName.includes('/node_modules/');
      if (declaration?.name && !external) {
        bases.push(declaration);
      }
    }
  }
  return bases;
}

function isStatic(node: ts.Node): boolean {
  return !!(ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Static);
}

// --- props -------------------------------------------------------------------

function documentProps(members: Member[], owner: Owner, checker: ts.TypeChecker): DocProp[] {
  const byName = (a: Member, b: Member) => a.name.localeCompare(b.name);
  const props = members.filter((member) => member.kind === 'property' || member.kind === 'accessor');
  const ordered = [
    ...props.filter((member) => member.kind === 'property').sort(byName),
    ...props.filter((member) => member.kind === 'accessor').sort(byName),
  ];
  return ordered.flatMap((member) => {
    const commented = member.nodes.map((node) => ({ node, comment: commentOf(node) })).find((entry) => entry.comment);
    if (!commented?.comment) {
      return [];
    }
    const prop = documentProp(member, commented.node, commented.comment, owner, checker);
    // A model is an input and a `<name>Change` output.
    return signalMember(member)?.model ? [prop, modelChangeProp(prop)] : [prop];
  });
}

function modelChangeProp(prop: DocProp): DocProp {
  return {
    ...prop,
    kind: 'output',
    name: `${prop.name}Change`,
    shortDescription: `Emits when \`${prop.name}\` changes.`,
    description: undefined,
  };
}

/**
 * A signal input, model or output declared with `input()`, `model()`, `output()` or `outputFromObservable()`, with
 * its alias if it has one.
 */
function signalMember(
  member: Member,
): { kind: 'input' | 'output'; model: boolean; call: ts.CallExpression; alias?: string } | undefined {
  const property = member.nodes.find(ts.isPropertyDeclaration);
  const call = property?.initializer;
  if (!call || !ts.isCallExpression(call)) {
    return undefined;
  }
  // `input(...)`, `input.required(...)`, `model(...)`, `model.required(...)`, `output(...)`,
  // `outputFromObservable(...)`
  const required = ts.isPropertyAccessExpression(call.expression);
  const callee = required ? call.expression.expression : call.expression;
  if (!ts.isIdentifier(callee) || !['input', 'model', 'output', 'outputFromObservable'].includes(callee.text)) {
    return undefined;
  }
  // The options follow the initial value, which `.required()` and `output()` don't take.
  const options = call.arguments[required || callee.text === 'output' ? 0 : 1];
  const aliasOption = options && ts.isObjectLiteralExpression(options)
    ? options.properties
      .filter(ts.isPropertyAssignment)
      .find((option) => ts.isIdentifier(option.name) && option.name.text === 'alias')
    : undefined;
  const alias = aliasOption && ts.isStringLiteral(aliasOption.initializer) ? aliasOption.initializer.text : undefined;
  const kind = callee.text === 'output' || callee.text === 'outputFromObservable' ? 'output' : 'input';
  return { kind, model: callee.text === 'model', call, alias };
}

/**
 * The type a signal input is written with, or the event type of an output.
 */
function signalMemberType(member: Member, checker: ts.TypeChecker): string | undefined {
  const property = member.nodes.find(ts.isPropertyDeclaration);
  if (!property) {
    return undefined;
  }
  // The value type written in the source, as `input<NbComponentOrCustomStatus>()`, reads better than the checker's
  // expansion of it.
  const call = signalMember(member)?.call;
  const typeArgument = call?.typeArguments?.[0];
  if (typeArgument) {
    // A class type parameter, as `input<A>()` in a generic base class, reads as its default or constraint.
    const declaration = ts.isTypeReferenceNode(typeArgument)
      ? checker.getSymbolAtLocation(typeArgument.typeName)?.declarations?.[0]
      : undefined;
    if (declaration && ts.isTypeParameterDeclaration(declaration)) {
      const resolved = declaration.default ?? declaration.constraint;
      if (resolved) {
        return renderType(resolved);
      }
    }
    return renderType(typeArgument);
  }
  return signalType(checker.getTypeAtLocation(property), property, checker);
}

/** The type a signal input of the given type is written with, or the event type of an output. */
function signalType(type: ts.Type, at: ts.Node, checker: ts.TypeChecker): string | undefined {
  const name = type.getSymbol()?.getName() ?? type.aliasSymbol?.getName();
  const args = checker.getTypeArguments(type as ts.TypeReference);
  // InputSignalWithTransform<T, W> is written with W; InputSignal<T>, ModelSignal<T>, OutputEmitterRef<T> and
  // OutputRef<T> with T. A transform that takes anything, as Angular's `booleanAttribute` does, tells nothing, so
  // such an input reads as the type it holds.
  if (name === 'InputSignalWithTransform' && args.length === 2) {
    const accepted = args[1].flags & (ts.TypeFlags.Unknown | ts.TypeFlags.Any) ? args[0] : args[1];
    return typeText(accepted, at, checker);
  }
  if (name && ['InputSignal', 'ModelSignal', 'OutputEmitterRef', 'OutputRef'].includes(name) && args.length) {
    return typeText(args[0], at, checker);
  }
  return undefined;
}

/** A type as text, by the names in scope where it's read; a module path a name would need is left out. */
function typeText(type: ts.Type, at: ts.Node, checker: ts.TypeChecker): string {
  return checker
    .typeToString(type, at, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope)
    .replace(/import\("[^"]*"\)\./g, '');
}

/** The type parameters of the base declaration an inherited member comes from. */
function baseTypeParameters(member: Member): string[] {
  return member.base?.typeParameters?.map((parameter) => parameter.name.text) ?? [];
}

/** Whether a type, as text, names a type parameter of the base declaration the member comes from. */
function mentionsBaseTypeParameters(member: Member, type: string | null | undefined): boolean {
  const named = (name: string) => new RegExp(`(?<![\\w.])${name}(?![\\w.])`).test(type ?? '');
  return !!type && baseTypeParameters(member).some(named);
}

/** An inherited member's type as the owner has it, with the base's type arguments filled in. */
function memberTypeIn(member: Member, owner: Owner, checker: ts.TypeChecker): ts.Type | undefined {
  const symbol = checker.getTypeAtLocation(owner).getProperty(member.name);
  return symbol && checker.getTypeOfSymbolAtLocation(symbol, owner);
}

function documentProp(
  member: Member,
  node: MemberNode,
  comment: ParsedComment,
  owner: Owner,
  checker: ts.TypeChecker,
): DocProp {
  const decorator = ts.canHaveDecorators(node) ? ts.getDecorators(node)?.[0] : undefined;
  const decoratorKind = decoratorName(decorator);
  const signal = signalMember(member);
  const kind = signal?.kind ?? (decoratorKind === 'Input' ? 'input' : decoratorKind === 'Output' ? 'output' : 'property');
  let name = signal?.alias ?? member.name;
  const alias = decoratorCall(decorator)?.arguments[0];
  if (!signal && kind === 'input' && alias && ts.isStringLiteral(alias)) {
    name = alias.text;
  }
  let type = (signal && signalMemberType(member, checker)) ?? propType(member, comment, checker);
  // A member of a generic base class reads with the type arguments this class gives it, e.g. `NbButton<A>`'s
  // `appearance` as `NbButtonAppearance` in `NbButtonComponent`, not `A`.
  if (mentionsBaseTypeParameters(member, type)) {
    const ownerType = memberTypeIn(member, owner, checker);
    const read = signal ? signalType : typeText;
    type = (ownerType && read(ownerType, owner, checker)) ?? type;
  }
  return {
    isDocsPrivate: comment.tags.length ? hasDocsPrivateTag(comment.tags) : undefined,
    inherited: member.inheritedFrom ? `${member.inheritedFrom}.${member.name}` : undefined,
    kind,
    platform: null,
    isStatic: member.nodes.some(isStatic),
    type,
    required: null,
    name,
    shortDescription: comment.shortText || undefined,
    description: comment.text || undefined,
  };
}

function propType(member: Member, comment: ParsedComment, checker: ts.TypeChecker): string {
  const property = member.nodes.find(
    (node) => ts.isPropertyDeclaration(node) || ts.isPropertySignature(node) || ts.isParameter(node),
  ) as ts.PropertyDeclaration | ts.PropertySignature | ts.ParameterDeclaration | undefined;
  if (property?.type) {
    return renderType(property.type);
  }
  if (property && ts.isPropertyDeclaration(property) && property.initializer) {
    return typeText(checker.getTypeAtLocation(property), property, checker);
  }
  if (comment.tags.length) {
    return comment.tags[0].text.replace(/[\n{}]+/g, '');
  }
  const setter = member.nodes.find(ts.isSetAccessorDeclaration);
  if (setter?.parameters[0]?.type) {
    return renderType(setter.parameters[0].type);
  }
  const getter = member.nodes.find(ts.isGetAccessorDeclaration);
  if (getter?.type) {
    return renderType(getter.type);
  }
  return '';
}

// --- methods -----------------------------------------------------------------

function documentMethods(members: Member[], owner: Owner, checker: ts.TypeChecker): DocMethod[] {
  const methods = members.filter((member) => member.kind === 'method' || member.kind === 'constructor');
  const ordered = [
    ...methods.filter((member) => member.kind === 'constructor'),
    ...methods.filter((member) => member.kind === 'method').sort((a, b) => a.name.localeCompare(b.name)),
  ];
  return ordered.map((member) => {
    const declared = member.nodes.find((node) => (node as ts.MethodDeclaration).body) ?? member.nodes[0];
    const signature = (
      ts.isPropertyDeclaration(declared) && declared.initializer && isFunctionExpression(declared.initializer)
        ? declared.initializer
        : declared
    ) as MethodLike;
    const comment = member.nodes.map(commentOf).find((candidate) => candidate);
    const params = documentParams(signature, comment);
    let type = methodType(signature, checker);
    // A method of a generic base class reads with the type arguments this class gives it.
    const paramsMention = params.some((param) => mentionsBaseTypeParameters(member, param.type));
    if (mentionsBaseTypeParameters(member, type) || paramsMention) {
      const ownerType = memberTypeIn(member, owner, checker);
      const resolved = ownerType && checker.getSignaturesOfType(ownerType, ts.SignatureKind.Call)[0];
      if (resolved) {
        resolved.getParameters().forEach((symbol, index) => {
          if (params[index] && mentionsBaseTypeParameters(member, params[index].type)) {
            params[index].type = typeText(checker.getTypeOfSymbolAtLocation(symbol, owner), owner, checker);
          }
        });
        if (mentionsBaseTypeParameters(member, type)) {
          type = typeText(resolved.getReturnType(), owner, checker);
        }
      }
    }
    return {
      examples: [],
      params,
      platform: null,
      name: member.name,
      type: [type],
      isStatic: member.nodes.some(isStatic),
      shortDescription: comment?.shortText ?? '',
      description: comment?.text ?? '',
      isDocsPrivate: member.nodes.map(commentOf).some((candidate) => candidate && hasDocsPrivateTag(candidate.tags)),
      inherited: member.inheritedFrom ? `${member.inheritedFrom}.${member.name}` : undefined,
    };
  });
}

function documentParams(signature: ts.SignatureDeclarationBase, comment: ParsedComment | undefined): DocParam[] {
  return signature.parameters.map((parameter) => {
    const name = ts.isIdentifier(parameter.name) ? parameter.name.text : parameter.name.getText();
    const paramTag = comment?.tags.find((tag) => tag.tag === 'param' && paramTagName(tag) === name);
    const description = paramTag ? paramTagText(paramTag) : '';
    return {
      name,
      type: parameter.type ? renderType(parameter.type) : '',
      required: null,
      shortDescription: '',
      description,
    };
  });
}

function paramTagName(tag: CommentTag): string {
  return tag.text.replace(/^\{[^}]*\}\s*/, '').split(/\s/)[0];
}

function paramTagText(tag: CommentTag): string {
  return tag.text.replace(/^\{[^}]*\}\s*/, '').replace(/^\S+\s*/, '').trim();
}

function methodType(signature: ts.SignatureDeclarationBase, checker: ts.TypeChecker): string | null {
  if (ts.isConstructorDeclaration(signature)) {
    const parent = signature.parent;
    return ts.isClassDeclaration(parent) && parent.name ? parent.name.text : null;
  }
  if (signature.type) {
    return renderType(signature.type) || null;
  }
  const resolved = checker.getSignatureFromDeclaration(signature as ts.SignatureDeclaration);
  return resolved ? typeText(resolved.getReturnType(), signature, checker) : 'void';
}

// --- types -------------------------------------------------------------------

function renderType(type: ts.TypeNode): string {
  if (ts.isTypeReferenceNode(type)) {
    const name = ts.isIdentifier(type.typeName) ? type.typeName.text : type.typeName.getText();
    const args = type.typeArguments?.map(renderType);
    return args?.length ? `${name}<${args.join(', ')}>` : name;
  }
  if (ts.isArrayTypeNode(type)) {
    return `${renderType(type.elementType)}[]`;
  }
  if (ts.isUnionTypeNode(type) || ts.isIntersectionTypeNode(type)) {
    const separator = ts.isUnionTypeNode(type) ? ' | ' : ' & ';
    return type.types.map(renderType).join(separator);
  }
  if (ts.isTypeLiteralNode(type)) {
    const parts = type.members.map((member) => {
      if (ts.isIndexSignatureDeclaration(member)) {
        const key = member.parameters[0];
        return `[${key.name.getText()}: ${key.type ? renderType(key.type) : 'any'}]: ${member.type ? renderType(member.type) : 'any'}`;
      }
      const name = member.name?.getText() ?? '';
      const memberType = (member as ts.PropertySignature).type;
      return `${name}: ${memberType ? renderType(memberType) : 'any'}`;
    });
    return `{${parts.join(', ')}}`;
  }
  if (ts.isFunctionTypeNode(type)) {
    const params = type.parameters.map(
      (parameter) => `${parameter.name.getText()}: ${parameter.type ? renderType(parameter.type) : 'any'}`,
    );
    return `(${params.join(', ')}) => ${renderType(type.type)}`;
  }
  if (ts.isParenthesizedTypeNode(type)) {
    return renderType(type.type);
  }
  if (ts.isTypeOperatorNode(type)) {
    return renderType(type.type);
  }
  if (ts.isLiteralTypeNode(type)) {
    return type.literal.getText();
  }
  return type.getText();
}

// --- styles ------------------------------------------------------------------

function documentStyles(tags: CommentTag[]): DocStyle[] {
  return tags
    .filter((tag) => tag.tag === 'styles')
    .map((tag) => {
      const blocks = tag.text.split('\n\n');
      const shortDescription = blocks[0];
      const styles = (blocks[1] ?? '')
        .split('\n')
        .filter((line) => line)
        .map((line) => {
          const [key, value] = line.split(':');
          return { name: key ? key.trim() : '', description: value ? value.trim() : '' };
        });
      return { shortDescription, styles };
    });
}

export function relativeId(rootDir: string, file: string): string {
  return relative(rootDir, file).split(sep).join('/');
}
