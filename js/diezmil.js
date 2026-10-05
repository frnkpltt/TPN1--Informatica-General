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


// Array para guardar los valores de los dados y variables para puntajes y turnos

let dados = [0, 0, 0, 0, 0];
 
let puntosTurno = 0;

let puntajeJugador = 0;

let turno = "jugador";

let puntajeComputadora = 0;

let yaTiro = false;

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

    dado1.textContent = dados[0];
    dado2.textContent = dados[1];
    dado3.textContent = dados[2];
    dado4.textContent = dados[3];
    dado5.textContent = dados[4];


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

function comprobarGanador() {

    if (puntajeJugador >= 10000) {

        mensajeJuego.textContent = "¡Ganaste! Llegaste a 10.000 puntos.";
        turno = "finalizado";

        return true;
    }

    if (puntajeComputadora >= 10000) {

        mensajeJuego.textContent = "¡Ganó la computadora!";
        turno = "finalizado";

        return true;
    }

    return false;
}