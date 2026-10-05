/* ===========================================
   DECLARACIÓN DE CONSTANTES
   =========================================== */

/* Buscamos los botones y elementos del HTML mediante su ID.
   getElementById permite conectar JavaScript con elementos del HTML. */

const btnTirar = document.getElementById("btnTirar");
const btnPlantarse = document.getElementById("btnPlantarse");

const dado1 = document.getElementById("dado1");
const dado2 = document.getElementById("dado2");
const dado3 = document.getElementById("dado3");
const dado4 = document.getElementById("dado4");
const dado5 = document.getElementById("dado5");

const puntajeTurno = document.getElementById("puntajeTurno");
const puntajeJugadorHTML = document.getElementById("puntajeJugador");

const puntajePCHTML = document.getElementById("puntajePC");
const jugadorActualHTML = document.getElementById("jugadorActual");


/* Esta constante conecta JavaScript con el mensaje
   que aparece en pantalla durante el juego. */
const mensajeJuego = document.getElementById("mensajeJuego");


/* Botón que solamente aparece cuando termina la partida. */
const btnJugarDeNuevo = document.getElementById("btnJugarDeNuevo");


/* ===========================================
   VARIABLES DEL ESTADO DEL JUEGO
   =========================================== */

/* Array que guarda los cinco valores de los dados.
   Al principio todos están en 0 porque todavía no se tiraron. */
let dados = [0, 0, 0, 0, 0];

/* Puntos acumulados durante el turno actual. */
let puntosTurno = 0;

/* Puntaje total del jugador. */
let puntajeJugador = 0;

/* Indica de quién es el turno actualmente. */
let turno = "jugador";

/* Puntaje total de la computadora. */
let puntajeComputadora = 0;

/* Indica si el jugador ya tiró los dados en este turno. */
let yaTiro = false;


/* ===========================================
   RÉCORD DE PARTIDAS GANADAS
   =========================================== */

/* Cuenta cuántas partidas ganó el jugador durante
   la visita actual a la página. */
let partidasGanadas = 0;


/* Elemento HTML donde se muestra ese contador. */
const partidasGanadasEl = document.getElementById("puntaje");


/* Esta función guarda un puntaje en el top 5 histórico.
   Se utiliza también en los otros juegos. */
function guardarEnRankings(clave, puntajeNuevo) {

    /* Recuperamos los puntajes anteriores desde localStorage.
       JSON.parse convierte el texto guardado en un array.
       Si no existe información, usamos un array vacío. */
    const historial =
        JSON.parse(localStorage.getItem(clave) || '[]');


    /* Agregamos el nuevo puntaje al historial. */
    historial.push(puntajeNuevo);


    /* Ordenamos los puntajes de mayor a menor. */
    historial.sort((a, b) => b - a);


    /* Nos quedamos solamente con los cinco mejores. */
    const top5 = historial.slice(0, 5);


    /* Guardamos nuevamente los datos en localStorage.
       JSON.stringify convierte el array en texto. */
    localStorage.setItem(
        clave,
        JSON.stringify(top5)
    );
}


/* ===========================================
   IMÁGENES Y ANIMACIÓN DE LOS DADOS
   =========================================== */

/* Imagen que se utiliza mientras el dado está girando. */
const IMG_GIRANDO = "img/dados.png";


/* Array que relaciona cada número del dado
   con su correspondiente imagen.
   
   La posición 0 queda vacía para que:
   CARAS_DADO[1] = imagen del 1,
   CARAS_DADO[2] = imagen del 2, etc. */
const CARAS_DADO = [
    null,
    "img/caras-dados/1.png",
    "img/caras-dados/2.png",
    "img/caras-dados/3.png",
    "img/caras-dados/4.png",
    "img/caras-dados/5.png",
    "img/caras-dados/6.png"
];


/* Guardamos los cinco elementos de imagen
   dentro de un único array para poder recorrerlos. */
const dadosImg = [
    dado1,
    dado2,
    dado3,
    dado4,
    dado5
];


/* ===========================================
   ANIMACIÓN DEL DADO
   =========================================== */

/* Esta función recibe:
   - la imagen del dado
   - el valor que finalmente salió */

function animarDado(img, valorFinal) {

    /* Primero mostramos la imagen del dado girando. */
    img.src = IMG_GIRANDO;


    /* Agregamos la clase CSS "rodando",
       que genera la animación. */
    img.classList.add("rodando");


    /* setTimeout espera 500 milisegundos
       antes de ejecutar esta función. */
    setTimeout(function() {

        /* Después de la animación mostramos
           la cara correspondiente al número obtenido. */
        img.src = CARAS_DADO[valorFinal];


        /* Actualizamos el texto alternativo de la imagen. */
        img.alt = "Dado que muestra " + valorFinal;


        /* Sacamos la clase de animación. */
        img.classList.remove("rodando");

    }, 500);
}


/* ===========================================
   TIRADA ALEATORIA
   =========================================== */

