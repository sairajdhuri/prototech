import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const label = process.argv[2] || 'baseline';
const baseURL = process.argv[3] || 'http://127.0.0.1:3103';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 2 });
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Performance.enable');
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.addInitScript(() => {
      window.__draws = 0;
      const original = WebGL2RenderingContext.prototype.drawElements;
      WebGL2RenderingContext.prototype.drawElements = function (...args) { window.__draws++; return original.apply(this, args); };
      window.__longTasks = [];
      new PerformanceObserver(list => { window.__longTasks.push(...list.getEntries().map(entry => ({ start: entry.startTime, duration: entry.duration }))); }).observe({ type: 'longtask', buffered: true });
    });
    await page.goto(baseURL);
    await page.locator('.webgl-ready').waitFor({ timeout: 60000 });
    await page.waitForTimeout(1200);
    for (const phase of ['pcb', 'lower']) {
      const bounds = await page.evaluate(phase => phase === 'pcb' ? [0, document.querySelector('.pcb-chapter').offsetTop + 200] : [document.querySelector('.highlights').offsetTop, document.querySelector('.pcb-quote').offsetTop - innerHeight], phase);
      await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), bounds[0]);
      await page.waitForTimeout(1200);
      const before = await cdp.send('Performance.getMetrics');
      const sample = await page.evaluate(async ([start, end]) => {
        const gaps = [], initialDraws = window.__draws, initialTime = performance.now();
        let previous;
        for (let i = 0; i < 150; i++) {
          const now = await new Promise(requestAnimationFrame);
          if (previous !== undefined) gaps.push(now - previous);
          previous = now;
          scrollTo({ top: start + (end - start) * i / 149, behavior: 'instant' });
        }
        gaps.sort((a, b) => a - b);
        return { duration: performance.now() - initialTime, medianFrameMs: gaps[Math.floor(gaps.length * 0.5)], p95FrameMs: gaps[Math.floor(gaps.length * 0.95)], framesOver25ms: gaps.filter(gap => gap > 25).length, draws: window.__draws - initialDraws, longTasks: window.__longTasks.filter(task => task.start >= initialTime) };
      }, bounds);
      const after = await cdp.send('Performance.getMetrics');
      const deltas = Object.fromEntries(['ScriptDuration', 'LayoutDuration', 'LayoutCount', 'RecalcStyleDuration'].map(name => [name, after.metrics.find(m => m.name === name).value - before.metrics.find(m => m.name === name).value]));
      results.push({ width, phase, ...sample, ...deltas });
      console.log(JSON.stringify(results.at(-1)));
    }
    await page.close();
  }
  await fs.writeFile(`.taste-skill/reference/performance-${label}.json`, JSON.stringify(results, null, 2));
} finally { await browser.close(); }
