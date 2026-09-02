import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { existsSync, writeFileSync } from 'node:fs';
import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';

const DEFAULT_SITE_URL = 'https://minhnhatdepzai.github.io/profolio';

function deploymentMetadata(siteUrl: string): Plugin {
  return {
    name: 'deployment-metadata',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replaceAll('%SITE_URL%', siteUrl),
    },
    closeBundle() {
      const outputDirectory = path.resolve(__dirname, 'dist');

      if (!existsSync(outputDirectory)) return;

      writeFileSync(
        path.join(outputDirectory, 'robots.txt'),
        `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      );
      writeFileSync(
        path.join(outputDirectory, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${siteUrl}/</loc>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`,
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = (env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '');

  return {
    base: env.VITE_BASE_PATH || '/',
    plugins: [react(), tailwindcss(), deploymentMetadata(siteUrl)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
          },
        },
      },
    },
  };
});
