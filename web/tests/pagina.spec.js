import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const CONTENIDO = path.resolve(here, '../../Contenido');
const CAPTURAS = path.resolve(here, '../../capturas');

// Secciones según src/content/sections.js (id → número de diapositiva).
const SECCIONES = ['portada', 'paec', 'problema', 'objetivos', 'bocetos', 'diseno', 'anatomia', 'filtro', 'detector', 'diagramas', 'costos', 'solucion', 'demo', 'resultados', 'esperados', 'aprendizajes', 'mejoras', 'conclusion', 'drybot'];
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
  test.setTimeout(180_000);
  await page.goto('/#1');
  await espera(page, 800);
  // Con las notas del presentador abiertas (N), se recorre cada paso de cada sección con →
  // y se junta el texto de la página y de las notas.
  await page.keyboard.press('n');
  let texto = '';
  for (let n = 1; n <= SECCIONES.length; n++) {
    await irA(page, n);
    for (let paso = 0; paso < 12; paso++) {
      texto += ' ' + (await page.locator('body').textContent());
      if (n === SECCIONES.length) break;
      await page.keyboard.press('ArrowRight');
      await espera(page, 350);
      if ((await page.evaluate(() => location.hash)) !== `#${n}`) break;
    }
  }
  // Datos que se integraron (notas.md, filtro.jpg, inventario_y_costos.md).
  const esperados = [
    'The Crows', 'Mateo Fregoso', 'Erick Pimentel', 'Dr. Magdiel Almeida Zamora', '23 de noviembre de 2026', 'Instala sistemas neumáticos, hidráulicos y electrohidráulicos', 'Proyecto Aula-Escuela-Comunidad', 'Disminuir radicalmente el desperdicio desmedido de agua en el plantel', 'Fugas no detectadas en tuberías y bebederos', 'Falta de datos para medir el consumo de agua', '3AMM', 'CBTis 40', 'Poco mantenimiento a las zonas verdes',
    'en tierra seca y húmeda', 'Revisar el filtro', 'Cómo observar una situación',
    'Condensado de AC', 'Grava Caliza', 'Tezontle', 'Balde hermético (~19 L)',
    'Mini bomba de agua sumergible 5V', 'Módulo de relé de doble canal 5V', 'Pantalla OLED de 0.96 pulgadas',
  ];
  // Datos de "Datos para la Fase 3" y "Datos técnicos pendientes" (notas.md). Se redactaron con
  // ortografía corregida, así que se verifica cada dato clave en lugar del texto literal.
  esperados.push(
    // Proceso de armado
    'Simulamos todo en digital', 'mayormente de gases', 'Ensamblamos todo lo físico',
    // Pruebas y resultados
    'durante 2 días', 'plagas y mosquitos', 'la pantalla reflejó los resultados', 'pH entre 8 y 9', 'agua estancada muy sucia',
    'Miguel Ángel Fregoso', 'Thelma Minerva Gallardo', 'plantas desaladoras', '¡Es ideal para mis macetas!', 'conocidos y familiares cercanos',
    // Problemas y soluciones, mejoras
    'riego desmedido', 'mayormente de gases', 'filtra el agua de los aires acondicionados', 'adecuado en su totalidad para exteriores', 'lluvias, vientos, composta',
    // Datos técnicos
    'alimenta el sistema electrónico', 'rojo o amarillo', 'ahorrar batería', 'MDF barnizado, aluminio y polímero de alta densidad',
    'estados de sequía', 'relevador', 'batería de 5', 'toma el agua del filtro', 'carbonato de calcio', 'piedra pómez',
    'silicio, óxido de hierro, aluminio y calcio', 'bajo 15', 'notificación al teléfono',
    'Arboleda en los andenes', 'canchas de fútbol y básquetbol', 'Casi nulo',
    // notas.md, ACTUALIZAR (diapositivas 3, 10, 14, 15 y 18)
    'DRYBOT', 'Validado por usuarios', 'corriendo por las calles donde caminan todos los días nuestras familias e hijos',
    'GPIO25', 'GPIO21 SDA', 'Batería externa', 'Tubo de succión', 'Manguera de descarga', 'medidas por confirmar',
    'sin plagas, sin mosquitos ni impurezas', 'mínimo 730 ml', 'No son mediciones de nuestro filtro',
    'Distingue entre quienes actúan por iniciativa propia', 'Friedrich Nietzsche',
  );
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

