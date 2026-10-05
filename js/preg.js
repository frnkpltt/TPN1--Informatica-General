javascript
/* ===========================================
   preg.js
   Juego "Cuanta calle tenés?" - categoria geografia
   =========================================== */


/* ---------- Variables globales del estado del juego ---------- */

/* Guarda en qué pregunta estamos. */
let rondaActual = 1;

/* Cantidad total de preguntas del juego. */
const totalRondas = 15;

/* Cantidad de respuestas correctas e incorrectas. */
let aciertos = 0;
let errores = 0;

/* El jugador pierde cuando llega a 3 errores. */
const maxErrores = 3;

/* Cantidad de aciertos necesarios para completar el juego. */
const metaAciertos = 15;

/* Tiempo disponible para responder cada pregunta. */
let tiempoRestante = 20;

/* Guarda el intervalo del temporizador para poder detenerlo después. */
let intervaloTimer = null;

/* Guarda la pregunta que se está mostrando actualmente. */
let preguntaActual = null;


/* ---------- Referencias al DOM ---------- */

/* Buscamos elementos del HTML mediante sus IDs.
   querySelector permite seleccionar elementos del documento. */

const pantallaInicio = document.querySelector("#pantalla-inicio");
const btnEmpezarJuego = document.querySelector("#btn-empezar-juego");

const estadoJuegoDiv = document.querySelector("#estado-juego");
const contadorRonda = document.querySelector("#contador-ronda");
const timerTexto = document.querySelector("#timer");
const contadorErrores = document.querySelector("#contador-errores");

const textoPregunta = document.querySelector("#texto-pregunta");
const opcion0 = document.querySelector("#opcion-0");
const opcion1 = document.querySelector("#opcion-1");
const opcion2 = document.querySelector("#opcion-2");

const preguntaActualDiv = document.querySelector("#pregunta-actual");
const resultadoFinalDiv = document.querySelector("#resultado-final");
const mensajeFinal = document.querySelector("#mensaje-final");
const puntajeFinal = document.querySelector("#puntaje");
const btnJugarDeNuevo = document.querySelector("#btn-jugar-de-nuevo");


/* ---------- Guarda un puntaje en el top 5 histórico de localStorage ---------- */

/* Esta función guarda los puntajes obtenidos por el jugador
   en localStorage para que puedan aparecer después en Rankings. */

function guardarEnRankings(clave, puntajeNuevo) {

  /* Buscamos si ya existe un historial guardado.
     JSON.parse convierte el texto guardado en un array.
     Si no existe nada, usamos un array vacío. */
  const historial = JSON.parse(localStorage.getItem(clave) || '[]');

  /* Agregamos el nuevo puntaje al historial. */
  historial.push(puntajeNuevo);

  /* Ordenamos los puntajes de mayor a menor. */
  historial.sort((a, b) => b - a);

  /* Nos quedamos solamente con los 5 mejores. */
  const top5 = historial.slice(0, 5);

  /* Guardamos nuevamente el array en localStorage.
     JSON.stringify convierte el array en texto para poder guardarlo. */
  localStorage.setItem(clave, JSON.stringify(top5));
}


/* ---------- Trae una pregunta de geografia desde Georef ---------- */

/* async permite que esta función trabaje con operaciones
   que tardan en responder, como las consultas a una API. */
async function obtenerPreguntaGeografia() {

  try {

    /* Usamos fetch para pedir datos a la API de Georef.
       En este caso pedimos 50 localidades con su provincia. */
    const respuestaLocalidades = await fetch(
      "https://apis.datos.gob.ar/georef/api/localidades?max=50&campos=nombre,provincia"
    );

    /* Convertimos la respuesta de la API de JSON a un objeto JavaScript. */
    const datosLocalidades = await respuestaLocalidades.json();

    /* Guardamos solamente el array de localidades. */
    const localidades = datosLocalidades.localidades;


    /* Elegimos una localidad al azar. */
    const indiceAlAzar = Math.floor(Math.random() * localidades.length);

    const localidadElegida = localidades[indiceAlAzar];


    /* Obtenemos el nombre de la localidad y su provincia correcta. */
    const nombreLocalidad = localidadElegida.nombre;
    const provinciaCorrecta = localidadElegida.provincia.nombre;


    /* Hacemos otra consulta a la API.
       Esta vez obtenemos todas las provincias para poder
       crear las respuestas incorrectas. */
    const respuestaProvincias = await fetch(
      "https://apis.datos.gob.ar/georef/api/provincias?campos=nombre"
    );

    const datosProvincias = await respuestaProvincias.json();

    const provincias = datosProvincias.provincias;


    /* Array donde vamos a guardar las dos provincias incorrectas. */
    const incorrectas = [];


    /* Repetimos hasta conseguir dos opciones incorrectas. */
    while (incorrectas.length < 2) {

      /* Elegimos una provincia al azar. */
      const indiceProvincia = Math.floor(
        Math.random() * provincias.length
      );

      const nombreProvincia = provincias[indiceProvincia].nombre;


      /* Comprobamos que la provincia no sea la correcta
         y que tampoco esté repetida. */
      if (
        nombreProvincia !== provinciaCorrecta &&
        !estaEnArray(nombreProvincia, incorrectas)
      ) {
        incorrectas.push(nombreProvincia);
      }
    }


    /* Creamos un objeto que representa la pregunta.
       Tiene el texto, la respuesta correcta y las tres opciones. */
    const pregunta = {
      texto:
        "¿A qué provincia pertenece la localidad de " +
        nombreLocalidad + "?",

      correcta: provinciaCorrecta,

      opciones: [
        provinciaCorrecta,
        incorrectas[0],
        incorrectas[1]
      ]
    };


    /* Devolvemos el objeto pregunta para poder utilizarlo
       en otras funciones. */
    return pregunta;


  } catch (error) {

    /* Si ocurre algún error con la conexión o con la API,
       mostramos el error en la consola y devolvemos null. */
    console.log("Error al obtener la pregunta:", error);

    return null;
  }
}


