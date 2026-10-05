/* ===========================================================
   diezmil.js
   Juego de dados "Diez Mil": el jugador y la computadora van
   sumando puntos y gana quien llega primero a 10.000.

   Estructura del archivo:
     1. Referencias al DOM
     2. Estado del juego (variables)
     3. Récord: partidas ganadas por visita
     4. Dados: imágenes y animación
     5. Reglas: tirar un dado y calcular los puntos
     6. Turno de la computadora
     7. Botones del jugador (Tirar dados y Plantarse)
     8. Fin de partida, reinicio y guardado del récord
   =========================================================== */


// ---------- 1. Referencias al DOM ----------
// Cada elemento de la página se busca una sola vez con getElementById
// y se guarda en una constante, para usarlo después sin volver a buscarlo.


// Botones de juego
const btnTirar = document.getElementById("btnTirar");
const btnPlantarse = document.getElementById("btnPlantarse");


// Los 5 dados (son elementos <img>)
const dado1 = document.getElementById("dado1");
const dado2 = document.getElementById("dado2");
const dado3 = document.getElementById("dado3");
const dado4 = document.getElementById("dado4");
const dado5 = document.getElementById("dado5");


// Textos de la pantalla que el juego va actualizando 
const puntajeTurno = document.getElementById("puntajeTurno");           // puntos acumulados en el turno actual
const puntajeJugadorHTML = document.getElementById("puntajeJugador");   // puntaje total del jugador


const puntajePCHTML = document.getElementById("puntajePC"); //Puntos PC.
const jugadorActualHTML = document.getElementById("jugadorActual"); // Actualiza el turno.

// Zona de mensajes para el jugador ("Seguís jugando…", "¡Ganaste!", etc.)
const mensajeJuego = document.getElementById("mensajeJuego");

// Botón que aparece recién cuando termina la partida
const btnJugarDeNuevo = document.getElementById("btnJugarDeNuevo");


// ---------- 2. Estado del juego ----------
// Son variables (let) y no constantes porque cambian durante la partida.

// Valor (de 1 a 6) de cada uno de los 5 dados en la última tirada
let dados = [0, 0, 0, 0, 0];
 
// Puntos acumulados en el turno actual, todavía sin sumar al puntaje total
let puntosTurno = 0;

// Puntaje total del jugador (los puntos que ya "guardó" al plantarse)
let puntajeJugador = 0;

// Quién puede actuar ahora. Tiene tres valores posibles:
//   "jugador"     -> los botones responden
//   "computadora" -> juega la máquina y los botones no hacen nada
//   "finalizado"  -> la partida terminó
let turno = "jugador";

// Puntaje total de la computadora
let puntajeComputadora = 0;

// Es true si el jugador ya tiró al menos una vez en este turno.
// Sirve para que no pueda "plantarse" sin haber tirado.
let yaTiro = false;

// ---------- 3. Récord: partidas ganadas por visita ----------

// Cuántas partidas le ganó el jugador a la computadora desde que abrió
// la página. "Jugar de nuevo" NO lo reinicia: solo vuelve a 0 cuando el
// jugador se va de la página (ver el evento pagehide, más abajo).
let partidasGanadas = 0;
const partidasGanadasEl = document.getElementById("puntaje");


// Guarda un puntaje en el top 5 histórico de localStorage.
// Es la misma función que usan el juego de cartas y el de preguntas;
// cada juego tiene su propia copia porque cada página carga su propio
// script. Cada juego la llama con su clave: "recordCartas",
// "recordDados" o "recordPreguntas".
function guardarEnRankings(clave, puntajeNuevo) {
    // localStorage solo guarda texto: se lee el texto guardado y se lo
    // convierte a array con JSON.parse. Si todavía no hay nada guardado,
    // getItem devuelve null y el "|| '[]'" usa un array vacío en su lugar.
    const historial = JSON.parse(localStorage.getItem(clave) || '[]');
    historial.push(puntajeNuevo);
    historial.sort((a, b) => b - a); // Orden descendente (de mayor a menor)
    const top5 = historial.slice(0, 5); // Solo los 5 mejores
    // Se vuelve a convertir a texto con JSON.stringify para guardarlo
    localStorage.setItem(clave, JSON.stringify(top5));
}

// ---------- 4. Dados: imágenes y animación ----------

