const sanitizeHtml = require('sanitize-html');

// Blog content is rich-text HTML authored by students/teachers through the
// Quill editor (WriteBlogForm.jsx) and rendered on the live site — and in
// the admin's own review screen — via dangerouslySetInnerHTML. Without
// sanitizing it server-side, ANY account that can submit a blog post
// (including self-registered students/teachers, not just trusted admins)
// could inject a <script> tag or an onerror handler that executes in a
// visitor's browser, or worse, in the admin's browser the moment they open
// the post to review it. This is the single choke point that prevents that,
// applied on every create/update regardless of what the client sent.
const sanitizeBlogContent = (html) => {
  if (typeof html !== 'string') return html;

  return sanitizeHtml(html, {
    allowedTags: [
      'p', 'br', 'div', 'span',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'sub', 'sup', 'blockquote', 'pre', 'code',
      'ul', 'ol', 'li',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height'],
      '*': ['class', 'style'],
    },
    // Only allow genuinely safe URL schemes — this is what actually blocks
    // javascript: URLs in links/images, not just tag/attribute filtering.
    allowedSchemes: ['http', 'https', 'mailto', 'tel', 'data'],
    allowedSchemesByTag: {
      img: ['http', 'https', 'data'],
    },
    // Strips risky inline CSS values (e.g. expression(), url(javascript:...))
    // while still allowing normal formatting styles Quill produces.
    allowedStyles: {
      '*': {
        color: [/^#[0-9a-fA-F]{3,6}$/, /^rgb\(/, /^rgba\(/],
        'background-color': [/^#[0-9a-fA-F]{3,6}$/, /^rgb\(/, /^rgba\(/],
        'text-align': [/^left$|^right$|^center$|^justify$/],
        'font-weight': [/^\d+$|^bold$|^normal$/],
      },
    },
    // Force target="_blank" links to be safe (no window.opener access back
    // to this site from whatever page they link to), and guarantee every
    // image has SOME alt text even if the author never set one in the
    // editor — fixes the accessibility gap at the source for every post
    // going forward, not just ones written carefully.
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }, true),
      img: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, alt: attribs.alt || '' },
      }),
    },
  });
};

module.exports = sanitizeBlogContent;