/* Genera un número aleatorio entre 1 y 6. */
function tirarDado() {

    /* Math.random() genera un número entre 0 y 1.
       Multiplicamos por 6, usamos Math.floor()
       y sumamos 1 para obtener un número del 1 al 6. */
    return Math.floor(Math.random() * 6) + 1;
}


/* ===========================================
   CÁLCULO DE PUNTOS
   =========================================== */

/* Esta función recibe el array de dados
   y calcula cuántos puntos consiguió la tirada. */
function calcularPuntos(dados) {

    /* Acumulador de puntos. */
    let puntos = 0;


    /* Array que cuenta cuántas veces aparece
       cada número de dado.

       Por ejemplo:
       cantidades[1] = cantidad de unos
       cantidades[5] = cantidad de cincos */
    let cantidades = [0, 0, 0, 0, 0, 0, 0];


    /* Recorremos todos los dados obtenidos. */
    for (let dado of dados) {

        /* Aumentamos el contador correspondiente
           al número que salió. */
        cantidades[dado]++;
    }


    /* Recorremos los números del 1 al 6
       para buscar tríos. */
    for (let numero = 1; numero <= 6; numero++) {

        /* Si aparecen tres o más dados iguales,
           tenemos un trío. */
        if (cantidades[numero] >= 3) {

            /* Tres unos valen 1000 puntos. */
            if (numero === 1) {
                puntos += 1000;

            /* Cualquier otro trío vale
               número x 100. */
            } else {
                puntos += numero * 100;
            }


            /* Restamos los tres dados utilizados
               para que no vuelvan a contar como dados sueltos. */
            cantidades[numero] -= 3;
        }
    }


    /* Los unos que quedaron sueltos valen 100 puntos cada uno. */
    puntos += cantidades[1] * 100;


    /* Los cincos que quedaron sueltos valen 50 puntos cada uno. */
    puntos += cantidades[5] * 50;


    /* Devolvemos el resultado final. */
    return puntos;
}


/* ===========================================
   TURNO DE LA COMPUTADORA
   =========================================== */

function jugarTurnoComputadora() {

    /* Cambiamos el turno a computadora. */
    turno = "computadora";


    /* Actualizamos lo que aparece en pantalla. */
    jugadorActualHTML.textContent = "Computadora";
    mensajeJuego.textContent =
        "Turno de la computadora...";


    /* La computadora tira cinco dados.
       Cada uno obtiene un número aleatorio. */
    let dadosPC = [
        tirarDado(),
        tirarDado(),
        tirarDado(),
        tirarDado(),
        tirarDado()
    ];


    /* Calculamos los puntos obtenidos por la computadora. */
    let puntosPC = calcularPuntos(dadosPC);


    /* Si consiguió puntos, los sumamos a su puntaje. */
    if (puntosPC > 0) {

        puntajeComputadora += puntosPC;

        mensajeJuego.textContent =
            "La computadora sumó " + puntosPC + " puntos.";

    } else {

        /* Si no consiguió puntos, mostramos otro mensaje. */
        mensajeJuego.textContent =
            "La computadora no sumó puntos.";
    }


    /* Actualizamos el puntaje de la computadora en pantalla. */
    puntajePCHTML.textContent =
        puntajeComputadora + " puntos";


    /* Comprobamos si la computadora llegó a 10.000.
       Si ganó, termina la partida y no vuelve el turno
       al jugador. */
    if (comprobarGanador()) {
        return;
    }


    /* Si nadie ganó, vuelve el turno al jugador. */
    turno = "jugador";

    jugadorActualHTML.textContent = "Jugador";
}


/* ===========================================
   BOTÓN "TIRAR DADOS"
   =========================================== */

/* addEventListener detecta cuando el usuario
   hace click en el botón. */
btnTirar.addEventListener("click", function() {

    /* Si no es el turno del jugador, no hacemos nada. */
    if (turno !== "jugador") {
        return;
    }


    /* Generamos un valor aleatorio para cada uno
       de los cinco dados. */
    dados[0] = tirarDado();
    dados[1] = tirarDado();
    dados[2] = tirarDado();
    dados[3] = tirarDado();
    dados[4] = tirarDado();


    /* Recorremos las imágenes de los cinco dados
       y animamos cada una. */
    for (let i = 0; i < dadosImg.length; i++) {
        animarDado(dadosImg[i], dados[i]);
    }


    /* Calculamos los puntos de la tirada. */
    let puntos = calcularPuntos(dados);


    /* ===========================================
       SI LA TIRADA NO DA PUNTOS
       =========================================== */

    if (puntos === 0) {

        /* Se pierden los puntos acumulados
           durante este turno. */
        puntosTurno = 0;

        puntajeTurno.textContent =
            puntosTurno;


        mensajeJuego.textContent =
            "¡No sumaste puntos! Perdés el turno.";


        /* Indicamos que todavía no realizó
           una tirada válida en el nuevo turno. */
        yaTiro = false;


        /* Después de perder el turno,
           juega automáticamente la computadora. */
        jugarTurnoComputadora();


    } else {

        /* Si consiguió puntos, los acumulamos
           en el turno actual. */
        puntosTurno += puntos;


        /* Mostramos los puntos del turno. */
        puntajeTurno.textContent =
            puntosTurno;


        mensajeJuego.textContent =
            "Seguís jugando o podés plantarte.";


        /* Indicamos que ya tiró y puede plantarse. */
        yaTiro = true;
    }
});


