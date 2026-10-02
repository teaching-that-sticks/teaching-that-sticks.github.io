// @ts-check
import { defineConfig } from 'astro/config';
import rehypeFileDownload from './plugins/rehype-file-download.mjs';

// https://astro.build/config
export default defineConfig({
  // Set this to your GitHub Pages repo name, e.g. '/teaching-that-sticks'
  // Leave as '' (root) if using a custom domain or user/org pages site
  base: '',
  site: 'https://teaching-that-sticks.github.io',
  output: 'static',
  markdown: {
    // <a class="file-download" href="/slides/…">Label</a> → download card
    rehypePlugins: [rehypeFileDownload],
  },
});
