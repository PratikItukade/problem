import { defineConfig } from 'vite';

// Relative asset paths allow the built site to work from a GitHub Pages
// project URL (https://<owner>.github.io/<repository>/) as well as a custom domain.
export default defineConfig({
  base: './'
});