/* ===========================================
   BOTÓN "PLANTARSE"
   =========================================== */

btnPlantarse.addEventListener("click", function() {

    /* Solo puede plantarse el jugador
       cuando es su turno. */
    if (turno !== "jugador") {
        return;
    }


    /* No puede plantarse sin haber tirado primero. */
    if (!yaTiro) {

        mensajeJuego.textContent =
            "Primero tenés que tirar los dados.";

        return;
    }


    /* Sumamos los puntos acumulados durante el turno
       al puntaje total del jugador. */
    puntajeJugador += puntosTurno;


    /* Actualizamos el puntaje en pantalla. */
    puntajeJugadorHTML.textContent =
        puntajeJugador + " puntos";


    /* Comprobamos si el jugador llegó a 10.000.
       Si ganó, termina la partida. */
    if (comprobarGanador()) {
        return;
    }


    /* Reiniciamos los puntos del turno. */
    puntosTurno = 0;

    puntajeTurno.textContent =
        puntosTurno;


    /* Indicamos que todavía no tiró en el nuevo turno. */
    yaTiro = false;


    /* Ahora juega la computadora. */
    jugarTurnoComputadora();
});


/* ===========================================
   TERMINAR PARTIDA
   =========================================== */

/* Deja el juego en estado final. */
function terminarPartida() {

    /* Cambiamos el turno a "finalizado". */
    turno = "finalizado";


    /* Deshabilitamos los botones de juego. */
    btnTirar.disabled = true;
    btnPlantarse.disabled = true;


    /* Mostramos el botón para volver a jugar. */
    btnJugarDeNuevo.hidden = false;
}


/* ===========================================
   REINICIAR PARTIDA
   =========================================== */

/* Esta función devuelve todas las variables
   a su estado inicial. */
function reiniciarPartida() {

    /* Reiniciamos las variables del juego. */
    dados = [0, 0, 0, 0, 0];
    puntosTurno = 0;
    puntajeJugador = 0;
    puntajeComputadora = 0;
    turno = "jugador";
    yaTiro = false;


    /* Reiniciamos visualmente los dados. */
    for (let img of dadosImg) {
        img.src = IMG_GIRANDO;
        img.alt = "Dado sin tirar";
    }


    /* Reiniciamos los puntajes que aparecen en pantalla. */
    puntajeTurno.textContent =
        puntosTurno;

    puntajeJugadorHTML.textContent =
        "0 puntos";

    puntajePCHTML.textContent =
        "0 puntos";

    jugadorActualHTML.textContent =
        "Jugador";

    mensajeJuego.textContent =
        "¡Comenzá tu turno!";


    /* Volvemos a habilitar los botones. */
    btnTirar.disabled = false;
    btnPlantarse.disabled = false;

    /* Ocultamos nuevamente el botón "Jugar de nuevo". */
    btnJugarDeNuevo.hidden = true;
}


/* El botón "Jugar de nuevo" llama
   a la función que reinicia la partida. */
btnJugarDeNuevo.addEventListener(
    "click",
    reiniciarPartida
);


/* ===========================================
   GUARDAR PARTIDAS GANADAS
   =========================================== */

/* pagehide se ejecuta cuando el usuario
   abandona la página, la recarga o cambia de sección. */
window.addEventListener("pagehide", function() {

    /* Si ganó al menos una partida durante esta visita,
       guardamos ese número en el ranking. */
    if (partidasGanadas > 0) {

        guardarEnRankings(
            "recordDados",
            partidasGanadas
        );


        /* Reiniciamos el contador de esta visita. */
        partidasGanadas = 0;


        /* Actualizamos el número mostrado en pantalla. */
        partidasGanadasEl.textContent =
            partidasGanadas;
    }
});


/* ===========================================
   COMPROBAR GANADOR
   =========================================== */

/* Comprueba si alguno de los dos jugadores
   llegó a los 10.000 puntos. */
function comprobarGanador() {

    /* Si el jugador llegó a 10.000,
       gana la partida. */
    if (puntajeJugador >= 10000) {

        mensajeJuego.textContent =
            "¡Ganaste! Llegaste a 10.000 puntos.";


        /* Sumamos una partida ganada. */
        partidasGanadas++;


        /* Actualizamos el contador en pantalla. */
        partidasGanadasEl.textContent =
            partidasGanadas;


        /* Bloqueamos el juego. */
        terminarPartida();


        /* Devolvemos true para avisar
           que la partida terminó. */
        return true;
    }


    /* Si la computadora llegó a 10.000,
       gana la computadora. */
    if (puntajeComputadora >= 10000) {

        mensajeJuego.textContent =
            "¡Ganó la computadora!";


        /* Bloqueamos el juego. */
        terminarPartida();


        /* Avisamos que la partida terminó. */
        return true;
    }


    /* Si ninguno llegó a 10.000,
       la partida continúa. */
    return false;
}


