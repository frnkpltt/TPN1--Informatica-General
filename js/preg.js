let rondaActual = 1;
const totalRondas = 15;

let aciertos = 0;
let errores = 0;
const maxErrores = 3;

let tiempoRestante = 15;
let intervaloTimer = null;

let preguntaActual = null;


const contadorRonda = document.querySelector("#contador-ronda");
const timerTexto = document.querySelector("#timer");
const contadorAciertos = document.querySelector("#contador-aciertos");
const contadorErrores = document.querySelector("#contador-errores");

const textoPregunta = document.querySelector("#texto-pregunta");
const opcion0 = document.querySelector("#opcion-0");
const opcion1 = document.querySelector("#opcion-1");
const opcion2 = document.querySelector("#opcion-2");

const preguntaActualDiv = document.querySelector("#pregunta-actual");
const resultadoFinalDiv = document.querySelector("#resultado-final");
const mensajeFinal = document.querySelector("#mensaje-final");
const btnJugarDeNuevo = document.querySelector("#btn-jugar-de-nuevo");

/*  trae una pregunta de geografia desde Georef  */

async function obtenerPreguntaGeografia() {
  // Traemos 50 localidades al azar (con su provincia incluida)
  const respuestaLocalidades = await fetch("https://apis.datos.gob.ar/georef/api/localidades?max=50&campos=nombre,provincia");
  const datosLocalidades = await respuestaLocalidades.json();
  const localidades = datosLocalidades.localidades;

  // elegimos UNA localidad al azar
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

    if (nombreProvincia !== provinciaCorrecta && !incorrectas.includes(nombreProvincia)) {
      incorrectas.push(nombreProvincia);
    }
  }

  const pregunta = {
    texto: "¿A qué provincia pertenece la localidad de " + nombreLocalidad + "?",
    correcta: provinciaCorrecta,
    opciones: [provinciaCorrecta, incorrectas[0], incorrectas[1]]
  };

  return pregunta;
}

/*  mezcla un array (para que la correcta no este siempre primera) */

function mezclarArray(array) {
  const copia = array.slice();
  const resultado = [];

  while (copia.length > 0) {
    const indice = Math.floor(Math.random() * copia.length);
    resultado.push(copia[indice]);
    copia.splice(indice, 1);
  }

  return resultado;
}

/*  actualiza los contadores en pantalla  */

function actualizarContadores() {
  contadorRonda.innerText = "Pregunta " + rondaActual + " de " + totalRondas;
  contadorAciertos.innerText = "Aciertos: " + aciertos;
  contadorErrores.innerText = "Errores: " + errores + " / " + maxErrores;
}

/* Timer de cada pregunta  */

function iniciarTimer() {
  tiempoRestante = 15;
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
  const opcionesMezcladas = mezclarArray(preguntaActual.opciones);

  textoPregunta.innerText = preguntaActual.texto;
  opcion0.innerText = opcionesMezcladas[0];
  opcion1.innerText = opcionesMezcladas[1];
  opcion2.innerText = opcionesMezcladas[2];

  
  iniciarTimer();
}

/*  Procesa la respuesta del jugador  */

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
  preguntaActualDiv.hidden = true;
  resultadoFinalDiv.hidden = false;

  if (completo) {
    mensajeFinal.innerText = "¡Completaste las 15 preguntas! Acertaste " + aciertos + ".";
  } else {
    mensajeFinal.innerText = "Te quedaste sin intentos. Acertaste " + aciertos + " de " + rondaActual + " preguntas.";
  }
}

/*  Reinicia el juego desde cero  */

function reiniciarJuego() {
  rondaActual = 1;
  aciertos = 0;
  errores = 0;

  resultadoFinalDiv.hidden = true;
  preguntaActualDiv.hidden = false;

  actualizarContadores();
  cargarPregunta();
}

/*  Eventos de los botones de opciones */

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

/*  Arranca el juego al cargar la pagina  */

actualizarContadores();
