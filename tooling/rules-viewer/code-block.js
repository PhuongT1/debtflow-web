const supported = new Set([
  'js',
  'javascript',
  'ts',
  'typescript',
  'tsx',
  'jsx',
  'json',
  'bash',
  'sh',
  'shell',
  'css',
  'scss',
  'html',
  'graphql',
]);
const keywords = new Set(
  'const let var function async await return export import from default if else class extends new true false null undefined interface type string number boolean void public private readonly query mutation fragment on implements enum input schema'.split(
    ' ',
  ),
);
// Small lexical highlighter, not a compiler. Unknown languages remain exact plain text.
export function appendCode(pre, text, language) {
  if (!supported.has(language)) {
    pre.append(document.createTextNode(text));
    return;
  }
  const tokens =
    /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\/\/[^\n]*|#[^\n]*|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*\b)/g;
  let offset = 0;
  for (const match of text.matchAll(tokens)) {
    pre.append(document.createTextNode(text.slice(offset, match.index)));
    const token = match[0];
    const kind = /^['"`]/.test(token)
      ? 'string'
      : /^(\/\/|#)/.test(token)
        ? 'comment'
        : /^\d/.test(token)
          ? 'number'
          : keywords.has(token)
            ? 'keyword'
            : '';
    if (kind) {
      const span = document.createElement('span');
      span.className = 'syntax-' + kind;
      span.textContent = token;
      pre.append(span);
    } else pre.append(document.createTextNode(token));
    offset = match.index + token.length;
  }
  pre.append(document.createTextNode(text.slice(offset)));
}
export function codeBlock(language = '') {
  const frame = document.createElement('div');
  frame.className = 'code-block';
  const header = document.createElement('div');
  header.className = 'code-header';
  const label = document.createElement('span');
  label.textContent = language || 'Plain text';
  const copy = document.createElement('button');
  copy.textContent = 'Copy';
  copy.setAttribute('aria-label', 'Copy code');
  const pre = document.createElement('pre');
  pre.tabIndex = 0;
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pre.textContent);
      copy.textContent = 'Copied';
    } catch {
      copy.textContent = 'Select code to copy';
    }
    setTimeout(() => {
      copy.textContent = 'Copy';
    }, 1800);
  });
  header.append(label, copy);
  frame.append(header, pre);
  return { frame, pre };
}
