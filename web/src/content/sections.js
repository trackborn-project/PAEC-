// Índice de la exposición y notas del presentador.
// mood: 0 = sequía (ámbar) … 1 = agua limpia (cian). Controla orbes y anchura de títulos.
// steps: pasos internos que se recorren con las flechas antes de pasar a la siguiente sección.
// Fuente de todos los textos: /Contenido/notas.md.

export const team = {
  name: 'The crowns',
  group: '3AMM',
  school: 'CBTis 40',
  date: '24 de noviembre de 2026',
};

export const sections = [
  {
    id: 'portada',
    short: 'Portada',
    title: 'Detector de sequía con ESP32',
    mood: 0,
    steps: 1,
    notes: [
      'Buenos días. Somos el equipo The crowns, del grupo 3AMM del CBTis 40, y les presentamos nuestro proyecto PAEC: un detector de sequía con ESP32.',
      'Es un prototipo educativo que observa la humedad de la tierra y riega las plantas cuando hace falta. Antes de llegar a ellas, el agua pasa por un filtro.',
      'Lo que ven en pantalla es el módulo del sensor: una caja con pantalla, la tarjeta electrónica a la vista detrás de una ventana transparente y dos sondas que se entierran en la maceta.',
      'En los próximos minutos les explicaremos qué queremos atender, cómo está construido, cómo funciona y qué nos falta comprobar.',
    ],
  },
  {
    id: 'problema',
    short: 'El problema',
    title: 'El reto',
    mood: 0.05,
    steps: 1,
    notes: [
      'Empecemos por el reto. La humedad de la tierra no siempre es fácil de distinguir a simple vista, así que es difícil saber cuándo una planta necesita agua.',
      'En nuestro plantel identificamos una necesidad: las zonas verdes reciben poco mantenimiento. Pensamos en los alumnos como las personas usuarias del prototipo, y lo probaremos en macetas.',
      'Queremos ser claros: esta necesidad todavía debe comprobarse con observación y con la opinión de quienes cuidan las plantas. Por eso la presentamos como una necesidad por validar, no como un problema ya demostrado.',
      'Los recuadros marcados como pendientes son cifras que todavía vamos a reunir.',
    ],
  },
  {
    id: 'solucion',
    short: 'La solución',
    title: 'La propuesta',
    mood: 0.15,
    steps: 1,
    notes: [
      'Nuestra propuesta es sencilla: observar la humedad de la tierra y regar cuando hace falta.',
      'El sistema tiene cinco partes. El sensor toma una lectura relacionada con la humedad. El ESP32 interpreta esa lectura y decide si hace falta regar. Cuando se necesita agua, se activa la bomba y el agua pasa por el filtro hacia las plantas. La pantalla muestra el estado del sistema.',
      'Dos detalles importantes. Primero, el ESP32 da la orden, pero no alimenta directamente la bomba: para eso hay una etapa de potencia que conecta o desconecta su energía. Segundo, el filtro forma parte del recorrido del agua, no del circuito eléctrico.',
      '(Haz clic en cada tarjeta para ampliarla mientras la explicas. Esc la cierra.)',
    ],
  },
  {
    id: 'diseno',
    short: 'Diseño',
    title: 'Diseño del prototipo',
    mood: 0.3,
    steps: 3, // frontal, superior, lateral
    notes: [
      'Ahora veamos el diseño del módulo desde tres vistas técnicas, todas a la misma escala.',
      'En la vista frontal se ve la ventana transparente con la tarjeta electrónica adentro y, debajo, las dos sondas que se entierran en la maceta.',
      '(→) En la vista superior están el panel cuadrado y el botón de encendido.',
      '(→) En la vista lateral se ven el puerto USB-C y un orificio pequeño; las sondas quedan una detrás de la otra.',
      'Las medidas todavía están pendientes; las vamos a agregar cuando terminemos de documentar el prototipo.',
    ],
  },
  {
    id: 'anatomia',
    short: 'Anatomía',
    title: 'Anatomía del prototipo',
    mood: 0.35,
    steps: 11, // armado, despiece y 9 piezas
    notes: [
      'Este es el módulo armado. (→) Al separarlo vemos sus piezas.',
      '(→ en cada pieza) Arriba está la tapa, que se retira para entrar a la caja, y junto a ella el botón de encendido.',
      'La carcasa protege la electrónica. Adentro está la tarjeta electrónica; según nuestras notas, ahí está el ESP32, que interpreta la lectura y decide si hace falta regar.',
      'También hay un bloque negro conectado con cables, la ventana frontal transparente, el puerto USB-C y un orificio lateral.',
      'Abajo están las sondas: se entierran en la tierra de la maceta y con ellas el sensor obtiene la lectura.',
      'Las piezas marcadas como pendientes son las que todavía debemos confirmar con el prototipo físico.',
    ],
  },
  {
    id: 'detector',
    short: 'Detector',
    title: 'Cómo funciona el detector',
    mood: 0.4,
    steps: 5, // vista general y 4 pasos
    notes: [
      'Este diagrama muestra cómo se conectan las partes. En ámbar va la señal de control, en coral la energía de la bomba y en cian el recorrido del agua.',
      '(1) El sensor, enterrado en la maceta, toma una lectura relacionada con la humedad de la tierra.',
      '(2) El ESP32 interpreta esa lectura y decide si hace falta regar.',
      '(3) Si hace falta agua, manda la orden a la etapa de potencia, que conecta la energía de la bomba. La bomba mueve el agua, que pasa por el filtro hacia las plantas. El ESP32 da la orden, pero no alimenta directamente el motor.',
      '(4) La pantalla comunica el estado del sistema.',
      'La calibración de la lectura y el umbral de riego todavía deben documentarse con nuestras pruebas.',
    ],
  },
  {
    id: 'filtro',
    short: 'Filtro',
    title: 'Cómo funciona el filtro',
    mood: 0.6,
    steps: 3,
    notes: [
      'El filtro forma parte del recorrido del agua, no del circuito eléctrico.',
      '(1) La bomba impulsa el agua hacia el filtro.',
      '(2) El agua atraviesa el filtro antes de llegar a las plantas.',
      '(3) Después sale hacia la tierra de la maceta.',
      'El cambio de color es una ilustración de para qué sirve el filtro: todavía no hemos medido qué tan bien limpia el agua. También falta documentar sus capas y materiales.',
    ],
  },
  {
    id: 'demo',
    short: 'Demostración',
    title: 'Demostración',
    mood: 0.45,
    steps: 1,
    notes: [
      'Esta es una simulación de cómo responde el sistema. Muevan el control hacia la izquierda: la tierra se seca y la aguja baja.',
      'Al cruzar el umbral se enciende la alerta de sequía y el sistema activaría la bomba.',
      '(Pulsa “Simular secado y riego” para ver el ciclo completo: la tierra se seca, se activa la bomba, se humedece y la bomba se detiene.)',
      'Importante: la escala es relativa, no es un porcentaje real de humedad. El umbral y el momento en que se detiene el riego son ilustrativos; los vamos a calibrar con pruebas en tierra seca y húmeda.',
    ],
  },
  { id: 'construccion', short: 'Construcción', title: 'Construcción', mood: 0.65, steps: 1, phase: 3 },
  { id: 'resultados', short: 'Resultados', title: 'Pruebas y resultados', mood: 0.7, steps: 1, phase: 3 },
  { id: 'aprendizajes', short: 'Aprendizajes', title: 'Problemas y aprendizajes', mood: 0.8, steps: 1, phase: 3 },
  { id: 'mejoras', short: 'Mejoras', title: 'Mejoras futuras', mood: 0.9, steps: 1, phase: 3 },
  { id: 'conclusion', short: 'Conclusión', title: 'Conclusión y preguntas', mood: 1, steps: 1, phase: 3 },
];

// Anchura del eje 'wdth' de Archivo según el ánimo: 125 (seco, ancho) → 78 (agua, estrecho).
export const widthFor = (mood) => Math.round(125 - mood * 47);
