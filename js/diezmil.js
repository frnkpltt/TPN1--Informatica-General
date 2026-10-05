// Declaración de constantes

const btnTirar = document.getElementById("btnTirar");
const btnPlantarse = document.getElementById("btnPlantarse");

const dado1 = document.getElementById("dado1");
const dado2 = document.getElementById("dado2");
const dado3 = document.getElementById("dado3");
const dado4 = document.getElementById("dado4");
const dado5 = document.getElementById("dado5");

const puntajeTurno = document.getElementById("puntajeTurno");
const puntajeJugadorHTML = document.getElementById("puntajeJugador");

const puntajePCHTML = document.getElementById("puntajePC"); //Puntos PC.
const jugadorActualHTML = document.getElementById("jugadorActual"); // Actualiza el turno.

// FIX: esta constante faltaba. El código usa mensajeJuego en varios lugares
// pero nunca se había declarado, y eso tiraba un ReferenceError.
const mensajeJuego = document.getElementById("mensajeJuego");

// Botón que aparece recién cuando termina la partida
const btnJugarDeNuevo = document.getElementById("btnJugarDeNuevo");


// Array para guardar los valores de los dados y variables para puntajes y turnos

let dados = [0, 0, 0, 0, 0];
 
let puntosTurno = 0;

let puntajeJugador = 0;

let turno = "jugador";

let puntajeComputadora = 0;

let yaTiro = false;

// ---------- Récord: partidas ganadas por visita ----------

// Cuántas partidas le ganó el jugador a la computadora desde que abrió
// la página. "Jugar de nuevo" NO lo reinicia: solo vuelve a 0 cuando el
// jugador se va de la página (ver el evento pagehide, más abajo).
let partidasGanadas = 0;
const partidasGanadasEl = document.getElementById("puntaje");

// Misma función que en el juego de cartas y en el de preguntas: guarda
// un puntaje en el top 5 histórico de localStorage
function guardarEnRankings(clave, puntajeNuevo) {
    const historial = JSON.parse(localStorage.getItem(clave) || '[]');
    historial.push(puntajeNuevo);
    historial.sort((a, b) => b - a); // Orden descendente
    const top5 = historial.slice(0, 5); // Solo los 5 mejores
    localStorage.setItem(clave, JSON.stringify(top5));
}

// ---------- Imágenes y animación de los dados ----------

// Si cambian los nombres de archivo o la carpeta, es lo único que hay
// que tocar en el JS.
const IMG_GIRANDO = "img/caras-dados/dado.png";

// El índice 0 queda vacío a propósito: así CARAS_DADO[3] es directamente
// la imagen del dado que muestra el 3, sin restar 1 cada vez.
const CARAS_DADO = [
    null,
    "img/caras-dados/1.png",
    "img/caras-dados/2.png",
    "img/caras-dados/3.png",
    "img/caras-dados/4.png",
    "img/caras-dados/5.png",
    "img/caras-dados/6.png"
];

const dadosImg = [dado1, dado2, dado3, dado4, dado5];

// Muestra el dado "girando" medio segundo y después lo deja en la cara
// que realmente salió (valorFinal). La clase "rodando" le da un giro
// por CSS mientras dura ese medio segundo.
function animarDado(img, valorFinal) {
    img.src = IMG_GIRANDO;
    img.classList.add("rodando");

    setTimeout(function() {
        img.src = CARAS_DADO[valorFinal];
        img.alt = "Dado que muestra " + valorFinal;
        img.classList.remove("rodando");
    }, 500);
}

// Función para darle valores aleatorios a los dados

function tirarDado() {
    return Math.floor(Math.random() * 6) + 1;
}


// Función que calcula los puntos del Jugador

function calcularPuntos(dados) {

    let puntos = 0;

    // Contamos cuántas veces aparece cada número

    let cantidades = [0, 0, 0, 0, 0, 0, 0];

    for (let dado of dados) {
        cantidades[dado]++;
    }


    // Función para revisar si hay tres dados iguales y calcular los puntos

    for (let numero = 1; numero <= 6; numero++) {

        if (cantidades[numero] >= 3) {

            if (numero === 1) {
                puntos += 1000;
            } else {
                puntos += numero * 100;
            }

            cantidades[numero] -= 3;
        }
    }


    // Los 1 que quedaron sueltos valen 100

    puntos += cantidades[1] * 100;


    // Los 5 que quedaron sueltos valen 50

    puntos += cantidades[5] * 50;


    return puntos;
}

// Función de turno de PC.