/* ---------- Chequea si un valor ya esta en un array ---------- */

/* Esta función comprueba si un determinado valor
   ya existe dentro de un array. */
function estaEnArray(valor, array) {

  /* Recorremos todos los elementos del array. */
  for (let i = 0; i < array.length; i++) {

    /* Si encontramos el valor, devolvemos true. */
    if (array[i] === valor) {
      return true;
    }
  }

  /* Si terminamos el recorrido sin encontrarlo,
     devolvemos false. */
  return false;
}


/* ---------- Mezcla un array ---------- */

/* Esta función mezcla las opciones de respuesta
   para que la correcta no aparezca siempre primero. */
function mezclarArray(array) {

  /* Array donde vamos a guardar las opciones mezcladas. */
  const resultado = [];

  /* Guarda los índices que ya utilizamos,
     para evitar repetir opciones. */
  const indicesUsados = [];


  /* Seguimos mezclando hasta tener la misma cantidad
     de elementos que tenía el array original. */
  while (resultado.length < array.length) {

    /* Elegimos un índice al azar. */
    const indice = Math.floor(
      Math.random() * array.length
    );


    /* Comprobamos que ese índice no haya sido utilizado. */
    if (!estaEnArray(indice, indicesUsados)) {

      /* Guardamos el índice como utilizado. */
      indicesUsados.push(indice);

      /* Agregamos la opción correspondiente al resultado. */
      resultado.push(array[indice]);
    }
  }


  /* Devolvemos el array mezclado. */
  return resultado;
}


/* ---------- Actualiza los contadores en pantalla ---------- */

/* Actualiza la información que ve el jugador
   sobre la pregunta actual y los errores. */
function actualizarContadores() {

  /* Muestra en qué pregunta estamos. */
  contadorRonda.innerText =
    "Pregunta " + rondaActual + " de " + totalRondas;

  /* Muestra la cantidad de errores acumulados. */
  contadorErrores.innerText =
    "Errores: " + errores + " / " + maxErrores;
}


/* ---------- Timer de cada pregunta ---------- */

/* Inicia el contador de 20 segundos. */
function iniciarTimer() {

  /* Reiniciamos el tiempo a 20 segundos. */
  tiempoRestante = 20;

  /* Mostramos el tiempo inicial en pantalla. */
  timerTexto.innerText =
    "Tiempo: " + tiempoRestante;


  /* setInterval ejecuta una función cada determinada cantidad
     de milisegundos. En este caso, cada 1000 ms = 1 segundo. */
  intervaloTimer = setInterval(function () {

    /* Restamos un segundo. */
    tiempoRestante = tiempoRestante - 1;

    /* Actualizamos el texto del contador. */
    timerTexto.innerText =
      "Tiempo: " + tiempoRestante;


    /* Si llega a cero, detenemos el intervalo
       y contamos la respuesta como incorrecta. */
    if (tiempoRestante <= 0) {

      clearInterval(intervaloTimer);

      responder(null);
    }

  }, 1000);
}


/* ---------- Carga y muestra una pregunta nueva ---------- */

/* Esta función obtiene una nueva pregunta
   y la muestra en pantalla. */
async function cargarPregunta() {

  /* Mientras esperamos la respuesta de la API,
     mostramos un mensaje de carga. */
  textoPregunta.innerText =
    "Cargando pregunta...";


  /* Esperamos a que la API nos devuelva una pregunta. */
  preguntaActual =
    await obtenerPreguntaGeografia();


  /* Si la API falló, mostramos un mensaje de error
     y no iniciamos el temporizador. */
  if (preguntaActual === null) {

    textoPregunta.innerText =
      "No se pudo cargar la pregunta. Revisá tu conexión e intentá de nuevo.";

    opcion0.innerText = "";
    opcion1.innerText = "";
    opcion2.innerText = "";

    return;
  }


  /* Mezclamos las tres opciones para que
     la respuesta correcta no aparezca siempre en el mismo lugar. */
  const opcionesMezcladas =
    mezclarArray(preguntaActual.opciones);


  /* Mostramos el texto de la pregunta. */
  textoPregunta.innerText =
    preguntaActual.texto;


  /* Mostramos las tres opciones mezcladas. */
  opcion0.innerText = opcionesMezcladas[0];
  opcion1.innerText = opcionesMezcladas[1];
  opcion2.innerText = opcionesMezcladas[2];


  /* Una vez cargada la pregunta, comienza el contador. */
  iniciarTimer();
}


