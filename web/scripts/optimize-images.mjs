// Convierte los renders de /Contenido a WebP en src/assets.
// Los originales no se modifican. Los PNG ya traen fondo transparente.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(root, '../../Contenido');
const out = path.resolve(root, '../src/assets');
await mkdir(out, { recursive: true });

const MAX = 1920;
const webp = { quality: 90, alphaQuality: 100, effort: 6 };

async function convert(file, name, extract) {
  let img = sharp(path.join(src, file));
  if (extract) img = img.extract(extract);
  await img
    .resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
    .webp(webp)
    .toFile(path.join(out, `${name}.webp`));
  console.log('✓', name);
}

await convert('prototipo-completo-isometrica.png', 'isometrica');
await convert('prototipo-completo-explosionada.png', 'explosionada');

// Vistas técnicas: una sola imagen con tres vistas. Recortes con 8 px de margen,
// calculados a partir de las zonas no transparentes del original (578×431).
const pad = 8;
const box = (x0, x1, y0, y1) => ({
  left: x0 - pad,
  top: y0 - pad,
  width: x1 - x0 + 1 + pad * 2,
  height: y1 - y0 + 1 + pad * 2,
});
const vistas = 'vistas-frontal-superior-lateral.png';
await convert(vistas, 'vista-superior', box(27, 138, 269, 384));
await convert(vistas, 'vista-frontal', box(193, 315, 39, 373));
await convert(vistas, 'vista-lateral', box(395, 519, 39, 373));

// Bocetos (fondo blanco, se muestran completos con object-contain).
// Se recorta solo el margen blanco sobrante y se deja un borde blanco parejo de 32 px.
async function boceto(file, name) {
  const recortado = await sharp(path.join(src, file)).flatten({ background: '#ffffff' }).trim({ background: '#ffffff', threshold: 24 }).toBuffer();
  await sharp(recortado)
    .extend({ top: 32, bottom: 32, left: 32, right: 32, background: '#ffffff' })
    .resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
    .webp(webp)
    .toFile(path.join(out, name + ".webp"));
  console.log('✓', name);
}
await boceto('Sistema - Boceto.png', 'boceto-sistema');
await boceto('filtro - Boceto.jpg', 'boceto-filtro');
