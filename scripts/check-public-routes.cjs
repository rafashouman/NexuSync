/* eslint-disable @typescript-eslint/no-require-imports */
// Read-only smoke check. Never submits forms or contacts the product apps.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function data(file) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText, { exports });
  return exports;
}
const { siteNavigation } = data('src/data/siteNavigation.ts');
const { templateCatalog } = data('src/data/templateCatalog.ts');
const { appCatalog } = data('src/data/appCatalog.ts');
const paths = new Set(['/', '/privacidade', ...siteNavigation.flatMap(g => g.links.map(([, href]) => href)),
  ...templateCatalog.map(item => item.href), ...appCatalog.map(item => item.path)]);
const origin = process.argv[2] || 'http://localhost:3000';
(async () => {
  for (const path of paths) {
    const url = new URL(path, origin);
    const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
    assert.equal(response.status, 200, `${path}: HTTP ${response.status}`);
    const html = await response.text();
    assert.match(html, /<h1[\s>]/, `${path}: missing h1`);
    assert.match(html, /<title>[^<]+<\/title>/, `${path}: missing title`);
    if (url.hash) assert.ok(html.includes(`id="${url.hash.slice(1)}"`), `${path}: missing anchor`);
    console.log(`OK ${path}`);
  }
  for (const path of ['/sitemap.xml', '/robots.txt']) {
    const response = await fetch(new URL(path, origin));
    assert.equal(response.status, 200, path);
    const body = await response.text();
    assert.ok(body.includes(path === '/sitemap.xml' ? 'https://nexusync.online/arcsync' : 'sitemap.xml'), path);
    console.log(`OK ${path}`);
  }
  console.log(`Passed: ${paths.size} public destinations, titles, headings, anchors, sitemap and robots.`);
})().catch(error => { console.error(error.message); process.exitCode = 1; });
