// Capturas de cada sección (escritorio 1920x1080 y móvil 390x844) del build servido en :4180.
// Uso: node scripts/capturas.mjs antes|despues   → PAEC/screenshots/<etapa>/<vista>/NN-id.png
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const etapa = process.argv[2] ?? 'antes';
const here = path.dirname(fileURLToPath(import.meta.url));
const salida = path.resolve(here, '../../screenshots', etapa);
const URL = 'http://localhost:4180';

const vistas = [
  { nombre: 'escritorio', viewport: { width: 1920, height: 1080 } },
  { nombre: 'movil', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
];

const browser = await chromium.launch({ channel: 'msedge' });
const errores = [];
for (const v of vistas) {
  const ctx = await browser.newContext({ viewport: v.viewport, isMobile: v.isMobile, hasTouch: v.hasTouch, deviceScaleFactor: v.deviceScaleFactor });
  const page = await ctx.newPage();
  page.on('console', (m) => m.type() === 'error' && errores.push(`${v.nombre}: ${m.text()}`));
  page.on('pageerror', (e) => errores.push(`${v.nombre}: ${e}`));
  await page.goto(`${URL}/#1`);
  await page.waitForTimeout(1200);
  // Total de secciones: End lleva a la última.
  await page.keyboard.press('End');
  await page.waitForTimeout(300);
  const total = Number((await page.evaluate(() => location.hash)).slice(1));
  const dir = path.join(salida, v.nombre);
  fs.mkdirSync(dir, { recursive: true });
  for (let n = 1; n <= total; n++) {
    await page.evaluate((h) => (location.hash = h), `#${n}`);
    await page.waitForTimeout(2200);
    const titulo = await page.locator('main section h1, main section h2').first().textContent().catch(() => '');
    const id = (titulo ?? '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').slice(0, 40);
    await page.screenshot({ path: path.join(dir, `${String(n).padStart(2, '0')}-${id}.png`) });
  }
  console.log(`${v.nombre}: ${total} secciones`);
  await ctx.close();
}
await browser.close();
console.log(errores.length ? `ERRORES:\n${errores.join('\n')}` : 'Consola: 0 errores');
