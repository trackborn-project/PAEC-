# Notas de contenido para la página web

Este archivo reúne información en lenguaje sencillo para redactar la página del prototipo. No es una ficha electrónica ni un manual de código.

## Nombre de trabajo

**Detector de sequía con ESP32**

El equipo puede cambiar el nombre cuando defina el título final del proyecto.

## Descripción breve

Es un prototipo educativo que ayuda a observar la humedad de la tierra y riega las plantas cuando lo necesitan. El agua pasa por un filtro antes de llegar a las plantas. Un sensor obtiene una lectura, el ESP32 coordina la respuesta y una pantalla muestra el estado del sistema.

## ¿Qué busca resolver?

La humedad de la tierra no siempre es fácil de distinguir a simple vista. El proyecto busca hacer esa condición visible y apoyar el riego de las plantas. El filtro forma parte del recorrido del agua antes de que llegue a ellas.

La necesidad concreta en el CBTis 40 todavía debe comprobarse con observación o con la opinión de quienes cuidan las plantas. Por eso, la página debe describirla como una necesidad por validar, no como un problema que ya se haya demostrado.

## ¿Cómo funciona? — explicación sencilla

1. El sensor toma una lectura relacionada con la humedad de la tierra.
2. El ESP32 interpreta la lectura y decide si hace falta regar.
3. Cuando se requiere agua, el sistema activa la bomba y el agua pasa por el filtro hacia las plantas.
4. La pantalla comunica el estado del sistema.

La lectura debe estar ajustada para las condiciones de las plantas. La calibración y los umbrales necesitan documentarse con las pruebas del equipo.

## Control y potencia — explicación breve

**Control:** el sensor informa cómo está la tierra; el ESP32 interpreta esa lectura y manda la orden de iniciar o detener el riego. La pantalla permite consultar el estado.

**Potencia:** la bomba necesita una alimentación capaz de mover el agua. Una etapa de potencia recibe la orden del control y conecta o desconecta la energía de la bomba; el ESP32 da la orden, pero no alimenta directamente el motor. El filtro pertenece al recorrido del agua, no al circuito eléctrico.

## Propósito educativo y relación con PAEC

El proyecto relaciona el aprendizaje de mecatrónica con una situación cotidiana: el cuidado de las plantas y la observación del riego. También permite conversar sobre el uso responsable del agua.

Como proyecto PAEC, su relación con la comunidad escolar se fortalecerá cuando el equipo identifique quiénes cuidarían las plantas, qué necesidad tienen y qué opinan del prototipo.

## Estado actual del prototipo

- **Funcionamiento actual, según el equipo:** leer la humedad del suelo y regar las plantas; el agua pasa por un filtro.
- **Funciones del prototipo:** incluye filtro de agua y riega las plantas mediante una bomba.
- **Por comprobar/documentar:** calibración de la lectura, umbral de riego, condiciones de activación y detención, y utilidad para quienes cuidan las plantas.
- **Sin resultados publicados:** todavía no hay mediciones, pruebas comparativas ni ahorro de agua documentados.

> **Nota interna de consistencia:** el sketch revisado anteriormente mostraba la lectura y la pantalla, pero no reflejaba el control de la bomba. Antes de publicar una explicación detallada del automatismo, actualizar o confirmar el sketch y las demás fichas técnicas para que describan el prototipo físico actual.



## Público al que podría servir

Personas que cuidan plantas en la escuela, en casa o en otros espacios. El grupo de usuarios concreto y el lugar donde se probará deben confirmarse con el equipo.

## Texto base para la portada

> **Detector de sequía con ESP32**  
> Un prototipo educativo que observa la humedad de la tierra y riega las plantas cuando hace falta. El agua pasa por un filtro antes de llegar a ellas.



## Textos cortos para tarjetas



### El reto

Reconocer cuándo la tierra necesita agua puede ser difícil a simple vista. El proyecto busca hacer más visible esa condición.

### La propuesta

Un sensor obtiene una lectura y el prototipo la convierte en un mensaje visual fácil de consultar.

### Lo que queremos aprender

Cómo observar una situación, probar una idea y usar los resultados para mejorarla.

### Lo que sigue

Probar el sistema en tierra seca y húmeda, revisar el filtro y escuchar la opinión de posibles usuarios para mejorar el riego.

## Límites al redactar la página

- Se puede decir que el prototipo riega y tiene filtro. No afirmar ahorro de agua ni mejoras en las plantas sin pruebas que lo demuestren.
- No presentar la escala como porcentaje real de humedad hasta que se calibre y se explique cómo se obtuvo.
- No inventar integrantes, fecha de exposición, lugar de prueba, medidas ni resultados.
- Si se explica el control de la bomba, comprobar que el programa y la documentación técnica coincidan con el prototipo físico.



## Datos para la Fase 3


### Proceso de armado (en orden)