function jugarTurnoComputadora() {

    turno = "computadora";

    jugadorActualHTML.textContent = "Computadora";
    mensajeJuego.textContent = "Turno de la computadora...";


    // La PC tira los dados.
    let dadosPC = [
        tirarDado(),
        tirarDado(),
        tirarDado(),
        tirarDado(),
        tirarDado()
    ];

   
    // Se calculan los puntos de la PC.
    let puntosPC = calcularPuntos(dadosPC);

    if (puntosPC > 0) {
        puntajeComputadora += puntosPC;
        mensajeJuego.textContent =
            "La computadora sumó " + puntosPC + " puntos.";
    } else {
        mensajeJuego.textContent =
            "La computadora no sumó puntos.";
    }

    // Actualizamos el puntaje en pantalla

    puntajePCHTML.textContent = puntajeComputadora + " puntos";

    // FIX: ahora también se revisa si la computadora ganó con estos puntos.
    // Si ganó, cortamos acá: comprobarGanador() ya dejó turno = "finalizado"
    // y no hay que devolverle el turno al jugador.
    if (comprobarGanador()) {
        return;
    }

    // Vuelve el turno al jugador

    turno = "jugador";
    jugadorActualHTML.textContent = "Jugador";

}
// Click en Tirar dados. Funciones para seguir jugando/plantarse o perder el turno.

btnTirar.addEventListener("click", function() {
    if (turno !== "jugador") {
    return; }

    dados[0] = tirarDado();
    dados[1] = tirarDado();
    dados[2] = tirarDado();
    dados[3] = tirarDado();
    dados[4] = tirarDado();

    // Cada dado "tira" con animación y recién a los 500ms queda
    // mostrando su valor real
    for (let i = 0; i < dadosImg.length; i++) {
        animarDado(dadosImg[i], dados[i]);
    }


    let puntos = calcularPuntos(dados);


    if (puntos === 0) {

    puntosTurno = 0;
    puntajeTurno.textContent = puntosTurno;

    mensajeJuego.textContent =
        "¡No sumaste puntos! Perdés el turno.";

    yaTiro = false;
    jugarTurnoComputadora(); } 

    else {

    puntosTurno += puntos;
    puntajeTurno.textContent = puntosTurno;

    mensajeJuego.textContent =
        "Seguís jugando o podés plantarte.";

    yaTiro = true; }

});

// Click en Plantarse. Función para sumar los puntos del turno.

btnPlantarse.addEventListener("click", function() {

    if (turno !== "jugador") {
        return;
    }

    if (!yaTiro) {
        mensajeJuego.textContent =
            "Primero tenés que tirar los dados.";
        return;
    }

    // Se guardan los puntos del turno

    puntajeJugador += puntosTurno;

    puntajeJugadorHTML.textContent =
        puntajeJugador + " puntos";

    if (comprobarGanador()) {
    return; }

    // Se reinicia el turno del jugador

    puntosTurno = 0;
    puntajeTurno.textContent = puntosTurno;

    yaTiro = false;

    // Juega la computadora

    jugarTurnoComputadora();

});

// Deja el juego en estado "terminado": bloquea los botones de juego
// y muestra el de "Jugar de nuevo". Se llama desde comprobarGanador(),
// que es el único lugar por el que pasa tanto la victoria del jugador
// como la de la computadora.
function terminarPartida() {
    turno = "finalizado";
    btnTirar.disabled = true;
    btnPlantarse.disabled = true;
    btnJugarDeNuevo.hidden = false;
}

// Vuelve todo al estado inicial para empezar una partida nueva
function reiniciarPartida() {
    // Variables del juego
    dados = [0, 0, 0, 0, 0];
    puntosTurno = 0;
    puntajeJugador = 0;
    puntajeComputadora = 0;
    turno = "jugador";
    yaTiro = false;

    // Lo que se ve en pantalla
    for (let img of dadosImg) {
        img.src = IMG_GIRANDO;
        img.alt = "Dado sin tirar";
    }
    puntajeTurno.textContent = puntosTurno;
    puntajeJugadorHTML.textContent = "0 puntos";
    puntajePCHTML.textContent = "0 puntos";
    jugadorActualHTML.textContent = "Jugador";
    mensajeJuego.textContent = "¡Comenzá tu turno!";

    // Botones
    btnTirar.disabled = false;
    btnPlantarse.disabled = false;
    btnJugarDeNuevo.hidden = true;
}

btnJugarDeNuevo.addEventListener("click", reiniciarPartida);

// Cuando el jugador se va de la página (cierra la pestaña, recarga o
// entra a otra sección del sitio), se guarda cuántas partidas ganó y el
// contador vuelve a 0. Si no ganó ninguna, no se guarda nada.
window.addEventListener("pagehide", function() {
    if (partidasGanadas > 0) {
        guardarEnRankings("recordDados", partidasGanadas);
        partidasGanadas = 0;
        partidasGanadasEl.textContent = partidasGanadas;
    }
});

function comprobarGanador() {

    if (puntajeJugador >= 10000) {

        mensajeJuego.textContent = "¡Ganaste! Llegaste a 10.000 puntos.";
        partidasGanadas++;
        partidasGanadasEl.textContent = partidasGanadas;
        terminarPartida();

        return true;
    }

    if (puntajeComputadora >= 10000) {

        mensajeJuego.textContent = "¡Ganó la computadora!";
        terminarPartida();

        return true;
    }

    return false;
}