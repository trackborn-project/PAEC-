// Contenido de las secciones 10–13, tomado de Contenido/notas.md.
// Cuando el equipo complete "Datos para la Fase 3" en notas.md, se actualiza aquí;
// lo que siga vacío se muestra como [FALTA].

export const pruebas = {
  // notas.md, "Estado actual del prototipo"
  estado: 'Todavía no hay mediciones, pruebas comparativas ni ahorro de agua documentados.',
  // notas.md, "Lo que sigue"
  plan: [
    { id: 'tierra', titulo: 'Probar en tierra seca y húmeda', detalle: 'Comparar la lectura del sensor en ambas condiciones.' },
    { id: 'filtro', titulo: 'Revisar el filtro', detalle: 'Observar el agua antes y después de pasar por las etapas.' },
    { id: 'usuarios', titulo: 'Escuchar a posibles usuarios', detalle: 'Recoger su opinión para mejorar el riego.' },
  ],
  // notas.md, "Datos para la Fase 3 › Pruebas y resultados" (vacío por ahora)
  queSeProbo: null,
  resultados: null,
  opinion: null,
};

export const aprendizajes = [
  {
    // notas.md, "Nota interna de consistencia"
    problema: 'El sketch revisado mostraba la lectura y la pantalla, pero no reflejaba el control de la bomba.',
    solucion: 'Actualizar o confirmar el sketch y las fichas técnicas para que describan el prototipo físico actual.',
  },
  {
    // notas.md, "Límites al redactar la página"
    problema: 'La escala del sensor todavía no está calibrada.',
    solucion: 'No presentarla como porcentaje real de humedad hasta calibrarla y explicar cómo se obtuvo.',
  },
  // notas.md, "Datos para la Fase 3 › Problemas y soluciones" (vacío por ahora)
  { problema: null, solucion: null },
];

// notas.md, "Lo que queremos aprender"
export const queremosAprender = 'Cómo observar una situación, probar una idea y usar los resultados para mejorarla.';

// notas.md, "Lo que sigue", "Por comprobar/documentar" y "Propósito educativo y relación con PAEC"
export const mejoras = [
  { grupo: 'Probar', items: ['Probar el sistema en tierra seca y húmeda.', 'Revisar el filtro.'] },
  { grupo: 'Calibrar', items: ['Calibrar la lectura del sensor.', 'Definir el umbral de riego.', 'Documentar las condiciones de activación y detención.'] },
  { grupo: 'Escuchar', items: ['Escuchar la opinión de posibles usuarios para mejorar el riego.', 'Comprobar su utilidad para quienes cuidan las plantas.'] },
  { grupo: 'Comunidad', items: ['Identificar quiénes cuidarían las plantas, qué necesidad tienen y qué opinan del prototipo.'] },
];

// notas.md, "Frase final de la conclusión" (vacío por ahora)
export const fraseFinal = null;
