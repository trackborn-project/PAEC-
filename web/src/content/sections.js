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
      'Las zonas verdes del plantel son la arboleda de los andenes, las áreas cerca de la cafetería y las zonas recreativas y de ejercicio, como las canchas de fútbol y básquetbol.',
      'Hoy su riego es casi nulo. Al estudiar el riego de estas áreas tuvimos la idea de empezar este prototipo.',
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
      'Dos detalles importantes. Primero, el ESP32 da la orden, pero no alimenta directamente la bomba: para eso hay una etapa de potencia, un relevador de 3.3 a 5 volts, que conecta o desconecta su energía; la bomba se alimenta con una fuente externa, como una batería de 5 volts. Segundo, el filtro forma parte del recorrido del agua, no del circuito eléctrico.',
      'El riego empieza cuando la lectura baja de 15 y se detiene al llegar a 100. Si no hay agua, el sistema manda una notificación al teléfono.',
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
      'La caja mide 5 por 5 por 5 centímetros; con las sondas, el alto total es de 10 centímetros, y las sondas miden 5.',
      'El USB-C alimenta el sistema electrónico, y el orificio lateral deja ver un LED que se enciende en rojo o amarillo cuando hay problemas de compilación o de conexiones.',
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
      '(→ en cada pieza) Arriba está la tapa, que se retira para entrar a la caja, y junto a ella el botón de encendido, que permite al dispositivo descansar o ahorrar batería.',
      'La carcasa, de MDF barnizado, aluminio y polímero de alta densidad, protege la electrónica. Adentro está la tarjeta electrónica; según nuestras notas, ahí está el ESP32, que interpreta la lectura y decide si hace falta regar.',
      'También hay un bloque negro conectado con cables, la ventana frontal transparente, el puerto USB-C y un orificio lateral.',
      'Abajo están las sondas: se entierran en la tierra de la maceta y con ellas el sensor obtiene la lectura.',
      'El bloque negro con cables está marcado como pendiente: todavía debemos confirmar qué es.',
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
      '(3) Si hace falta agua, manda la orden a la etapa de potencia, un relevador, que conecta la energía de la bomba desde una batería de 5 volts. La bomba toma el agua del filtro y la lleva a las plantas. El ESP32 da la orden, pero no alimenta directamente el motor.',
      '(4) La pantalla muestra los estados de sequía según lo que recopila el sensor.',
      'El riego empieza bajo 15 y se detiene en 100. Todavía falta documentar cómo se calibró la escala.',
    ],
  },
  {
    id: 'filtro',
    short: 'Filtro',
    title: 'Despiece y ensamblado del filtro',
    mood: 0.6,
    steps: 9, // armado, 6 piezas, recorrido del agua, depósito y bomba
    notes: [
      'Este es nuestro filtro de agua por etapas. (→ o la rueda del ratón separan las piezas una por una; al regresar se vuelve a armar.)',
      'Arriba está la entrada de agua: recibe el condensado del aire acondicionado.',
      'La etapa 1 filtra impurezas como tierra, insectos y piedras, y su cartucho de carbón activado elimina malos olores, residuos químicos, hongos y bacterias. La etapa 2 es grava caliza: su carbonato de calcio ajusta el pH. La etapa 3 mineraliza el agua con piedras volcánicas de nuestra localidad, como piedra pómez y tezontle, que aportan silicio, óxido de hierro, aluminio y calcio.',
      'Abajo está el balde hermético de unos 19 litros, a prueba de plagas, y la bomba de agua de 5 volts que se usa para el riego con el ESP32.',
      '(Etapa 7) Una gota recorre las etapas y pasa de turbia a limpia. (Etapa 8) El agua llena el balde y la bomba se activa para regar.',
      'Los pasos de ensamblado van de abajo hacia arriba; al hacer clic en uno, el filtro muestra cómo queda en ese paso.',
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
      'Cuando la lectura baja de 15 se enciende la alerta de sequía y el sistema activa la bomba; el riego se detiene al llegar a 100.',
      '(Pulsa “Simular secado y riego” para ver el ciclo completo: la tierra se seca, se activa la bomba, se humedece y la bomba se detiene.)',
      'Es una simulación ilustrativa con los valores que definimos; todavía falta documentar cómo se calibró la escala del sensor.',
    ],
  },
  {
    id: 'costos',
    short: 'Costos',
    title: 'Costos y materiales',
    mood: 0.65,
    steps: 1,
    notes: [
      'Estos son los materiales y lo que costaron, según nuestro inventario. Los precios son aproximados, en pesos mexicanos.',
      'Los componentes electrónicos los compramos en conjunto: la placa ESP32, la pantalla OLED, el protoboard, los sensores y módulos, el relé de doble canal y los accesorios.',
      'Después agregamos el sistema de agua: la mini bomba sumergible de 5 volts, el balde hermético de unos 19 litros, los embudos y los materiales del filtro.',
      '(Usa los filtros Electrónica / Sistema de agua para mostrar cada parte.) El precio de los materiales del filtro es variable: depende de la cantidad y del tipo de material.',
    ],
  },
  {
    id: 'resultados',
    short: 'Resultados',
    title: 'Pruebas y resultados',
    mood: 0.7,
    steps: 1,
    notes: [
      'Probamos que las conexiones estuvieran correctas según la logística planeada: funcionaron como debían y la pantalla reflejó los resultados de manera correcta.',
      'Dejamos el agua guardada durante 2 días para probar el sellado contra plagas y mosquitos.',
      'Y medimos el pH después de filtrar agua estancada muy sucia: quedó entre 8 y 9; el agua neutra tiene 7.',
      'También dimos a probar el prototipo a conocidos y familiares cercanos. (Lee una de las opiniones.)',
    ],
  },
  {
    id: 'aprendizajes',
    short: 'Aprendizajes',
    title: 'Problemas y aprendizajes',
    mood: 0.8,
    steps: 1,
    notes: [
      'Con este proyecto queremos aprender a observar una situación, probar una idea y usar los resultados para mejorarla.',
      'Así lo hicimos: primero simulamos todo en digital y pulimos la logística de conexiones; luego estudiamos la contaminación del agua de los aires acondicionados, que es mayormente de gases, y teorizamos un filtro especial; al final ensamblamos todo lo físico tal como estaba planeado.',
      '(Toca cada tarjeta.) El problema principal: la falta de mantenimiento y el riego desmedido, junto con la pérdida descuidada de agua en el plantel. La solución: un sistema que detecta cuándo un jardín necesita riego, filtra el agua de los aires acondicionados y con esa misma agua riega las plantas.',
      'También hay que actualizar o confirmar el sketch y las fichas técnicas para que describan el prototipo actual.',
    ],
  },
  {
    id: 'mejoras',
    short: 'Mejoras',
    title: 'Mejoras futuras',
    mood: 0.9,
    steps: 5, // un grupo de la ruta por paso
    notes: [
      '(→ revela cada grupo.) Primero, probar el sistema en tierra seca y húmeda y revisar el filtro.',
      'Después, documentar cómo se calibró la lectura y cuándo se activa y se detiene el riego.',
      'También queremos escuchar a posibles usuarios y comprobar si de verdad les sirve a quienes cuidan las plantas.',
      'Como proyecto PAEC, identificar quiénes cuidarían las plantas, qué necesidad tienen y qué opinan del prototipo.',
      'Y queremos que el sistema sea adecuado en su totalidad para exteriores: que aguante lluvias, vientos, composta y descomposición en la tierra sin afectar su funcionamiento.',
    ],
  },
  {
    id: 'conclusion',
    short: 'Conclusión',
    title: 'Conclusión y preguntas',
    mood: 1,
    steps: 1,
    notes: [
      'Para cerrar: este prototipo nos sirvió para relacionar la mecatrónica con algo cotidiano, el cuidado de las plantas, y para conversar sobre el uso responsable del agua.',
      'Lo que queremos aprender es cómo observar una situación, probar una idea y usar los resultados para mejorarla.',
      'Gracias por su atención. ¿Tienen alguna pregunta?',
    ],
  },
];

// Anchura del eje wdth de Archivo según el ánimo: 108 (seco) → 94 (agua). Cambio sutil, tipografía limpia.
export const widthFor = (mood) => Math.round(108 - mood * 14);
