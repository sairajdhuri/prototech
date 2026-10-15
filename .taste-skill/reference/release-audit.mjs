import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd());
assert.ok(!process.env.RESEND_API_KEY || !process.env.MAIL_FROM, 'This local audit requires unconfigured email to avoid sending a real message.');
const origin = 'http://127.0.0.1:3105';
const routes = ['/', '/about', '/capabilities', '/machinery', '/products', '/customers', '/contact', '/quote', '/privacy', '/terms', '/credits'];
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const report = { pages: [], errors: [], warnings: [], links: [], api: [] };
const links = new Set();
try {
  for (const reducedMotion of ['no-preference', 'reduce']) {
    const context = await browser.newContext({ reducedMotion });
    const page = await context.newPage();
    let current;
    page.on('pageerror', error => report.errors.push({ route: current, reducedMotion, message: error.message }));
    page.on('console', message => {
      if (['error', 'warning'].includes(message.type())) report.warnings.push({ route: current, reducedMotion, type: message.type(), message: message.text().slice(0, 2000) });
    });
    for (const route of reducedMotion === 'reduce' ? ['/', '/capabilities'] : routes) {
      current = route;
      const response = await page.goto(origin + route);
      assert.equal(response.status(), 200);
      const headers = response.headers();
      assert.equal(headers['x-content-type-options'], 'nosniff');
      assert.equal(headers['x-frame-options'], 'DENY');
      assert.equal(headers['referrer-policy'], 'strict-origin-when-cross-origin');
      assert.ok(headers['permissions-policy']);
      await page.waitForTimeout(1800);
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 800) {
          window.scrollTo({ top: y, behavior: 'instant' });
          await new Promise(resolve => setTimeout(resolve, 60));
        }
      });
      await page.waitForTimeout(500);
      const data = await page.evaluate(() => {
        const ids = [...document.querySelectorAll('[id]')].map(element => element.id);
        return {
          duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index),
          missingAlts: [...document.images].filter(image => !image.hasAttribute('alt')).map(image => image.src),
          brokenImages: [...document.images].filter(image => image.complete && !image.naturalWidth).map(image => image.src),
          links: [...document.querySelectorAll('a[href]')].map(link => link.href),
        };
      });
      assert.deepEqual(data.duplicateIds, [], route + ' duplicate IDs');
      assert.deepEqual(data.missingAlts, [], route + ' missing image alt');
      assert.deepEqual(data.brokenImages, [], route + ' broken images');
      data.links.filter(url => url.startsWith(origin)).forEach(url => links.add(url));
      report.pages.push({ route, reducedMotion, status: response.status(), ...data, links: data.links.length });
    }
    await context.close();
  }
  const context = await browser.newContext();
  for (const url of links) {
    const response = await context.request.get(url);
    report.links.push({ url, status: response.status() });
    assert.ok(response.ok(), `${url}: ${response.status()}`);
  }
  assert.equal((await context.request.get(origin + '/not-a-real-route')).status(), 404);
  for (const [name, options, expected] of [
    ['cross-origin', { headers: { Origin: 'https://untrusted.example' }, form: { kind: 'enquiry' } }, 403],
    ['unsupported content', { headers: { Origin: origin }, data: { kind: 'enquiry' } }, 415],
    ['invalid enquiry', { headers: { Origin: origin }, form: { kind: 'enquiry' } }, 422],
    ['unconfigured delivery', { headers: { Origin: origin }, form: { kind: 'enquiry', fullName: 'Release Check', email: 'release@example.com', company: '', phone: '', requirements: 'Local release validation only.', website: '' } }, 503],
  ]) {
    const response = await context.request.post(origin + '/api/submissions', options);
    report.api.push({ name, status: response.status() });
    assert.equal(response.status(), expected, name);
    assert.equal(response.headers()['cache-control'], 'no-store');
  }
  await context.close();
  assert.deepEqual(report.errors, [], 'uncaught browser errors');
} finally {
  await browser.close();
  await writeFile(new URL('./release-audit.json', import.meta.url), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ pages: report.pages.length, links: report.links.length, api: report.api, errors: report.errors, warnings: report.warnings }, null, 2));
}
