// Lee Contenido/inventario_y_costos.md tal cual (import ?raw) y extrae las tablas.
// Los totales NO se copian del archivo: se calculan aquí sumando las filas.
import raw from '../../../Contenido/inventario_y_costos.md?raw';

const money = (s) => Number(String(s).replace(/[^0-9.]/g, '')) || 0;

function parse(md) {
  const items = [];
  const notas = [];
  let categoria = null;
  for (const line of md.split(/\r?\n/)) {
    const h = line.match(/^##\s+(.+)$/);
    if (h) {
      const t = h[1].trim();
      categoria = /electr/i.test(t) ? { id: 'electronica', nombre: 'Electrónica', titulo: t } : /agua/i.test(t) ? { id: 'agua', nombre: 'Sistema de agua', titulo: t } : null;
      continue;
    }
    // Nota al pie: "\* Precio variable…" (un asterisco y un espacio; "**Total…" no cuenta).
    if (/^\\?\*\s/.test(line.trim())) notas.push(line.trim().replace(/^\\?\*\s*/, ''));
    const row = line.match(/^\|\s*(\d+)\s*\|(.+)\|$/);
    if (!row || !categoria) continue;
    const cells = row[2].split('|').map((c) => c.trim());
    const [componente, cantidad, unitario, total] = cells;
    items.push({
      n: Number(row[1]),
      componente,
      cantidad: Number(cantidad),
      unitario: money(unitario),
      total: money(total),
      variable: /\*/.test(unitario + total),
      categoria: categoria.id,
    });
  }
  const precios = (md.match(/^Precios en .+$/m) || [''])[0];
  return { items, notas, precios };
}

export const inventario = parse(raw);

export const CATEGORIAS = [
  { id: 'electronica', nombre: 'Electrónica', color: '#c4ccc9' },
  { id: 'agua', nombre: 'Sistema de agua', color: '#39ff88' },
];

export const sumar = (items) => items.reduce((s, i) => s + i.total, 0);

export const mxn = (v) => v.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 });
