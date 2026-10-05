"Cambalache"
Sitio web interactivo con tres juegos y una página de récords, con temática de cultura argentina.

Integrantes:
  Ayala Jazmin 
  Guerrero Indiana 
  Paletta Merin Francisco 

Datos de la materia:
  Informática General 2026
  Cátedra: Veleria Drelichman, Pedro Paleo, Leonardo Nadel, Norma Morales
  Trabajo: Trabajo Práctico 1 
  Institución: Universidad Nacional de las Artes 

Descripción general del sitio

  El sitio reúne tres juegos hechos con HTML, CSS y JavaScript, uno de cartas, uno de dados y uno de preguntas, unidos por una misma estética inspirada en el arte popular argentino (tipografías     Milonga y Arvo, paleta de rojo, azul, verde y dorado, título curvo en SVG). La página principal presenta el sitio y lleva a cada juego. Una página de rankings muestra el top 5 de                  puntajes de cada juego, guardado en el navegador con localStorage, y una página de integrantes presenta al grupo y el desarrollo del proyecto.

  Páginas: inicio, Quién es Quién, Diez Mil, preguntas, rankings e integrantes (6 páginas, todas con el mismo menú de navegación).

  Los juegos
  
  1. Juego de cartas: "Quién es Quién"

    Objetivo: adivinar qué personaje eligió la computadora. Los personajes son figuras argentinas e internacionales y cada uno tiene su carta con foto.

    Reglas:

    - Al empezar, la computadora elige un personaje secreto al azar entre las cartas del tablero.
    - El jugador elige una pregunta de un desplegable sobre características de los personajes (género, nacionalidad, oficio, si sigue con vida, etc.) y aprieta "Preguntar". El juego responde Sí o       No sobre el personaje secreto y muestra la pregunta junto con la respuesta.
    - Con esa información, el jugador toca las cartas que descarta: se atenúan, y tocarlas de nuevo las vuelve a activar.
    - Cuando cree saber quién es, elige el nombre en el segundo desplegable y aprieta "¡Adivinar!". Si acierta, suma 1 punto.
    - La ronda termina siempre al adivinar (acierte o no): se bloquean los controles y se revela el personaje secreto. "Jugar de nuevo" elige otro personaje y destapa todas las cartas, sin              reiniciar el puntaje.

  Puntaje: cantidad de aciertos acumulados durante la visita. Se guarda en el top 5 de récords (recordCartas).

  2. Juego de dados: "Diez Mil"

     Objetivo: llegar primero a 10.000 puntos antes que la computadora.

     Reglas:
        - En cada tirada se lanzan los 5 dados (los cinco se vuelven a tirar cada vez).
        - Los puntos de cada tirada se acumulan en el puntaje del turno. El jugador puede seguir tirando para sumar más o plantarse para sumarlos a su puntaje total.
        - Si una tirada no suma ningún punto, pierde los puntos acumulados en ese turno y pasa el turno a la computadora.
        - La computadora juega una tirada por turno y suma lo que obtiene.
        - Gana quien llega primero a 10.000. Al terminar, se bloquean los botones y aparece "Jugar de nuevo".
    
     Puntaje y récord: el sitio cuenta las partidas ganadas por el jugador durante la visita. "Jugar de nuevo" no reinicia ese contador; cuando el jugador se va de la página, la cantidad se
     guarda en el top 5 (recordDados) y el contador vuelve a 0.

  4. Juego de preguntas: "¿Cuánta calle tenés?"

      Objetivo: responder preguntas de geografía argentina, armadas con datos reales de una API pública.
            
       Reglas:
         - Cada pregunta es del tipo "¿A qué provincia pertenece la localidad de X?", con tres opciones
         - Hay 20 segundos por pregunta. Si se acaba el tiempo, cuenta como error.
         - La partida termina al responder 15 preguntas o al llegar a 3 errores, lo que ocurra primero. Completar las 15 sin llegar a 3 errores es terminar la partida con éxito, y el mensaje                 final cambia según el resultado.
         - Se muestran la ronda actual, el tiempo restante y los errores acumulados.

     Puntaje: cantidad de aciertos de la partida. Se guarda en el top 5 de récords al terminar.

  Tecnologías utilizadas
         - HTML5 con etiquetas semánticas (header, nav, main, section, article, footer).
         - CSS3: una única hoja externa, Flexbox, pseudoclases, transition, Google Fonts (Milonga y Arvo) y un título curvo con SVG (textPath).
         - JavaScript: manipulación del DOM (createElement, append, classList, atributo hidden), eventos (addEventListener), arrays de objetos, localStorage con JSON, fetch con async/await y                 try/catch, y timers (setInterval, clearInterval, setTimeout).
         - Git y GitHub (ramas y Pull Requests) y GitHub Pages para la publicación.

  Funcionalidades principales
         - Generación dinámica de elementos: el tablero de cartas y las opciones del desplegable de "adivinar" se crean con JavaScript a partir de un array de objetos, no están escritos a mano en            el HTML.
         - Consulta a una API pública para armar las preguntas del juego de preguntas, con manejo de errores.
         - Timers con función en las reglas: cuenta regresiva por pregunta en el juego de preguntas (si se agota, cuenta como error), y animación de la tirada en Diez Mil.
         - Récords persistentes por juego en localStorage, mostrados en la página de rankings.
         - Estados claros en cada juego: botones que se bloquean al terminar la partida, mensajes de resultado y posibilidad de jugar de nuevo.
         - Animación de dados: al tirar, cada dado muestra una imagen "girando" medio segundo y luego queda en su cara real.

  Récords y almacenamiento local
         - Cada juego guarda su top 5 bajo una clave propia: recordCartas, recordDados y recordPreguntas.
         - El valor es un array de puntajes ordenado de mayor a menor, guardado con JSON.stringify() y recuperado con JSON.parse() (localStorage solo admite texto).
         - La función guardarEnRankings(clave, puntaje) agrega el puntaje, ordena, se queda con los 5 mejores y guarda. Cada juego incluye su propia copia, porque cada página carga su propio                 script.
         - ranking.js lee las tres claves y arma una lista por juego. Si no hay datos muestra "No hay puntajes guardados". Si lo guardado no es una lista válida (por ejemplo, datos de una versión            anterior), lo trata como             vacío en vez de romper la página.
         - localStorage es único por navegador y por dirección: los récords son locales y no se comparten entre personas.

  API utilizada
      Georef (Servicio de Normalización de Datos Geográficos de Argentina), una API pública del Estado nacional que no requiere API key.
         - Dirección base: https://apis.datos.gob.ar/georef/api
         - Qué información obtiene: localidades con su provincia, y la lista de provincias argentinas.
         - Cómo hace la consulta: con fetch dentro de funciones async, esperando cada respuesta con await y convirtiéndola con .json(). Por cada pregunta hace dos pedidos:
           - GET /localidades?max=50&campos=nombre,provincia
           - GET /provincias?campos=nombre
         - Qué datos recibe: objetos JSON con un array localidades (cada una con su nombre y un objeto provincia) y un array provincias (cada una con su nombre).
         - Cómo los procesa: elige una localidad al azar de las recibidas, toma su provincia como respuesta correcta, completa con dos provincias incorrectas distintas elegidas al azar de la                 lista, arma un objeto { texto, correcta, opciones } y mezcla las opciones con una función propia para que la correcta no esté siempre en el mismo lugar.
         - Cómo usa la información: muestra la pregunta y las tres opciones, y compara la opción elegida con la correcta para sumar un acierto o un error.
         - Errores: todo el pedido está dentro de un try/catch. Si falla la conexión o la API no responde, el juego avisa en pantalla que no pudo cargar la pregunta en vez de romperse.

  Esta API entrega datos, no preguntas armadas: el texto de la pregunta y las opciones incorrectas los construye el propio juego. Antes de elegirla se evaluaron otras opciones: Open Trivia          Database (preguntas ya armadas, pero generales y sin contenido específico de Argentina) y ArgentinaDatos (feriados, presidentes). Se eligió Georef por ser oficial y por permitir preguntas de      geografía argentina.

  Principales decisiones técnicas
         - Una sola hoja de estilos (css/estetica.css) para todo el sitio, como pide la consigna. Los estilos se asignan por clases específicas (por ejemplo .tarjeta-juego) y no por etiquetas                genéricas como article, para que un cambio no afecte a otras páginas.
         - Una clave de localStorage por juego, en vez de un único objeto con los tres, para que cada integrante pudiera trabajar y probar su parte sin depender del código de los demás.
         - Preguntas del Quién es Quién con un <select> cuyo value es el nombre de la propiedad del personaje: el código responde con personaje[atributo] (notación con corchetes), sin tener que              interpretar texto libre ni escribir un if por pregunta.
         - Atributos de los personajes verificables: las preguntas del Quién es Quién usan solo datos objetivos (género, nacionalidad, oficio, si sigue con vida). Se evitaron atributos sobre la              vida privada de personas reales.
         - Fin de partida centralizado en Diez Mil: comprobarGanador() se llama después de cada vez que alguien suma puntos, y terminarPartida() bloquea los botones y muestra "Jugar de nuevo" en             un solo lugar, sea cual sea el ganador.
         - Récord de Diez Mil por visita: como el jugador casi nunca pierde, guardar "al perder" no habría registrado nada. Por eso el contador de partidas ganadas se guarda al salir de la página            con el evento pagehide. Es un evento que no se vio en clase, pero se usa con el mismo addEventListener que click.
         - Tiempo agotado como respuesta: en el juego de preguntas, cuando se acaba el tiempo se llama a la misma función responder(null), de modo que cuenta como un error sin duplicar lógica.
         - Imágenes de dados con constantes: las rutas de las caras están agrupadas en un array al inicio de diezmil.js, para cambiarlas en un solo lugar.

   Limitaciones conocidas
         - Los récords viven en el navegador de cada usuario: no hay una tabla compartida entre jugadores.
         - En Diez Mil la computadora hace una sola tirada por turno, por lo que el jugador casi siempre gana. En una simulación de 20.000 partidas con las reglas del código, un jugador que se               planta al juntar 500 puntos o más ganó el 100%. Una mejora posible es que la computadora también pueda seguir tirando.
         - Algunas preguntas del Quién es Quién son discutibles según el criterio (por ejemplo, qué cuenta como "artista").

  Declaración de uso de Inteligencia Artificial
  
  Herramientas utilizadas: Claude (Anthropic) y ChatGTP (OpenIA).  
           
  Etapas del desarrollo en las que se usó: 
            - Planificación y diseño de los juegos (ideas, reglas, estructura de datos).
            - Repaso de los conceptos de la cursada (clases 13 a 16) y práctica guiada antes de escribir el código del TP (prácticas 41 a 43 y ejercicios de API).
            - Desarrollo y depuración del Quién es Quién, la página de rankings y el sistema de récords.
            - Revisión y mejora del juego de dados.
            
  Principales usos: 
            - Explicaciones guiadas: se pidió que los conceptos se explicaran con preguntas y razonamiento antes de ver código, y se escribió buena parte del código a mano.
            - Detección de errores reales en el código del grupo: un id repetido en el HTML; una propiedad faltante en un objeto del array de personajes; variables usadas sin declarar                           (mensajeJuego, puntajeEl, btnReiniciar), que daban ReferenceError; claves de localStorage con nombres distintos entre un juego y el ranking; datos guardados con un formato anterior                que rompían el ranking (historial.forEach is not a function); y que la computadora de Diez Mil nunca comprobaba si había ganado.
            - Generación de código base (estructura HTML/CSS, esqueletos de funciones) que el grupo completó, probó y corrigió.
            - Búsqueda y comparación de APIs públicas para el juego de preguntas.
            - Análisis por simulación del equilibrio de Diez Mil, que mostró que el jugador casi siempre gana y llevó a replantear cuándo guardar el récord.

  Ejemplos de aportes relevantes de la IA:
            - La estructura del top 5 con JSON.stringify()/JSON.parse() y una única función reutilizable, guardarEnRankings.
            - La advertencia de que guardar el récord solo al perder dejaría sin registro a quien casi nunca pierde, y la propuesta de guardar al salir de la página con pagehide.
            - La idea de hacer el ranking tolerante a datos viejos o inválidos con Array.isArray y try/catch.

  
           
           
  
         
         
      
       
