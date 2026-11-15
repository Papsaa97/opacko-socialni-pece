import { existsSync, renameSync, unlinkSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const exportDir = resolve(process.cwd(), 'export');
const srcHtml = resolve(exportDir, 'index.html');
const destHtml = resolve(exportDir, 'Opacko-Socialni-Pece.html');

if (!existsSync(srcHtml)) {
  console.error('Expected export/index.html was not generated.');
  process.exit(1);
}

// Strip external PWA links in standalone HTML so offline file:// opens cleanly with zero 404 console noise
let html = readFileSync(srcHtml, 'utf8');
html = html.replace(/<link[^>]*rel=["']manifest["'][^>]*>\s*/gi, '');
html = html.replace(/<link[^>]*rel=["']apple-touch-icon["'][^>]*>\s*/gi, '');
writeFileSync(srcHtml, html, 'utf8');

if (existsSync(destHtml)) {
  unlinkSync(destHtml);
}
renameSync(srcHtml, destHtml);
console.log('Generated standalone offline study app:', destHtml);