test('imágenes nuevas: cargan sin 404, con alt, lazy y sin deformarse', async ({ page }) => {
  const fallas = [];
  page.on('response', (r) => r.status() >= 400 && fallas.push(r.url()));
  for (const n of [SECCIONES.indexOf('resultados') + 1, SECCIONES.indexOf('esperados') + 1]) {
    await page.goto(`/#${n}`);
    await espera(page, 1500);
    const img = page.locator('button[aria-label^="Ampliar imagen"] img').first();
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((i) => i.complete && i.naturalWidth > 0), { timeout: 5000 }).toBe(true);
    const d = await img.evaluate((i) => ({ alt: i.alt, lazy: i.loading, nat: i.naturalWidth / i.naturalHeight, box: i.getBoundingClientRect().width / i.getBoundingClientRect().height }));
    expect(d.alt.length).toBeGreaterThan(20);
    expect(d.lazy).toBe('lazy');
    expect(Math.abs(d.box - d.nat)).toBeLessThan(0.05);
    // Se amplía sin recortarse y se cierra con Esc.
    await page.locator('button[aria-label^="Ampliar imagen"]').first().click();
    const dialogo = page.getByRole('dialog');
    await expect(dialogo).toBeVisible();
    await espera(page, 600);
    const r = await dialogo.boundingBox();
    const vp = page.viewportSize();
    expect(r.width).toBeLessThanOrEqual(vp.width + 1);
    expect(r.height).toBeLessThanOrEqual(vp.height + 1);
    await page.keyboard.press('Escape');
    await expect(dialogo).toHaveCount(0);
    expect(await page.evaluate(() => location.hash)).toBe(`#${n}`);
  }
  expect(fallas).toEqual([]);
});

test('DRYBOT (19): navegación, texto accesible, efecto al mover el puntero y pausa en reposo', async ({ page }, info) => {
  const errores = vigilarErrores(page);
  const n = SECCIONES.indexOf('drybot') + 1;
  await page.goto(`/#${n - 1}`);
  await espera(page, 900);
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => page.evaluate(() => location.hash)).toBe(`#${n}`);
  // La palabra existe en el DOM aunque se dibuje en canvas.
  await expect(page.locator('main h2', { hasText: 'DRYBOT' })).toHaveCount(1);
  const modo = await page.getByTestId('drybot').getAttribute('data-modo');
  expect(['gl', 'svg']).toContain(modo);
  if (modo === 'gl') {
    const canvas = page.getByTestId('drybot-canvas');
    await expect.poll(() => canvas.getAttribute('data-intro'), { timeout: 5000 }).toBe('1.00');
    if (info.project.name !== 'movil') {
      const antes = Number(await canvas.getAttribute('data-cuadros'));
      const vp = page.viewportSize();
      for (let i = 0; i <= 10; i++) {
        await page.mouse.move(vp.width * (0.2 + i * 0.06), vp.height / 2);
        await espera(page, 16);
      }
      await expect(canvas).toHaveAttribute('data-estado', 'activo');
      expect(Number(await canvas.getAttribute('data-cuadros'))).toBeGreaterThan(antes);
    }
    // Sin movimiento, el render se pausa.
    await expect(canvas).toHaveAttribute('data-estado', 'pausado', { timeout: 8000 });
  }
  // Al regresar, la diapositiva se desmonta (recursos liberados) y la 18 sigue bien.
  await page.keyboard.press('ArrowLeft');
  await expect.poll(() => page.evaluate(() => location.hash)).toBe(`#${n - 1}`);
  await espera(page, 600);
  await expect(page.getByTestId('drybot-canvas')).toHaveCount(0);
  await expect(page.locator('main')).toContainText('¿Preguntas?');
  expect(errores).toEqual([]);
});
