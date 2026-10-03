// Declaración de variables y constantes

const btnTirar = document.getElementById("btnTirar");
const btnPlantarse = document.getElementById("btnPlantarse");

const dado1 = document.getElementById("dado1");
const dado2 = document.getElementById("dado2");
const dado3 = document.getElementById("dado3");
const dado4 = document.getElementById("dado4");
const dado5 = document.getElementById("dado5");

const puntajeTurno = document.getElementById("puntajeTurno");
const puntajeJugadorHTML = document.getElementById("puntajeJugador");


// Array para guardar los valores de los dados

let dados = [0, 0, 0, 0, 0];
 
let puntosTurno = 0;

let puntajeJugador = 0;

let turno = "jugador";

// Función para darle valores aleatorios a los dados

function tirarDado() {
    return Math.floor(Math.random() * 6) + 1;
}


// Función que calcula los puntos

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


// Click en Tirar dados. Funciones para seguir jugando/plantarse o perder el turno.

btnTirar.addEventListener("click", function() {

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

        mensajeJuego.textContent = "¡No sumaste puntos! Perdés el turno.";

    } else {

        puntosTurno += puntos;

        puntajeTurno.textContent = puntosTurno;

        mensajeJuego.textContent = "Seguís jugando o podés plantarte.";

    }

});

// Click en Plantarse. Función para sumar los puntos del turno.
btnPlantarse.addEventListener("click", function() {

    puntajeJugador += puntosTurno;

    puntajeJugadorHTML.textContent = puntajeJugador + " puntos";

    puntosTurno = 0;

    puntajeTurno.textContent = puntosTurno;

});

