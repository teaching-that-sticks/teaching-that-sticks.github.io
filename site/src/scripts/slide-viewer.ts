/**
 * slide-viewer.ts — embeds a .pptx from /public/slides in Microsoft's
 * Office Online viewer, with an Expand (fullscreen) button.
 *
 * Usage in any Markdown page:
 *   <div class="slide-viewer" data-pptx="/slides/death_by_powerpoint.pptx"
 *        data-title="Pilot theory slides"></div>
 *
 * Microsoft fetches the file itself, so it always points at the live site:
 * a new deck only previews once it has been deployed. Transitions and
 * animations are rendered by PowerPoint for the web.
 */

const SITE = 'https://teaching-that-sticks.github.io';

function viewerUrl(pptx: string) {
  return 'https://view.officeapps.live.com/op/embed.aspx?src=' +
    encodeURIComponent(new URL(pptx, SITE).href);
}

function build(el: HTMLElement) {
  const pptx = el.dataset.pptx;
  if (!pptx || el.dataset.ready) return;
  el.dataset.ready = 'true';
  const title = el.dataset.title || 'Slide deck';
  const url = viewerUrl(pptx);

  el.innerHTML = `
    <div class="slide-viewer-stage">
      <iframe src="${url}" title="${title} (PowerPoint viewer)"
              loading="lazy" allowfullscreen></iframe>
    </div>
    <div class="slide-viewer-bar">
      <span class="slide-viewer-hint">Click the slide or use the arrow keys to advance</span>
      <span class="slide-viewer-actions">
        <a class="slide-viewer-btn" href="${url}" target="_blank" rel="noopener noreferrer">New tab&nbsp;&#x2197;</a>
        <button type="button" class="slide-viewer-btn slide-viewer-btn--primary"
                data-slide-viewer-expand aria-pressed="false">&#x2922;&nbsp;Expand</button>
      </span>
    </div>`;
}

function setExpanded(el: HTMLElement, on: boolean) {
  el.classList.toggle('is-expanded', on);
  document.documentElement.classList.toggle('slide-viewer-open', on);
  const btn = el.querySelector<HTMLButtonElement>('[data-slide-viewer-expand]');
  if (btn) {
    btn.setAttribute('aria-pressed', String(on));
    btn.innerHTML = on ? '&#x2715;&nbsp;Close' : '&#x2922;&nbsp;Expand';
  }
}

function toggle(el: HTMLElement) {
  const isOpen = el.classList.contains('is-expanded');
  if (isOpen) {
    if (document.fullscreenElement) document.exitFullscreen();
    else setExpanded(el, false);
    return;
  }
  // Real fullscreen where supported; otherwise (e.g. iPhone) fill the window.
  if (el.requestFullscreen) {
    el.requestFullscreen().then(() => setExpanded(el, true), () => setExpanded(el, true));
  } else {
    setExpanded(el, true);
  }
}

export function initSlideViewers() {
  document.querySelectorAll<HTMLElement>('.slide-viewer[data-pptx]').forEach(build);
}

// Delegated, so it survives pages that clone their content into cards.
document.addEventListener('click', e => {
  const btn = (e.target as Element).closest?.('[data-slide-viewer-expand]');
  const el = btn?.closest<HTMLElement>('.slide-viewer');
  if (el) toggle(el);
});

document.addEventListener('fullscreenchange', () => {
  document.querySelectorAll<HTMLElement>('.slide-viewer.is-expanded').forEach(el => {
    if (document.fullscreenElement !== el) setExpanded(el, false);
  });
});

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape' || document.fullscreenElement) return;
  document.querySelectorAll<HTMLElement>('.slide-viewer.is-expanded').forEach(el => setExpanded(el, false));
});