/* ---------- Procesa la respuesta del jugador ---------- */

/* Esta función se ejecuta cuando el jugador
   elige una de las tres opciones. */
function responder(opcionElegida) {

  /* Detenemos el timer porque ya se respondió. */
  clearInterval(intervaloTimer);


  /* Comparamos la respuesta elegida
     con la respuesta correcta de la pregunta actual. */
  if (opcionElegida === preguntaActual.correcta) {

    /* Si coincide, sumamos un acierto. */
    aciertos = aciertos + 1;

  } else {

    /* Si no coincide, sumamos un error. */
    errores = errores + 1;
  }


  /* Actualizamos los contadores que aparecen en pantalla. */
  actualizarContadores();


  /* Si llegó a 3 errores, termina el juego como perdido. */
  if (errores >= maxErrores) {

    terminarJuego(false);


  /* Si llegó a la cantidad de aciertos necesaria,
     termina el juego como completado. */
  } else if (rondaActual >= metaAciertos) {

    terminarJuego(true);


  /* Si todavía puede continuar,
     pasamos a la siguiente pregunta. */
  } else {

    rondaActual = rondaActual + 1;

    cargarPregunta();
  }
}


/* ---------- Pantalla de fin de juego ---------- */

/* Esta función muestra el resultado final.
   "completo" indica si el juego terminó por completar
   las preguntas o por quedarse sin intentos. */
function terminarJuego(completo) {

  /* Ocultamos la parte del juego. */
  estadoJuegoDiv.hidden = true;

  /* Ocultamos la pregunta actual. */
  preguntaActualDiv.hidden = true;

  /* Mostramos la pantalla de resultado. */
  resultadoFinalDiv.hidden = false;


  /* Mostramos la cantidad de aciertos obtenidos. */
  puntajeFinal.innerText = aciertos;


  /* Si completó las 15 preguntas y acertó todas,
     mostramos el mensaje de mejor resultado. */
  if (completo && aciertos === totalRondas) {

    mensajeFinal.innerText =
      "¡Completaste las 15 preguntas! Tenés un montón de calle, seguí pateándola.";


  /* Si completó las 15 pero tuvo algunos errores,
     mostramos un mensaje diferente. */
  } else if (completo) {

    mensajeFinal.innerText =
      "¡Completaste las 15 preguntas, pero te falta calle! Seguí pateándola.";


  /* Si perdió por llegar a 3 errores,
     mostramos el mensaje correspondiente. */
  } else {

    mensajeFinal.innerText =
      "Te quedaste sin intentos. Te falta calle!!!";
  }


  /* Guardamos el puntaje obtenido en el ranking. */
  guardarEnRankings("recordPreguntas", aciertos);
}


/* ---------- Reinicia el juego desde cero ---------- */

/* Vuelve todos los valores del juego a su estado inicial. */
function reiniciarJuego() {

  /* Reiniciamos la pregunta. */
  rondaActual = 1;

  /* Reiniciamos los aciertos y errores. */
  aciertos = 0;
  errores = 0;


  /* Ocultamos el resultado final. */
  resultadoFinalDiv.hidden = true;

  /* Volvemos a mostrar el juego. */
  estadoJuegoDiv.hidden = false;
  preguntaActualDiv.hidden = false;


  /* Actualizamos los contadores. */
  actualizarContadores();

  /* Cargamos una nueva pregunta. */
  cargarPregunta();
}


/* ---------- Arranca el juego cuando se toca "Empezar a jugar" ---------- */

/* Esta función inicia el juego por primera vez. */
function empezarJuego() {

  /* Ocultamos la pantalla inicial. */
  pantallaInicio.hidden = true;

  /* Mostramos el juego. */
  estadoJuegoDiv.hidden = false;
  preguntaActualDiv.hidden = false;


  /* Actualizamos los contadores. */
  actualizarContadores();

  /* Cargamos la primera pregunta. */
  cargarPregunta();
}


/* ---------- Evento del botón "Empezar a jugar" ---------- */

/* addEventListener permite detectar una acción del usuario.
   En este caso, cuando hace click en el botón,
   se ejecuta empezarJuego. */
btnEmpezarJuego.addEventListener(
  "click",
  empezarJuego
);


/* ---------- Eventos de los botones de opciones ---------- */

/* Cuando se hace click en la primera opción,
   enviamos su texto a la función responder. */
opcion0.addEventListener("click", function () {
  responder(opcion0.innerText);
});


/* Lo mismo para la segunda opción. */
opcion1.addEventListener("click", function () {
  responder(opcion1.innerText);
});


/* Y para la tercera opción. */
opcion2.addEventListener("click", function () {
  responder(opcion2.innerText);
});


/* Cuando se hace click en "Jugar de nuevo",
   reiniciamos completamente el juego. */
btnJugarDeNuevo.addEventListener(
  "click",
  reiniciarJuego
);
```
