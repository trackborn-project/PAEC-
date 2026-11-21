import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const CONTENIDO = path.resolve(here, '../../Contenido');
const CAPTURAS = path.resolve(here, '../../capturas');

// Secciones según src/content/sections.js (id → número de diapositiva).
const SECCIONES = ['portada', 'problema', 'solucion', 'diseno', 'anatomia', 'detector', 'filtro', 'demo', 'costos', 'resultados', 'aprendizajes', 'mejoras', 'conclusion'];
const N_FILTRO = SECCIONES.indexOf('filtro') + 1;
const N_COSTOS = SECCIONES.indexOf('costos') + 1;

// Piezas detectadas en Contenido/filtro.jpg (PASO 1), de arriba hacia abajo.
const PIEZAS = ['entrada', 'etapa1', 'etapa2', 'etapa3', 'balde', 'bomba'];
const ETIQUETAS = [
  'Entrada de agua',
  '(Condensado de AC)',
  'Etapa 1: Filtro de Malla y Carbón Activo',
  '(Microfiltrado)',
  'Etapa 2: Grava Caliza',
  '(Ajuste de pH)',
  'Etapa 3: Piedra Volcánica/Tezontle',
  '(Mineralización y Biología)',
  'Bomba de Agua',
  '(Para riego con ESP32)',
];

const espera = (page, ms) => page.waitForTimeout(ms);

async function irA(page, n) {
  await page.evaluate((h) => (location.hash = h), `#${n}`);
  await expect(page.locator('main > section')).toHaveCount(1, { timeout: 5000 });
  await espera(page, 900);
}

function vigilarErrores(page) {
  const errores = [];
  page.on('console', (m) => m.type() === 'error' && errores.push(m.text()));
  page.on('pageerror', (e) => errores.push(String(e)));
  return errores;
}

test.beforeEach(async ({ page }) => {
  // Animación según el sistema (sin forzar con la tecla M).
  await page.addInitScript(() => {
    try {
      localStorage.removeItem('paec-motion');
    } catch {}
  });
});

test('sin console.error en ninguna sección + capturas', async ({ page }, info) => {
  const errores = vigilarErrores(page);
  await page.goto('/#1');
  await espera(page, 1200);
  const dir = path.join(CAPTURAS, info.project.name);
  fs.mkdirSync(dir, { recursive: true });
  for (let n = 1; n <= SECCIONES.length; n++) {
    await irA(page, n);
    await espera(page, 900);
    await page.screenshot({ path: path.join(dir, `${String(n).padStart(2, '0')}-${SECCIONES[n - 1]}.png`) });
  }
  expect(errores).toEqual([]);
});

test.describe('despiece del filtro', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/#${N_FILTRO}`);
    await page.waitForFunction(() => window.despiece);
    await espera(page, 600);
  });

  test('todas las piezas y etiquetas de la imagen están en el DOM', async ({ page }) => {
    for (const id of PIEZAS) await expect(page.locator(`#pieza-${id}`)).toHaveCount(1);
    const texto = await page.locator('main').textContent();
    for (const e of ETIQUETAS) expect(texto).toContain(e);
    expect(await page.evaluate(() => window.despiece.totalEtapas)).toBe(9);
  });

  test('0% juntas, 100% separadas (con la rueda) y rearma al regresar', async ({ page }, info) => {
    const centros = () =>
      page.evaluate((ids) => ids.map((id) => {
        // Silueta visible de la pieza (sin capas ocultas como el agua o el pulso de la bomba).
        const g = document.querySelector(`#pieza-${id}`);
        const r = (g.querySelector('[data-cuerpo]') ?? g).getBoundingClientRect();
        return { top: r.top, bottom: r.bottom, cy: r.top + r.height / 2 };
      }), PIEZAS);

    const inicio = await centros();
    const panel = page.locator('[data-own-keys-wheel]');
    const box = await panel.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    if (info.project.name === 'movil') {
      // En táctil no hay rueda: se usa la API.
      await page.evaluate(() => window.despiece.irEtapa(8));
    } else {
      for (let i = 0; i < 8; i++) {
        await page.mouse.wheel(0, 120);
        await espera(page, 520);
      }
    }
    await expect.poll(() => page.evaluate(() => window.despiece.etapaActual())).toBe(8);
    await espera(page, 1200);
    const fin = await centros();

    // Juntas al inicio: cada embudo se mete en el siguiente (se traslapan).
    for (let i = 0; i < 4; i++) expect(inicio[i].bottom).toBeGreaterThan(inicio[i + 1].top + 10);
    // Separadas al final: la distancia vertical entre piezas crece y ya no se traslapan de más.
    const span = (a) => a[a.length - 1].cy - a[0].cy;
    expect(span(fin)).toBeGreaterThan(span(inicio) * 1.25);
    for (let i = 0; i < 4; i++) expect(fin[i].bottom).toBeLessThanOrEqual(fin[i + 1].top + 6);

    // Regresar rearma.
    await page.evaluate(() => window.despiece.irEtapa(0));
    await espera(page, 1200);
    const otraVez = await centros();
    for (let i = 0; i < PIEZAS.length; i++) expect(Math.abs(otraVez[i].cy - inicio[i].cy)).toBeLessThan(3);
  });

  test('←/→ cambian etapaActual y Reiniciar vuelve a 0', async ({ page }) => {
    await page.keyboard.press('ArrowRight');
    await expect.poll(() => page.evaluate(() => window.despiece.etapaActual())).toBe(1);
    await page.keyboard.press('ArrowRight');
    await expect.poll(() => page.evaluate(() => window.despiece.etapaActual())).toBe(2);
    await page.keyboard.press('ArrowLeft');
    await expect.poll(() => page.evaluate(() => window.despiece.etapaActual())).toBe(1);
    await page.evaluate(() => window.despiece.irEtapa(5));
    await page.getByTestId('reiniciar').click();
    await expect.poll(() => page.evaluate(() => window.despiece.etapaActual())).toBe(0);
  });

  test('pasos de ensamblado: clic → irEtapa correcto', async ({ page }) => {
    const pasos = page.locator('[data-paso]');
    await expect(pasos).toHaveCount(6);
    for (let i = 0; i < 6; i++) {
      const paso = pasos.nth(i);
      const etapa = Number(await paso.getAttribute('data-etapa'));
      await paso.click();
      await expect.poll(() => page.evaluate(() => window.despiece.etapaActual())).toBe(etapa);
    }
  });

  test('capturas de cada etapa', async ({ page }, info) => {
    const dir = path.join(CAPTURAS, info.project.name, 'despiece');
    fs.mkdirSync(dir, { recursive: true });
    for (let e = 0; e < 9; e++) {
      await page.evaluate((n) => window.despiece.irEtapa(n), e);
      await espera(page, e >= 7 ? 2600 : 1100);
      await page.screenshot({ path: path.join(dir, `etapa-${e}.png`) });
    }
  });
});