// Imagen que se muestra mientras el dado "gira". También es la imagen
// inicial, antes de la primera tirada. Si cambian los nombres de archivo
// o la carpeta, es lo único que hay que tocar en el JS.
const IMG_GIRANDO = "img/dados.png";


// Una imagen por cada cara del dado. El índice 0 queda vacío (null) a
// propósito: así CARAS_DADO[3] es directamente la imagen del dado que
// muestra el 3, sin restar 1 cada vez.
const CARAS_DADO = [
    null,
    "img/caras-dados/1.png",
    "img/caras-dados/2.png",
    "img/caras-dados/3.png",
    "img/caras-dados/4.png",
    "img/caras-dados/5.png",
    "img/caras-dados/6.png"
];

// Los 5 dados juntos en un array, para poder recorrerlos con un for
// en vez de repetir el mismo código cinco veces.
const dadosImg = [dado1, dado2, dado3, dado4, dado5];

// Muestra el dado "girando" medio segundo y después lo deja en la cara
// que realmente salió (valorFinal). La clase "rodando" le da un giro
// por CSS mientras dura ese medio segundo.
function animarDado(img, valorFinal) {
    img.src = IMG_GIRANDO;
    img.classList.add("rodando");

    // setTimeout ejecuta la función una sola vez, a los 500 milisegundos.
    // El resto del código NO espera: sigue corriendo mientras el dado gira.
    setTimeout(function() {
        img.src = CARAS_DADO[valorFinal];
        // El texto alternativo describe la cara que salió (accesibilidad)
        img.alt = "Dado que muestra " + valorFinal;
        img.classList.remove("rodando");
    }, 500);
}

// ---------- 5. Reglas: tirar un dado y calcular los puntos ----------

// Devuelve un número entero al azar entre 1 y 6 (la cara de un dado).
// Math.random() da un decimal entre 0 y 1 (sin llegar a 1). Multiplicado
// por 6 y con Math.floor (que se queda con la parte entera) da de 0 a 5,
// y el +1 lo corre a 1-6.

function tirarDado() {
    return Math.floor(Math.random() * 6) + 1;
}


// Calcula los puntos de UNA tirada a partir del array con los 5 valores.
// Devuelve 0 si la tirada no suma nada. Las reglas son:
//   - Tres o más dados iguales (un "trío"): el trío de 1 vale 1000 y
//     cualquier otro vale el número × 100 (por ejemplo, tres 2 = 200).
//   - Cada 1 que no forma parte de un trío vale 100.
//   - Cada 5 que no forma parte de un trío vale 50.
// Ojo con el nombre: el parámetro "dados" tapa a la variable global
// "dados" de arriba (scope). Dentro de la función se usa el array que
// se recibe como parámetro.
function calcularPuntos(dados) {

    let puntos = 0;

    // Contamos cuántas veces aparece cada número. cantidades[3] es la
    // cantidad de dados que salieron 3. Hay 7 posiciones (0 a 6) para
    // poder usar el valor del dado directamente como índice; la posición
    // 0 no se usa porque no existe la cara 0.

    let cantidades = [0, 0, 0, 0, 0, 0, 0];

    for (let dado of dados) {
        cantidades[dado]++;
    }


    // Revisamos cada número del 1 al 6: si salió tres o más veces,
    // hay un trío y se suman sus puntos

    for (let numero = 1; numero <= 6; numero++) {

        if (cantidades[numero] >= 3) {

            // El trío de 1 es un caso especial: vale 1000.
            // Los demás valen el número × 100.
            if (numero === 1) {
                puntos += 1000;
            } else {
                puntos += numero * 100;
            }
            
            // Descontamos los 3 dados que se usaron en el trío. Si salieron
            // más (por ejemplo, cuatro 1), los que sobran todavía pueden
            // sumar como 1 o 5 sueltos, abajo.
            cantidades[numero] -= 3;
        }
    }


    // Los 1 que quedaron sueltos valen 100

    puntos += cantidades[1] * 100;


    // Los 5 que quedaron sueltos valen 50

    puntos += cantidades[5] * 50;


    return puntos;
}


// ---------- 6. Turno de la computadora ----------

// La computadora hace UNA sola tirada por turno: suma lo que le salga y
// no toma ninguna decisión (no decide si seguir tirando o plantarse).

