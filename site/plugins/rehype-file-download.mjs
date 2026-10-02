/**
 * rehype-file-download.mjs — turns a plain link in Markdown into a download card.
 *
 * Write this in any Markdown page:
 *   <a class="file-download" href="/slides/tts-day1-death-by-powerpoint.pptx">Download the Day 1 deck</a>
 *
 * At build time it becomes the card: an icon for the file type, the label,
 * and "filename · type · size", with the size read from the file in /public.
 * A link to a file that isn't in /public fails the build, so a broken
 * download never goes live. Without this plugin it is still a working link.
 *
 * New file type? Add a line to FILE_TYPES (and an icon to /public/images).
 */

import { statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const PUBLIC = fileURLToPath(new URL('../public/', import.meta.url));

export const FILE_TYPES = {
  pptx: { name: 'PowerPoint', icon: '/images/powerpoint_icon.svg' },
  pdf:  { name: 'PDF',        icon: '/images/pdf_icon.svg' },
};
const FALLBACK_ICON = '/images/file_icon.svg';

// Astro hands rehype plugins raw HTML as text, so match the link in that form:
// either one raw node (<a …>label</a>) or an opening tag, text, closing tag.
const WHOLE = /^\s*<a\s([^>]*\bclass="file-download"[^>]*)>([\s\S]*?)<\/a>\s*$/;
const OPEN  = /^\s*<a\s([^>]*\bclass="file-download"[^>]*)>\s*$/;
const CLOSE = /^\s*<\/a>\s*$/;

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', middot: '·' };
function decode(s) {
  return s.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (m, e) =>
    e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : +e.slice(1))
                 : ENTITIES[e] ?? m);
}
const textOf = node => node.type === 'text' ? node.value : (node.children ?? []).map(textOf).join('');

// Decimal units, as macOS Finder shows them
function formatSize(bytes) {
  if (bytes < 1e6) return `${Math.max(1, Math.round(bytes / 1e3))} KB`;
  return `${(bytes / 1e6).toFixed(1)} MB`;
}

const el = (tagName, properties, children = []) => ({ type: 'element', tagName, properties, children });

function card(attrs, label, file) {
  const href = decode(attrs.match(/\bhref="([^"]*)"/)?.[1] ?? '');
  if (!href) throw new Error(`file-download: link "${label}" has no href`);
  const name = decodeURIComponent(href.split(/[?#]/)[0].split('/').pop());
  const ext = name.includes('.') ? name.split('.').pop().toLowerCase() : '';
  const type = FILE_TYPES[ext];

  const meta = [name, type?.name ?? ext.toUpperCase()];
  if (href.startsWith('/')) {
    let size;
    try { size = statSync(PUBLIC + decodeURIComponent(href.slice(1).split(/[?#]/)[0])).size; }
    catch { throw new Error(`file-download: ${href} (in ${file ?? 'a Markdown page'}) is not in site/public`); }
    meta.push(formatSize(size));
  }

  return el('a', { className: ['file-download', ext && `file-download--${ext}`].filter(Boolean), href, download: true }, [
    el('img', { src: type?.icon ?? FALLBACK_ICON, alt: '', ariaHidden: 'true', className: ['file-download-icon'] }),
    el('span', { className: ['file-download-text'] }, [
      el('span', { className: ['file-download-label'] }, [{ type: 'text', value: label.trim() }]),
      el('span', { className: ['file-download-meta'] }, [{ type: 'text', value: meta.filter(Boolean).join(' · ') }]),
    ]),
    el('span', { className: ['file-download-arrow'], ariaHidden: 'true' }, [{ type: 'text', value: '↓' }]),
  ]);
}

function transform(parent, file) {
  const kids = parent.children;
  if (!kids) return;
  for (let i = 0; i < kids.length; i++) {
    const node = kids[i];
    if (node.type !== 'raw') { transform(node, file); continue; }
    let m = node.value.match(WHOLE);
    if (m) {
      kids[i] = card(m[1], decode(m[2].replace(/<[^>]*>/g, '')), file);
      continue;
    }
    m = node.value.match(OPEN);
    if (!m) continue;
    const end = kids.findIndex((k, j) => j > i && k.type === 'raw' && CLOSE.test(k.value));
    if (end === -1) continue;
    const label = kids.slice(i + 1, end).map(textOf).join('');
    kids.splice(i, end - i + 1, card(m[1], label, file));
  }
}

// A card alone on its line arrives wrapped in <p>: unwrap it, so it sits in
// the flow like a block (and the slide viewer can find it as a sibling).
function unwrap(parent) {
  (parent.children ?? []).forEach((node, i) => {
    if (node.tagName === 'p') {
      const real = node.children.filter(k => !(k.type === 'text' && !k.value.trim()));
      if (real.length === 1 && real[0].properties?.className?.includes('file-download')) {
        parent.children[i] = real[0];
        return;
      }
    }
    unwrap(node);
  });
}

export default function rehypeFileDownload() {
  return (tree, vfile) => {
    transform(tree, vfile?.path);
    unwrap(tree);
  };
}