-primero simulamos todo en digital, pulimos muy bien la logistica de conexiones, una vez teniendo esto comenzamos a estudiar el tipo de 
contaminacion de los aires acondicionados, al ver que la contaminacion es mayormente de gases teorizamos un filtro especial para este tipo de contaminacion
teniendo esto pasamos al ensamblado de todo lo fisico tal cual estaba planeado

### Pruebas y resultados

- Qué se probó: Se probo que las conexiones estuvieran correctas segun la logistica planeada, tambien hicimos pruebas con el filtro, dejamos que el agua
fluyera y estuviera guardada durante 2 dias para probar el sellado anti plagas y mosquitos, asi como tambien hicimos pruebas de alcanizacion del agua
medimos el PH despues de el proceso de filtrado

- Resultados:Los resultados fueron satisfactorios, las conexiones estaban funcionando como deberian, la pantalla reflejaba resultados de manera correcta
y el filtro alcanilizo el agua en un 98%, es decir entre 8 y 9 puntuaciones de PH de 7 puntuaciones ideales para agua neutra, filtrando agua estancada muy
sucia, le dimos a probar el prototipo a conocidos y familiares cercanos y eso fue lo que opinaron:

- Opinión de usuarios:

Miguel Angel Fregoso: "Este sistema es apto para el hogar y lugares domesticos, le da un toque de electrodomestico de alta gamma el hecho de que mande
notificaciones al telefono cuando la plante necesita mantenimiento, por otro lado, el filtro esta muy bien hecho, es parecido a un filtro industrial 
como los que se usan en plantas desaladoras

Thelma Minerva Gallardo: "Es ideal para mis mecetas!, el sistema es adecuado para el hogar, es muy intuitivo y es ideal para personas amantes de las 
plantas y medio ambiente, el unico defecto es que solo se puede utilizar cerca de fuentes de desperdicio de agua, y tendrias que tener tu jardin o plantas
cerca de ese espacio"

### Problemas y soluciones

- Problema: La falta de mantenimiento y el riego desmedido junto con la perdida de agua descuidada en el plantel / Solución: un sistema que detecta cuando 
un jardin necesita regarse, filtra agua de los aires ahorrando recursos y de esa misma agua filtrada riega las plantas / jardines que lo necesiten

### Mejoras futuras
Planeamos que el sistema sea adecuado en su totalidad para exteriores, es decir capaz de aguantar lluvias, vientos, introduccion de composta y descomposicion
en la tierra sin afecciones al funcionamiento

-

### Frase final de la conclusión

## Datos técnicos pendientes

- Medidas caja, XaltoXfondo = 5cm x 5cm x 5cm alto total = 10cm largo de sensores (sondas) = 5cm

- USB-C sirve para: Alimentar el sistema electronico

- Orificio lateral: un led que prende en rojo o amarillo cuando hay problemas de compilacion y conexiones

- Botón enciende/apaga: permite al dispositivo descansar o guardar baterias

- Material de la carcasa: MDF barnizado, Aluminio y polimero de alta densidad

- Qué muestra la pantalla: Estados de resultados de sequia segun lo que recopile el sensor de humedad (sondas)

- Tipo de bomba: Bomba basica de 5v

- Etapa de potencia: Un relevador de 3.3v a 5v

- Alimentación de la bomba:una fuente externa como una bateria de 5v

- De dónde toma el agua:La bomba toma el agua del filtro y la transporta hacia la planta

- Capas del filtro (de arriba a abajo): El filtro consta de 4 etapas, la primera (primer filtro) se encarga de filtrar impurezas
como tierra, insectos, piedras o pedaceria a su vez que un cartucho con carbón
activado elimina malos olores, residuos químicos hongos y bacterias en el agua; la
segunda etapa (segundo filtro) consta de un proceso por donde fluye el agua a través
de un filtro con grava caliza, en esta etapa se ajusta el pH del agua por el carbonato
de calcio de la misma grava; la tercera etapa (tercer filtro) se encarga de mineralizar
el agua con ayuda de piedras volcánicas comunes de nuestra localidad como la
piedra pómez y tezontle, ayudando al agua con silicio, óxido de hierro, aluminio y
calcio

- Umbral de riego / cuándo se detiene: El umbral de riego esta establecido en 15 puntuaciones de sequia es decir 15%, cuando el sensor detecta menos de 15%
de sequia manda una señal para que se riegue la planta, en caso de no haber agua manda una notificacion al telefono, el riego se detiene cuando la humedad 
llega a 100% de humedad

- Zonas verdes del plantel (dato y fuente): Arboleda en andenes de el plantel, asi como zonas verdes cerca de la cafeteria y en zonas recreativas y de ejercicio
como las canchas de futbol y basketball

- Frecuencia actual de riego: Actualmente la frecuencia del riego en estas zonas es casi nula, estudiando el riego dentro de el plantel de estas areas tuvimos
la idea de empezar este prototipo 