function jugarTurnoComputadora() {

    // Mientras dura este turno, los botones del jugador no responden:
    // btnTirar y btnPlantarse ignoran el click si turno no es "jugador".

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

    // Se revisa si la computadora ganó con estos puntos. Si ganó, se corta
    // la función acá con return: comprobarGanador() ya dejó el turno en
    // "finalizado" y no hay que devolverle el turno al jugador.
    if (comprobarGanador()) {
        return;
    }

    // Vuelve el turno al jugador

    turno = "jugador";
    jugadorActualHTML.textContent = "Jugador";

}
// ---------- 7. Botones del jugador ----------

// Click en Tirar dados. Funciones para seguir jugando/plantarse o perder el turno.
// Una tirada puede terminar de dos maneras:
//   - Sin puntos: el jugador pierde lo acumulado en el turno y juega la computadora.
//   - Con puntos: se acumulan al turno y puede seguir tirando o plantarse.

btnTirar.addEventListener("click", function() {

    // Si no es el turno del jugador (juega la computadora o terminó la
    // partida), el click se ignora.
    if (turno !== "jugador") {
    return; }

    // Se tiran los 5 dados y se guarda cada resultado
    dados[0] = tirarDado();
    dados[1] = tirarDado();
    dados[2] = tirarDado();
    dados[3] = tirarDado();
    dados[4] = tirarDado();

    // Cada dado "tira" con animación y recién a los 500ms queda
    // mostrando su valor real. Los puntos se calculan enseguida, sin
    // esperar a que termine la animación.
    for (let i = 0; i < dadosImg.length; i++) {
        animarDado(dadosImg[i], dados[i]);
    }

    // Puntos de ESTA tirada
    let puntos = calcularPuntos(dados);


    if (puntos === 0) {

    // Tirada sin puntos: se pierde todo lo acumulado en el turno 
    puntosTurno = 0;
    puntajeTurno.textContent = puntosTurno;

    mensajeJuego.textContent =
        "¡No sumaste puntos! Perdés el turno.";

    yaTiro = false;
    // El turno pasa a la computadora
    jugarTurnoComputadora(); } 

    else {

    // La tirada suma: se acumula a los puntos del turno. Todavía no son
    // del puntaje total: eso pasa recién cuando el jugador se planta.    
    puntosTurno += puntos;
    puntajeTurno.textContent = puntosTurno;

    mensajeJuego.textContent =
        "Seguís jugando o podés plantarte.";

    yaTiro = true; }

});

// Click en Plantarse. Función para sumar los puntos del turno.

btnPlantarse.addEventListener("click", function() {

    // Se ignora el click si no es el turno del jugador    
    if (turno !== "jugador") {
        return;
    }

    // No se puede plantar sin haber tirado antes en este turno
    if (!yaTiro) {
        mensajeJuego.textContent =
            "Primero tenés que tirar los dados.";
        return;
    }

    // Se guardan los puntos del turno en el puntaje total
    puntajeJugador += puntosTurno;

    puntajeJugadorHTML.textContent =
        puntajeJugador + " puntos";

    // Si con estos puntos el jugador llegó a 10.000, la partida terminó:
    // se corta acá y la computadora ya no juega.    
    if (comprobarGanador()) {
    return; }

    // Se reinicia el turno del jugador

    puntosTurno = 0;
    puntajeTurno.textContent = puntosTurno;

    yaTiro = false;

    // Juega la computadora

    jugarTurnoComputadora();

});

// ---------- 8. Fin de partida, reinicio y guardado del récord ----------

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

// Vuelve todo al estado inicial para empezar una partida nueva.
// No toca partidasGanadas: ese contador sigue hasta que el jugador
// se va de la página.
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

// Revisa si alguien llegó a 10.000 puntos. Devuelve true si la partida
// terminó y false si sigue. Quien la llama usa ese resultado para cortar
// con return.
// Está declarada al final del archivo pero se usa antes (en
// jugarTurnoComputadora y en el botón Plantarse): funciona porque las
// funciones declaradas se "elevan" (hoisting) y están disponibles desde
// el principio.
function comprobarGanador() {

    if (puntajeJugador >= 10000) {

        mensajeJuego.textContent = "¡Ganaste! Llegaste a 10.000 puntos.";
        // Cuenta como una partida ganada para el récord de la visita
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