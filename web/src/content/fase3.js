// Contenido de las secciones 10–13, tomado de Contenido/notas.md
// ("Datos para la Fase 3" y "Datos técnicos pendientes"). Lo que siga vacío se muestra como [FALTA].

// notas.md, "Datos para la Fase 3 › Proceso de armado (en orden)"
export const proceso = [
  { id: 'simulacion', titulo: 'Simulación digital', detalle: 'Simulamos todo en digital y pulimos la logística de conexiones.' },
  { id: 'estudio', titulo: 'Estudio del agua de AC', detalle: 'Estudiamos la contaminación del agua de los aires acondicionados: es mayormente de gases.' },
  { id: 'filtro', titulo: 'Filtro especial', detalle: 'Teorizamos un filtro especial para ese tipo de contaminación.' },
  { id: 'ensamblado', titulo: 'Ensamblado físico', detalle: 'Ensamblamos todo lo físico tal como estaba planeado.' },
];

// notas.md, "Datos para la Fase 3 › Pruebas y resultados"
export const pruebas = {
  estado: 'Probamos las conexiones, el sellado del filtro y el pH del agua filtrada. También dimos a probar el prototipo a conocidos y familiares cercanos.',
  hechas: [
    {
      id: 'conexiones',
      titulo: 'Conexiones',
      prueba: 'Que las conexiones estuvieran correctas según la logística planeada.',
      resultado: 'Funcionaron como debían y la pantalla reflejó los resultados de manera correcta.',
    },
    {
      id: 'sellado',
      titulo: 'Sellado anti plagas',
      prueba: 'Dejamos que el agua fluyera y estuviera guardada durante 2 días, para probar el sellado contra plagas y mosquitos.',
      // notas.md, "ACTUALIZAR › Diapositiva 14"
      resultado: 'Al destapar el balde después de 2 días, el agua estaba en buen estado: sin plagas, sin mosquitos ni impurezas.',
    },
    {
      id: 'ph',
      titulo: 'pH del agua',
      prueba: 'Medimos el pH después del proceso de filtrado, filtrando agua estancada muy sucia.',
      resultado: 'El filtro alcalinizó el agua: pH entre 8 y 9.',
    },
  ],
  // pH medido después del filtrado y referencia de agua neutra (notas.md)
  ph: { min: 8, max: 9, neutro: 7 },
  // notas.md, "Opinión de usuarios" (conocidos y familiares cercanos)
  opiniones: [
    {
      nombre: 'Miguel Ángel Fregoso',
      texto:
        'Este sistema es apto para el hogar y lugares domésticos. Le da un toque de electrodoméstico de alta gama el hecho de que mande notificaciones al teléfono cuando la planta necesita mantenimiento. Por otro lado, el filtro está muy bien hecho: es parecido a un filtro industrial, como los que se usan en plantas desaladoras.',
    },
    {
      nombre: 'Thelma Minerva Gallardo',
      texto:
        '¡Es ideal para mis macetas! El sistema es adecuado para el hogar, es muy intuitivo y es ideal para personas amantes de las plantas y del medio ambiente. El único defecto es que solo se puede utilizar cerca de fuentes de desperdicio de agua, y tendrías que tener tu jardín o plantas cerca de ese espacio.',
    },
  ],
};

// Objetivos (rúbrica II.c). Objetivo general dictado por el equipo.
export const objetivoGeneral = 'Disminuir radicalmente el desperdicio desmedido de agua en el plantel.';

// Problemas que estaban en la diapositiva "Problemas y aprendizajes" (notas.md), movidos a Objetivos
// y redactados como problemas que el proyecto resuelve en el CBTis 40.
export const problemasPlantel = [
  {
    // notas.md, "Datos para la Fase 3 › Problemas y soluciones"
    problema: 'La falta de mantenimiento y el riego desmedido, junto con la pérdida descuidada de agua en el plantel.',
    solucion: 'Un sistema que detecta cuándo un jardín necesita riego, filtra el agua de los aires acondicionados ahorrando recursos y con esa misma agua filtrada riega las plantas que lo necesitan.',
  },
  {
    // notas.md, "Proceso de armado"
    problema: 'La contaminación del agua de los aires acondicionados es mayormente de gases.',
    solucion: 'Teorizamos un filtro especial para ese tipo de contaminación, con un cartucho de carbón activado en la primera etapa.',
  },
  {
    // notas.md, "Nota interna de consistencia"
    problema: 'El sketch revisado mostraba la lectura y la pantalla, pero no reflejaba el control de la bomba.',
    solucion: 'Actualizar o confirmar el sketch y las fichas técnicas para que describan el prototipo físico actual.',
  },
];

// Diapositiva "Problemas y aprendizajes": problemas NUEVOS propuestos para la rúbrica (no repiten los de Objetivos).
// Las soluciones marcadas como propuesta no son funciones que ya tenga el prototipo.
export const aprendizajes = [
  {
    problema: 'Fugas no detectadas en tuberías y bebederos del plantel.',
    solucion: 'Propuesta: colocar sondas de humedad junto a tuberías y bebederos para avisar cuando el suelo se moje sin que haya riego.',
  },
  {
    problema: 'Agua estancada en macetas y jardineras por exceso de riego, que atrae mosquitos.',
    solucion: 'El riego se detiene al llegar a 100 y el balde hermético del filtro está sellado contra plagas y mosquitos.',
  },
  {
    problema: 'Falta de datos para medir el consumo de agua del plantel.',
    solucion: 'Propuesta: que el ESP32 registre cada riego y cada lectura para conocer cuánta agua se usa.',
  },
];

// notas.md, "Lo que queremos aprender"
export const queremosAprender = 'Cómo observar una situación, probar una idea y usar los resultados para mejorarla.';

// notas.md, "Lo que sigue", "Por comprobar/documentar", "Propósito educativo y relación con PAEC"
// y "Datos para la Fase 3 › Mejoras futuras"
export const mejoras = [
  { grupo: 'Probar', items: ['Probar el sistema en tierra seca y húmeda.', 'Revisar el filtro.'] },
  { grupo: 'Calibrar', items: ['Documentar cómo se calibró la lectura del sensor.', 'Documentar las condiciones de activación y detención.'] },
  { grupo: 'Escuchar', items: ['Escuchar la opinión de posibles usuarios para mejorar el riego.', 'Comprobar su utilidad para quienes cuidan las plantas.'] },
  { grupo: 'Comunidad', items: ['Identificar quiénes cuidarían las plantas, qué necesidad tienen y qué opinan del prototipo.'] },
  {
    grupo: 'Exteriores',
    items: ['Que el sistema sea adecuado en su totalidad para exteriores.', 'Que aguante lluvias, vientos, composta y descomposición en la tierra sin afectar su funcionamiento.'],
  },
];

// notas.md, "ACTUALIZAR › Diapositiva 18" (atribuida por el equipo a Friedrich Nietzsche).
export const fraseFinal = {
  texto:
    'Distingue entre quienes actúan por iniciativa propia (Creadores) y quienes solo se quejan o culpan al entorno (resentimiento). Un buen ambiente laboral se construye asumiendo responsabilidad y aportando soluciones.',
  autor: 'Friedrich Nietzsche',
};

// notas.md, "ACTUALIZAR › Diapositiva 15"
export const aguaRescatada = { entra: 1000, rescata: 730 };
