/**
 * slide-viewer.ts — an "Open live" button that reveals a .pptx from
 * /public/slides in Microsoft's Office Online viewer, with Expand
 * (fullscreen). Closed by default; nothing loads from Microsoft until opened.
 *
 * Usage in any Markdown page (ideally straight after its .slide-download link,
 * which the button then sits beside):
 *   <div class="slide-viewer" data-pptx="/slides/tts-day1-death-by-powerpoint.pptx"
 *        data-title="Day 1 deck"></div>
 *
 * Microsoft fetches the file itself, so it always points at the live site:
 * a new deck only previews once it has been deployed. Transitions and
 * animations are rendered by PowerPoint for the web.
 */

const SITE = 'https://teaching-that-sticks.github.io';
let count = 0;

function viewerUrl(pptx: string) {
  return 'https://view.officeapps.live.com/op/embed.aspx?src=' +
    encodeURIComponent(new URL(pptx, SITE).href);
}

function build(el: HTMLElement) {
  const pptx = el.dataset.pptx;
  if (!pptx || el.dataset.ready) return;
  el.dataset.ready = 'true';
  el.id ||= `slide-viewer-${++count}`;
  const url = viewerUrl(pptx);

  // The toggle, styled like the download link and placed beside it
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'slide-download slide-live-toggle';
  toggle.dataset.slideViewerToggle = el.id;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', el.id);
  toggle.innerHTML = `
    <svg class="slide-download-icon slide-live-icon" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="currentColor"/>
      <path d="M13 10.5v11l9-5.5z" fill="var(--base)"/>
    </svg>
    <span class="slide-download-text">
      <span class="slide-download-label">Open live</span>
      <span class="slide-download-meta">Click through in the browser</span>
    </span>
    <span class="slide-download-arrow slide-live-chevron" aria-hidden="true">&#x25BE;</span>`;

  const prev = el.previousElementSibling;
  if (prev?.classList.contains('slide-download')) {
    const row = document.createElement('div');
    row.className = 'slide-actions';
    prev.before(row);
    row.append(prev, toggle);
  } else {
    el.before(toggle);
  }

  el.innerHTML = `
    <div class="slide-viewer-clip">
      <div class="slide-viewer-panel" data-src="${url}">
        <div class="slide-viewer-stage">
          <span class="slide-viewer-loading">Loading slides&hellip;</span>
        </div>
        <div class="slide-viewer-bar">
          <span class="slide-viewer-hint" aria-live="polite">Click the slide to use the arrow keys</span>
          <span class="slide-viewer-actions">
            <a class="slide-viewer-btn" href="${url}" target="_blank" rel="noopener noreferrer">New tab&nbsp;&#x2197;</a>
            <button type="button" class="slide-viewer-btn slide-viewer-btn--primary"
                    data-slide-viewer-expand aria-pressed="false">&#x2922;&nbsp;Expand</button>
          </span>
        </div>
      </div>
    </div>`;
}

// The deck runs in a cross-site frame, so the page can't pass key presses into it.
// Arrow keys only work while the frame has focus: give it focus when it matters,
// and keep the hint (and a focus ring) honest about whether the keys will work.
const HINT_OFF = 'Click the slide to use the arrow keys';
const HINT_ON = '← → to change slides';

function focusFrame(panel: HTMLElement) {
  const iframe = panel.querySelector<HTMLIFrameElement>('iframe');
  if (!iframe) return;
  iframe.focus({ preventScroll: true });
  try { iframe.contentWindow?.focus(); } catch { /* cross-site: iframe.focus() is enough */ }
  setTimeout(updateHints, 0);
}

function updateHints() {
  const active = document.activeElement;
  document.querySelectorAll<HTMLElement>('.slide-viewer-panel').forEach(panel => {
    const focused = !!active && active === panel.querySelector('iframe');
    panel.classList.toggle('has-focus', focused);
    const hint = panel.querySelector('.slide-viewer-hint');
    if (hint) hint.textContent = focused ? HINT_ON : HINT_OFF;
  });
}

