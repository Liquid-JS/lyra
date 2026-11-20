/**
 * JSDoc block parsing that mirrors how typedoc 0.12 split a comment into a short
 * description, a description and tags. The docs app was written against that
 * shape, so the quirks are intentional: tag names are lower-cased up to the first
 * whitespace, the tag line remainder is trimmed, and tag bodies keep their
 * trailing newlines while the descriptions are trimmed.
 */

export interface CommentTag {
  tag: string;
  text: string;
}

export interface ParsedComment {
  shortText: string;
  text: string;
  tags: CommentTag[];
}

export function parseComment(raw: string): ParsedComment {
  const body = raw.replace(/^\/\*\*\s*/, '').replace(/\s*\*\/$/, '');
  const comment: ParsedComment = { shortText: '', text: '', tags: [] };
  let currentTag: CommentTag | undefined;
  let shortTextState = 0;
  let inCode = false;

  for (const rawLine of body.split(/\r\n?|\n/)) {
    const line = rawLine.replace(/^\s*\*? ?/, '');
    if (line.trim().startsWith('```')) {
      inCode = !inCode;
    }
    const tagMatch = inCode ? null : /^@(\S+)/.exec(line);
    if (tagMatch) {
      currentTag = { tag: tagMatch[1].toLowerCase(), text: line.substring(tagMatch[0].length).trim() + '\n' };
      comment.tags.push(currentTag);
    } else if (currentTag) {
      currentTag.text += line + '\n';
    } else if (line === '' && shortTextState === 0) {
      // leading blank lines are ignored
    } else if (line === '' && shortTextState === 1) {
      shortTextState = 2;
    } else if (shortTextState === 2) {
      comment.text += line + '\n';
    } else {
      comment.shortText += line + '\n';
      shortTextState = 1;
    }
  }

  comment.shortText = comment.shortText.trim();
  comment.text = comment.text.trim();
  return comment;
}

export function hasDocsPrivateTag(tags: CommentTag[]): boolean {
  return tags.some((tag) => tag.tag === 'docs-private');
}
