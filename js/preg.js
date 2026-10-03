/* ===========================================
   preguntas.js
   Juego "Cuán argentino sos?" - categoria geografia
   =========================================== */

/*  Variables globales del estado del juego */

let rondaActual = 1;
const totalRondas = 20;

let aciertos = 0;
let errores = 0;
const maxErrores = 3;

let tiempoRestante = 15;
let intervaloTimer = null;

let preguntaActual = null;

/* Referencias al DOM*/

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
 */

async function obtenerPreguntaGeografia() {
  try {
    // Traemos 50 localidades al azar (con su provincia incluida)
    const respuestaLocalidades = await fetch("https://apis.datos.gob.ar/georef/api/localidades?max=50&campos=nombre,provincia");
    const datosLocalidades = await respuestaLocalidades.json();
    const localidades = datosLocalidades.localidades;

    // Elegimos UNA localidad al azar
    const indiceAlAzar = Math.floor(Math.random() * localidades.length);
    const localidadElegida = localidades[indiceAlAzar];

    const nombreLocalidad = localidadElegida.nombre;
    const provinciaCorrecta = localidadElegida.provincia.nombre;

    // Traemos la lista de provincias para armar las 2 opciones incorrectas
    const respuestaProvincias = await fetch("https://apis.datos.gob.ar/georef/api/provincias?campos=nombre");
    const datosProvincias = await respuestaProvincias.json();
    const provincias = datosProvincias.provincias;

    const incorrectas = [];
    while (incorrectas.length < 2) {
      const indiceProvincia = Math.floor(Math.random() * provincias.length);
      const nombreProvincia = provincias[indiceProvincia].nombre;

      if (nombreProvincia !== provinciaCorrecta && !estaEnArray(nombreProvincia, incorrectas)) {
        incorrectas.push(nombreProvincia);
      }
    }

    const pregunta = {
      texto: "¿A qué provincia pertenece la localidad de " + nombreLocalidad + "?",
      correcta: provinciaCorrecta,
      opciones: [provinciaCorrecta, incorrectas[0], incorrectas[1]]
    };

    return pregunta;

  } catch (error) {
    // Si falla la conexion o la API no responde, avisamos y devolvemos null
    console.log("Error al obtener la pregunta:", error);
    return null;
  }
}

/* Chequea si un valor ya esta en un array (reemplaza a includes)  */

function estaEnArray(valor, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === valor) {
      return true;
    }
  }
  return false;
}

/*  Mezcla un array (para que la correcta no este siempre primera)  */

function mezclarArray(array) {
  const resultado = [];
  const indicesUsados = [];

  while (resultado.length < array.length) {
    const indice = Math.floor(Math.random() * array.length);

    if (!estaEnArray(indice, indicesUsados)) {
      indicesUsados.push(indice);
      resultado.push(array[indice]);
    }
  }

  return resultado;
}

/*  Actualiza los contadores en pantalla  */

function actualizarContadores() {
  contadorRonda.innerText = "Pregunta " + rondaActual + " de " + totalRondas;
  contadorErrores.innerText = "Errores: " + errores + " / " + maxErrores;
}

/* Timer de cada pregunta  */

function iniciarTimer() {
  tiempoRestante = 20;
  timerTexto.innerText = "Tiempo: " + tiempoRestante;

  intervaloTimer = setInterval(function () {
    tiempoRestante = tiempoRestante - 1;
    timerTexto.innerText = "Tiempo: " + tiempoRestante;

    // Si se acaba el tiempo, se responde como si hubiera fallado
    if (tiempoRestante <= 0) {
      clearInterval(intervaloTimer);
      responder(null);
    }
  }, 1000);
}

/*  Carga y muestra una pregunta nueva  */

async function cargarPregunta() {
  textoPregunta.innerText = "Cargando pregunta...";

  preguntaActual = await obtenerPreguntaGeografia();

  // Si la API fallo (obtenerPreguntaGeografia devolvio null),
  // avisamos al usuario y no arrancamos el timer
  if (preguntaActual === null) {
    textoPregunta.innerText = "No se pudo cargar la pregunta. Revisá tu conexión e intentá de nuevo.";
    opcion0.innerText = "";
    opcion1.innerText = "";
    opcion2.innerText = "";
    return;
  }

  const opcionesMezcladas = mezclarArray(preguntaActual.opciones);

  textoPregunta.innerText = preguntaActual.texto;
  opcion0.innerText = opcionesMezcladas[0];
  opcion1.innerText = opcionesMezcladas[1];
  opcion2.innerText = opcionesMezcladas[2];

  iniciarTimer();
}

/*  Procesa la respuesta del jugador */

function responder(opcionElegida) {
  clearInterval(intervaloTimer);

  if (opcionElegida === preguntaActual.correcta) {
    aciertos = aciertos + 1;
  } else {
    errores = errores + 1;
  }

  actualizarContadores();

  if (errores >= maxErrores) {
    terminarJuego(false);
  } else if (rondaActual >= totalRondas) {
    terminarJuego(true);
  } else {
    rondaActual = rondaActual + 1;
    cargarPregunta();
  }
}

/*  Pantalla de fin de juego  */

function terminarJuego(completo) {
  estadoJuegoDiv.hidden = true;
  preguntaActualDiv.hidden = true;
  resultadoFinalDiv.hidden = false;

  puntajeFinal.innerText = aciertos;

  if (completo) {
    mensajeFinal.innerText = "¡Completaste las 15 preguntas!";
  } else {
    mensajeFinal.innerText = "Te quedaste sin intentos.";
  }
}

/* Reinicia el juego desde cero  */

function reiniciarJuego() {
  rondaActual = 1;
  aciertos = 0;
  errores = 0;

  resultadoFinalDiv.hidden = true;
  estadoJuegoDiv.hidden = false;
  preguntaActualDiv.hidden = false;

  actualizarContadores();
  cargarPregunta();
}

/*  Arranca el juego cuando se toca "Empezar a jugar"  */

function empezarJuego() {
  pantallaInicio.hidden = true;
  estadoJuegoDiv.hidden = false;
  preguntaActualDiv.hidden = false;

  actualizarContadores();
  cargarPregunta();
}

btnEmpezarJuego.addEventListener("click", empezarJuego);

/* Eventos de los botones de opciones  */

opcion0.addEventListener("click", function () {
  responder(opcion0.innerText);
});

opcion1.addEventListener("click", function () {
  responder(opcion1.innerText);
});

opcion2.addEventListener("click", function () {
  responder(opcion2.innerText);
});

btnJugarDeNuevo.addEventListener("click", reiniciarJuego);