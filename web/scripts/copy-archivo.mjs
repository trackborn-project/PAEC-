// Copia el HTML de un solo archivo a la raíz de PAEC como Presentacion.html.
import { copyFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const from = path.resolve(root, '../dist-archivo/index.html');
const to = path.resolve(root, '../../Presentacion.html');

await copyFile(from, to);
const { size } = await stat(to);
console.log(`✓ ${to} (${(size / 1024 / 1024).toFixed(2)} MB)`);
