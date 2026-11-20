import { nbFormatMarkdown } from '@liquid-js/lyr-extras/markdown-editor';

describe('nbFormatMarkdown', () => {
  it('should write markdown in one style', async () => {
    expect(await nbFormatMarkdown('Title\n=====\n\n* one\n* two\n\n__bold__ *italic*\n\n|a|b|\n|-|-|\n|1|22|')).toBe(
      '# Title\n\n- one\n- two\n\n**bold** _italic_\n\n| a | b  |\n| - | -- |\n| 1 | 22 |\n',
    );
  });

  it('should write prose in plain characters, and leave code as it is', async () => {
    expect(
      await nbFormatMarkdown(
        '# It’s “quoted” — dashed – ranged…\n\n[a “link”](https://example.com "A ‘title’") ![it’s](a.png) `it’s…`\n\n```ts\nconst a = \'“x” – y…\';\n```',
      ),
    ).toBe(
      '# It\'s "quoted" --- dashed -- ranged...\n\n[a "link"](https://example.com "A \'title\'") ![it\'s](a.png) `it’s…`\n\n```ts\nconst a = \'“x” – y…\';\n```\n',
    );
  });

  it('should write a rule written as HTML as markdown\'s', async () => {
    expect(await nbFormatMarkdown('One\n\n<hr>\n\nTwo\n\n<div>Note</div>\n<hr />\n\nThree <hr> inline')).toBe(
      'One\n\n---\n\nTwo\n\n<div>Note</div>\n\n---\n\nThree <hr> inline\n',
    );
  });

  it('should leave front matter as it is', async () => {
    expect(await nbFormatMarkdown('---\ntitle: “Quoted” – here\n---\n\n* one')).toBe(
      '---\ntitle: “Quoted” – here\n---\n\n- one\n',
    );
  });
});
