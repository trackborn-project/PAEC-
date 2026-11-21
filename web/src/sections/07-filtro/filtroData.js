// Piezas del filtro según Contenido/filtro.jpg, de arriba hacia abajo.
// Las etiquetas son las mismas de la imagen. El balde no tiene etiqueta en la imagen:
// su nombre sale de inventario_y_costos.md (#16). La bomba se describe con la etiqueta
// de la imagen y el inventario (#15).

export const VB = { w: 1240, h: 1240 };
export const CX = 300; // eje vertical del filtro
export const LABEL_X = 470; // columna de etiquetas

export const PIEZAS = [
  {
    id: 'entrada',
    corto: 'el embudo de entrada',
    kind: 'embudo',
    titulo: 'Entrada de agua',
    sub: '(Condensado de AC)',
    tip: 'Embudo por donde entra el agua: el condensado del aire acondicionado.',
    armado: 170,
    separado: 40,
  },
  {
    id: 'etapa1',
    corto: 'la etapa 1 (malla y carbón)',
    kind: 'malla',
    titulo: 'Etapa 1: Filtro de Malla y Carbón Activo',
    sub: '(Microfiltrado)',
    tip: 'Primera etapa: filtra impurezas como tierra, insectos, piedras o pedacería; un cartucho de carbón activado elimina malos olores, residuos químicos, hongos y bacterias.',
    armado: 270,
    separado: 235,
  },
  {
    id: 'etapa2',
    corto: 'la etapa 2 (grava caliza)',
    kind: 'grava',
    titulo: 'Etapa 2: Grava Caliza',
    sub: '(Ajuste de pH)',
    tip: 'Segunda etapa: el agua fluye por grava caliza; el carbonato de calcio de la grava ajusta el pH.',
    armado: 370,
    separado: 430,
  },
  {
    id: 'etapa3',
    corto: 'la etapa 3 (tezontle)',
    kind: 'tezontle',
    titulo: 'Etapa 3: Piedra Volcánica/Tezontle',
    sub: '(Mineralización y Biología)',
    tip: 'Tercera etapa: mineraliza el agua con piedras volcánicas de la localidad, como piedra pómez y tezontle, que aportan silicio, óxido de hierro, aluminio y calcio.',
    armado: 470,
    separado: 625,
  },
  {
    id: 'balde',
    corto: 'el balde',
    kind: 'balde',
    titulo: 'Balde hermético (~19 L)',
    sub: '(Recipiente anti plagas)',
    tip: 'Balde o recipiente hermético anti plagas de unos 19 L, bajo las tres etapas.',
    armado: 600,
    separado: 830,
  },
  {
    id: 'bomba',
    corto: 'la bomba',
    kind: 'bomba',
    titulo: 'Bomba de Agua',
    sub: '(Para riego con ESP32)',
    tip: 'Bomba básica de 5 V: toma el agua filtrada y la lleva hacia la planta; la controla el ESP32.',
    armado: 930,
    separado: 1150,
  },
];

// Etapas de la animación. 0 = armado; 1–6 = se separa cada pieza;
// 7 = una gota recorre las etapas; 8 = el balde se llena y la bomba se activa.
export const ETAPAS = [
  { titulo: 'Filtro armado', texto: 'Así se ve el filtro completo, con sus piezas encajadas.' },
  ...PIEZAS.map((p) => ({ titulo: p.titulo, texto: p.tip })),
  { titulo: 'Recorrido del agua', texto: 'El agua baja por las tres etapas y cambia de turbia a limpia.' },
  { titulo: 'Depósito y bomba', texto: 'El agua filtrada llena el balde y la bomba la impulsa hacia el riego.' },
];

export const TOTAL_ETAPAS = ETAPAS.length; // 9

// Pasos de ensamblado: de abajo hacia arriba (orden inverso del despiece, según la imagen).
// Cada paso lleva a la etapa en la que esa pieza ya está colocada y las de arriba siguen separadas.
export const PASOS_ENSAMBLADO = [...PIEZAS]
  .map((p, i) => ({ pieza: p, etapa: i }))
  .reverse()
  .map(({ pieza, etapa }, n) => ({ n: n + 1, pieza, etapa }));

// Colores del agua: turbia → limpia (paleta de la página).
export const AGUA = ['#8a7a55', '#7f9466', '#5fc97c', '#39ff88'];
