import * as ts from 'typescript';

/**
 * Returns count of the characters between new line and node start.
 * If node has no indentation, function searches for the first indented parent node.
 * @param source Source file full text.
 * @param node Node indentation to find.
 */
export function getNodeIndentation(source: string, node: ts.Node): number {
  if (node == null) {
    return 0;
  }

  const textBeforeNode = source.slice(node.getFullStart(), node.getStart());
  const lastNewLineIndex = textBeforeNode.lastIndexOf('\n');

  return lastNewLineIndex === -1
    ? getNodeIndentation(source, node.parent)
    : textBeforeNode.slice(lastNewLineIndex + 1).length;
}
