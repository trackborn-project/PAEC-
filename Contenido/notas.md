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



## Información pendiente para completar el sitio

- Nombre del equipo: The crowns
- 3AMM Fecha: 24/11/26
- Plantel educativo CBTIS40, el prototipo se probara en macetas 
- Los alumnos son los usuarios, la necesidad fue el poco mantenimiento a zonas verdes
- Resultados reales de pruebas y opinión de usuarios. (pendiente)
- Fotografías propias del prototipo terminado. (pendiente)
- Medidas (pendiente)
- costo del sistema inteligente = 400$MXN