test('info nueva: los datos de notas.md, filtro.jpg e inventario aparecen en la página', async ({ page }) => {
  await page.goto('/#1');
  await espera(page, 800);
  let texto = '';
  for (let n = 1; n <= SECCIONES.length; n++) {
    await irA(page, n);
    texto += ' ' + (await page.locator('main').textContent());
  }
  // Datos que se integraron (notas.md, filtro.jpg, inventario_y_costos.md).
  const esperados = [
    'The crowns', '3AMM', 'CBTis 40', 'Poco mantenimiento a las zonas verdes',
    'Probar en tierra seca y húmeda', 'Revisar el filtro', 'Cómo observar una situación',
    'Condensado de AC', 'Grava Caliza', 'Tezontle', 'Balde hermético (~19 L)',
    'Mini bomba de agua sumergible 5V', 'Módulo de relé de doble canal 5V', 'Pantalla OLED de 0.96 pulgadas',
  ];
  // Además, cualquier dato llenado en "Datos para la Fase 3" / "Datos técnicos pendientes" de notas.md.
  const notas = fs.readFileSync(path.join(CONTENIDO, 'notas.md'), 'utf8');
  const bloque = notas.slice(notas.indexOf('## Datos para la Fase 3'));
  for (const linea of bloque.split(/\r?\n/)) {
    // Solo valores llenados: "- Etiqueta: valor" o "- valor" (las plantillas vacías se ignoran).
    const m = linea.match(/^\s*(?:-|\d+\.)\s*(.*)$/);
    if (!m) continue;
    const valor = (m[1].includes(':') ? m[1].slice(m[1].indexOf(':') + 1) : m[1]).trim();
    if (valor.length > 3 && !valor.startsWith('…')) esperados.push(valor);
  }
  const norm = (s) => s.replace(/\s+/g, ' ').toLowerCase();
  const plano = norm(texto);
  const faltan = esperados.filter((e) => !plano.includes(norm(e)));
  expect(faltan).toEqual([]);
});

test('costos: cada material del inventario aparece y el total = suma de datos', async ({ page }) => {
  await page.goto(`/#${N_COSTOS}`);
  await espera(page, 2200);
  const md = fs.readFileSync(path.join(CONTENIDO, 'inventario_y_costos.md'), 'utf8');
  const filas = [...md.matchAll(/^\|\s*(\d+)\s*\|(.+)\|$/gm)].map((m) => m[2].split('|').map((c) => c.trim()));
  expect(filas.length).toBeGreaterThan(0);
  const lista = await page.getByTestId('materiales').textContent();
  for (const [componente] of filas) expect(lista).toContain(componente);
  const suma = filas.reduce((s, f) => s + Number(f[3].replace(/[^0-9.]/g, '')), 0);
  const esperado = suma.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 });
  await expect(page.getByTestId('costo-total')).toHaveText(esperado, { timeout: 5000 });
});

test('estrellitas: se dibujan con el ratón; no existen en móvil', async ({ page }, info) => {
  await page.goto('/#1');
  await espera(page, 800);
  const canvas = page.getByTestId('estrellitas');
  if (info.project.name === 'movil') {
    await expect(canvas).toHaveCount(0);
    return;
  }
  await expect(canvas).toHaveCount(1);
  for (let i = 0; i < 12; i++) await page.mouse.move(300 + i * 30, 300 + i * 10);
  await espera(page, 50);
  const pintado = await canvas.evaluate((c) => {
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    for (let i = 3; i < d.length; i += 4) if (d[i] > 0) return true;
    return false;
  });
  expect(pintado).toBe(true);
});

test.describe('movimiento reducido', () => {
  test.use({ reducedMotion: 'reduce' });

  test('todo visible sin animar; sin estrellitas', async ({ page }) => {
    await page.goto('/#1');
    await espera(page, 900);
    await expect(page.getByTestId('estrellitas')).toHaveCount(0);
    for (const n of [1, N_FILTRO, N_COSTOS, SECCIONES.length]) {
      await irA(page, n);
      const titulo = page.locator('main section h1, main section h2').first();
      await expect(titulo).toBeVisible();
      expect(Number(await titulo.evaluate((el) => getComputedStyle(el).opacity))).toBeGreaterThan(0.99);
    }
    // El despiece salta a la etapa sin transición.
    await irA(page, N_FILTRO);
    const t0 = Date.now();
    await page.evaluate(() => window.despiece.irEtapa(6));
    expect(Date.now() - t0).toBeLessThan(400);
  });
});