function setOpen(el: HTMLElement, toggle: HTMLElement, open: boolean) {
  const panel = el.querySelector<HTMLElement>('.slide-viewer-panel');
  if (open && panel && !panel.querySelector('iframe')) {
    const iframe = document.createElement('iframe');
    iframe.src = panel.dataset.src!;
    iframe.title = `${el.dataset.title || 'Slide deck'} (PowerPoint viewer)`;
    iframe.allowFullscreen = true;
    iframe.addEventListener('load', () => {
      panel.classList.add('is-loaded');
      if (el.classList.contains('is-open')) focusFrame(panel);
    }, { once: true });
    panel.querySelector('.slide-viewer-stage')!.appendChild(iframe);
  }
  el.classList.toggle('is-open', open);
  if (open && panel?.classList.contains('is-loaded')) focusFrame(panel);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.querySelector('.slide-download-label')!.textContent = open ? 'Hide live view' : 'Open live';
}

function setExpanded(panel: HTMLElement, on: boolean) {
  panel.classList.toggle('is-expanded', on);
  if (on) focusFrame(panel);
  document.documentElement.classList.toggle('slide-viewer-open', on);
  const btn = panel.querySelector<HTMLButtonElement>('[data-slide-viewer-expand]');
  if (btn) {
    btn.setAttribute('aria-pressed', String(on));
    btn.innerHTML = on ? '&#x2715;&nbsp;Close' : '&#x2922;&nbsp;Expand';
  }
}

function toggleExpanded(panel: HTMLElement) {
  if (panel.classList.contains('is-expanded')) {
    if (document.fullscreenElement) document.exitFullscreen();
    else setExpanded(panel, false);
    return;
  }
  // Real fullscreen where supported; otherwise (e.g. iPhone) fill the window.
  if (panel.requestFullscreen) {
    panel.requestFullscreen().then(() => setExpanded(panel, true), () => setExpanded(panel, true));
  } else {
    setExpanded(panel, true);
  }
}

export function initSlideViewers() {
  document.querySelectorAll<HTMLElement>('.slide-viewer[data-pptx]').forEach(build);
}

// Delegated, so it survives pages that clone their content into cards.
document.addEventListener('click', e => {
  const target = e.target as Element;
  const toggle = target.closest?.<HTMLElement>('[data-slide-viewer-toggle]');
  if (toggle) {
    const el = document.getElementById(toggle.dataset.slideViewerToggle!);
    if (el) setOpen(el, toggle, !el.classList.contains('is-open'));
    return;
  }
  const panel = target.closest?.('[data-slide-viewer-expand]')?.closest<HTMLElement>('.slide-viewer-panel');
  if (panel) { toggleExpanded(panel); return; }
  const bar = target.closest?.('.slide-viewer-bar');
  if (bar && !target.closest('a, button')) focusFrame(bar.closest<HTMLElement>('.slide-viewer-panel')!);
});

document.addEventListener('fullscreenchange', () => {
  document.querySelectorAll<HTMLElement>('.slide-viewer-panel.is-expanded').forEach(panel => {
    if (document.fullscreenElement !== panel) setExpanded(panel, false);
  });
});

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape' || document.fullscreenElement) return;
  document.querySelectorAll<HTMLElement>('.slide-viewer-panel.is-expanded').forEach(p => setExpanded(p, false));
});

// Focus moving into the frame blurs the page window; moving back fires focusin.
window.addEventListener('blur', () => setTimeout(updateHints, 0));
window.addEventListener('focus', updateHints);
document.addEventListener('focusin', updateHints);
document.addEventListener('focusout', () => setTimeout(updateHints, 0));
// Clicking plain page text moves focus to <body> without a focusin, so re-check after any click.
document.addEventListener('pointerdown', () => setTimeout(updateHints, 0));
