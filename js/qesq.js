/* ===========================================================
   qesq.js
   Juego de cartas "Quién es Quién". La computadora elige en secreto a
   un personaje y el jugador tiene que adivinar cuál es haciendo
   preguntas de Sí/No y descartando cartas del tablero.

   Estructura del archivo:
     1. Datos: el array de personajes
     2. Estado y referencias al DOM
     3. Récord: guardar el puntaje en el top 5
     4. Armado del tablero y del desplegable de "adivinar"
     5. Elección del personaje secreto
     6. Botón "Preguntar"
     7. Botón "Adivinar"
     8. Botón "Jugar de nuevo"
   =========================================================== */


// ---------- 1. Datos: el array de personajes ----------

// Cada personaje es un objeto con su nombre, la ruta de su foto y una
// serie de atributos en true/false (esMujer, esArgentino, esMusico,
// esFiguraDeEspectaculo, esDeportista, esEmpresario, esPolitico,
// esArtista, esPersonajeDeFiccion y sigueConVida).
//
// IMPORTANTE: el nombre de cada atributo tiene que ser EXACTAMENTE igual
// al "value" de la <option> correspondiente en el desplegable de
// preguntas del HTML (por ejemplo value="esMujer"). Así el juego busca la
// respuesta con personaje[atributo], sin escribir un if por cada pregunta.
//
// Para sumar o cambiar un personaje alcanza con editar este array: el
// tablero y el desplegable de "adivinar" se arman solos a partir de él.
const personajes = [
    {
        nombre: 'Belgrano', foto: 'img/cartas/belgrano.png', esMujer: false, esArgentino: true, esMusico: false, esFiguraDeEspectaculo: false, 
        esDeportista: false, sigueConVida: false, esPersonajeDeFiccion: false, esPolitico: true, esEmpresario: false, esArtista: false, 

    },
    {   
        nombre: 'Moria Casán', foto: 'img/cartas/moria.png', esMujer: true, esArgentino: true, esMusico: false, 
        esFiguraDeEspectaculo: true, esDeportista: false, esEmpresario: true, sigueConVida: true, esPersonajeDeFiccion: false, esPolitico: false, 
        esArtista: false
    },
    {
        nombre: 'Charly Garcia', foto: 'img/cartas/charly.png', esMujer: false, esArgentino: true, esMusico: true, 
        esFiguraDeEspectaculo: false, esDeportista: false, esEmpresario: false, sigueConVida: true, esPersonajeDeFiccion: false, esPolitico: false,
        esArtista: true
    },
    {
        nombre: 'Cristina Kirchner', foto: 'img/cartas/cristina.png', esMujer: true, esArgentino:true, esMusico: false, 
        esFiguraDeEspectaculo: false, esDeportista: false, esEmpresario: false, sigueConVida: true, esPersonajeDeFiccion: false, esPolitico: true, 
        esArtista: false
    }, 
    {
        nombre: 'Freddie Mercury', foto: 'img/cartas/freddy.png', esMujer: false, esArgentino: false, esMusico: true,
        esFiguraDeEspectaculo: true, esDeportista: false, esEmpresario: false, sigueConVida: false, esPersonajeDeFiccion: false, esPolitico: false, 
        esArtista: true
    }, 
    {
        nombre: 'Indio Solari', foto: 'img/cartas/indio.png', esMujer: false, esArgentino: true, esMusico: true, 
        esFiguraDeEspectaculo: false, esDeportista: false, esEmpresario: false, sigueConVida: false, esPersonajeDeFiccion: false,
        esPolitico: false, esArtista: true
    },   
    {
        nombre: 'Lali Esposito', foto: 'img/cartas/lali.png', esMujer: true, esArgentino: true, esMusico: true, 
        esFiguraDeEspectaculo: true, esDeportista: false, esEmpresario: false, sigueConVida: true, esPersonajeDeFiccion: false, 
        esPolitico: false, esArtista: true
    }, 
    {
        nombre: 'La Mona Jimenez', foto: 'img/cartas/lamona.png', esMujer: false, esArgentino: true, esMusico: true, 
        esFiguraDeEspectaculo: true, esDeportista: false, esEmpresario: false, sigueConVida: true, esPersonajeDeFiccion: false,
        esPolitico: false, esArtista: true
    }, 
    {
        nombre: 'La Negra Vernaci', foto: 'img/cartas/lanegra.png', esMujer: true, esArgentino: true, esMusico: false, 
        esFiguraDeEspectaculo: true, esDeportista: false, esEmpresario: false, sigueConVida: true, esPersonajeDeFiccion: false,
        esPolitico: false, esArtista: false
    }, 
    {
        nombre: 'Madonna', foto: 'img/cartas/maddona.png', esMujer: true, esArgentino: false, esMusico: true, 
        esFiguraDeEspectaculo: true, esDeportista: false, esEmpresario: false, sigueConVida: true, esPersonajeDeFiccion: false,
        esPolitico: false, esArtista: true
    },
    {   
        nombre: 'Juliana Gattas', foto: 'img/cartas/julianagattas.png', esMujer: true, esArgentino: true, esMusico: true, 
        esFiguraDeEspectaculo: false, esDeportista: false, esEmpresario: false, sigueConVida: true, esPersonajeDeFiccion: false,
        esPolitico: false, esArtista: true
    },
    {
        nombre: 'Maria Elena Walsh', foto: 'img/cartas/maria.png', esMujer: true, esArgentino: true, esMusico: false, 
        esFiguraDeEspectaculo: false, esDeportista: false, esEmpresario: false, sigueConVida: false, esPersonajeDeFiccion: false,
        esPolitico: false, esArtista: true
    },
    {
        nombre: 'Pappo', foto: 'img/cartas/pappo.png', esMujer: false, esArgentino: true, esMusico: true, 
        esFiguraDeEspectaculo: false, esDeportista: false, esEmpresario: false, sigueConVida: false, esPersonajeDeFiccion: false,
        esPolitico: false, esArtista: true
    },
    {
        nombre: 'Perón', foto: 'img/cartas/peron.png', esMujer: false, esArgentino: true, esMusico: false, 
        esFiguraDeEspectaculo: false, esDeportista: false, esEmpresario: false, sigueConVida: false, esPersonajeDeFiccion: false,
        esPolitico: true, esArtista: false
    },
    {
        nombre: 'Vivienne Westwood', foto: 'img/cartas/vivienne.png', esMujer: true, esArgentino: false, esMusico: false, 
        esFiguraDeEspectaculo: true, esDeportista: false, esEmpresario: false, sigueConVida: false, esPersonajeDeFiccion: false,
        esPolitico: false, esArtista: true
    },
    {
        nombre: 'Yayo', foto: 'img/cartas/yayo.png', esMujer: false, esArgentino: true, esMusico: false, 
        esFiguraDeEspectaculo: true, esDeportista: false, esEmpresario: false, sigueConVida: true, esPersonajeDeFiccion: false,
        esPolitico: false, esArtista: true
    }
]


// ---------- 2. Estado y referencias al DOM ----------

// Puntaje acumulado de aciertos en la sesión — reiniciar arma una ronda
// nueva pero NO resetea esto, es un contador de toda la partida
let puntaje = 0;

// Referencias del DOM: cada elemento de la página se busca una sola vez y
// se guarda en una constante para usarlo después.
const tablero = document.getElementById('tablero');                    // contenedor de las cartas
const selectPersonaje = document.getElementById('select-personaje');   // desplegable de "adivinar"
const selectPregunta = document.getElementById('select-pregunta');     // desplegable de preguntas
const btnPreguntar = document.getElementById('btn-preguntar');
const btnAdivinar = document.getElementById('btn-adivinar');
const respuestaEl = document.getElementById('respuesta');              // muestra la pregunta y su Sí/No
const resultadoFinalEl = document.getElementById('resultado-final');  // muestra si acertó o no al adivinar
const btnReiniciar = document.getElementById('btn-reiniciar');
const puntajeEl = document.getElementById('puntaje');


// ---------- 3. Récord: guardar el puntaje en el top 5 ----------

// Guarda un puntaje nuevo en el top 5 historico de localStorage para un juego. Reutilizable por los tres juegos del sitio: cada uno la llama con su propia clave
// (acá se usa con la clave 'recordCartas'; la página de rankings lee esa misma clave).
    function guardarEnRankings(clave, puntajeNuevo) {
        // localStorage solo guarda texto: se lee el texto guardado y se lo
        // convierte en array con JSON.parse. Si todavía no hay nada guardado,
        // getItem devuelve null y el "|| '[]'" usa un array vacío en su lugar.
        const historial = JSON.parse(localStorage.getItem(clave) || '[]');
        historial.push(puntajeNuevo);
        historial.sort((a, b) => b - a); // Orden descendente
        const top5 = historial.slice(0, 5); // Solo los 5 mejores
        // Se vuelve a convertir a texto con JSON.stringify para guardarlo
        localStorage.setItem(clave, JSON.stringify(top5));
    }


// ---------- 4. Armado del tablero y del desplegable de "adivinar" ----------

// arma el tablero; una carta por personaje
// forEach recorre el array y ejecuta la función una vez por cada personaje.

personajes.forEach(personaje => {
  // Cada carta es un <article> con la clase "carta", una imagen y el nombre
  const carta = document.createElement('article');
  carta.classList.add('carta');

  const img = document.createElement('img');
  img.src = personaje.foto;
  img.alt = personaje.nombre;

  const nombre = document.createElement('p');
  nombre.textContent = personaje.nombre;

  // Primero se arma la carta con sus partes y después se inserta en el tablero
  carta.append(img, nombre);
  tablero.append(carta);

  // Al tocar una carta se la descarta o se la vuelve a activar: toggle
  // agrega la clase "descartada" si no la tiene y la saca si ya la tiene
  // (el CSS le baja la opacidad). Este evento tiene que agregarse acá
  // adentro y no una sola vez afuera: en cada vuelta del forEach "carta"
  // es una carta distinta, y cada una necesita su propio evento.
  carta.addEventListener('click', () => {
    carta.classList.toggle('descartada');
  });
});

// Arma las opciones del select de "adivinar" a partir del mismo array,
// así no hay que escribir los nombres dos veces (en el HTML y en el JS)
// y si se agrega un personaje al array aparece solo en los dos lugares.
personajes.forEach(personaje => {
  const opcion = document.createElement('option');
  opcion.value = personaje.nombre;
  opcion.textContent = personaje.nombre;
  selectPersonaje.append(opcion);
});


// ---------- 5. Elección del personaje secreto ----------
 
// Elige el personaje secreto al azar entre los del array.
// Math.random() * personajes.length da un decimal entre 0 y la cantidad de
// personajes (sin llegar a ella); Math.floor lo convierte en un índice válido
// del array (de 0 a longitud - 1).
// Son let y no const porque "Jugar de nuevo" les asigna un valor nuevo.
let indiceSecreto = Math.floor(Math.random() * personajes.length);
let personajeSecreto = personajes[indiceSecreto];


// ---------- 6. Botón "Preguntar" ----------
 
// Responde Sí o No a la pregunta elegida, según el personaje secreto.
btnPreguntar.addEventListener('click', () => {
  // value de la opción elegida: el nombre de un atributo (por ejemplo
  // "esMujer"), o '' si todavía no se eligió ninguna pregunta
  const atributoElegido = selectPregunta.value;

  // Si no eligió nada, se avisa y se corta acá con return
  if (atributoElegido === '') {
    respuestaEl.textContent = 'Elegí una pregunta primero.';
    return;
  }

  // Texto visible de la opción elegida (no el value interno, sino
  // lo que el usuario realmente ve en el desplegable).
  // .options es la lista de <option> del select y .selectedIndex dice
  // cuál es la que está elegida.
  const textoPregunta = selectPregunta.options[selectPregunta.selectedIndex].textContent;

  // Notación con corchetes: el nombre del atributo no se conoce al escribir
  // el código, depende de la pregunta que elija el usuario. Por eso no se
  // puede escribir personajeSecreto.esMujer a mano: con corchetes la
  // propiedad se busca por el texto que tenga la variable.
  const esVerdad = personajeSecreto[atributoElegido];

  // Se muestra la pregunta junto con la respuesta para que dos "Sí" seguidos
  // se distingan. (esVerdad ? 'Sí' : 'No') es el operador ternario: si
  // esVerdad es true vale 'Sí' y si es false vale 'No'.
  respuestaEl.textContent = textoPregunta + ' → ' + (esVerdad ? 'Sí' : 'No');

  // "Flash" visual: saca la clase y la vuelve a poner un instante
  // después, para que la transición de CSS se vea de nuevo aunque el texto
  // sea el mismo que la vez anterior. La pausa de 10 milisegundos le da
  // tiempo al navegador de aplicar el cambio antes de volver a poner la clase.
  respuestaEl.classList.remove('resaltada');
  setTimeout(() => {
    respuestaEl.classList.add('resaltada');
  }, 10);
});


// ---------- 7. Botón "Adivinar" ----------
 
// El jugador elige quién cree que es y el juego compara con el personaje
// secreto. La ronda termina siempre al adivinar, acierte o no.
btnAdivinar.addEventListener('click', () => {
    // Nombre elegido en el desplegable ('' si no eligió nada)
    const nombreElegido = selectPersonaje.value;

    if (nombreElegido === '') {
        resultadoFinalEl.textContent = 'Elegí un personaje primero.';
        return;
    }

    // Se compara el nombre elegido con el del personaje secreto
    if (nombreElegido === personajeSecreto.nombre) {
            // Acierto: suma un punto y se actualiza el puntaje en pantalla
            puntaje++;
            puntajeEl.textContent = puntaje;
            resultadoFinalEl.textContent = '¡Correcto! Era ' + personajeSecreto.nombre + '.';
    } else {
        resultadoFinalEl.textContent = 'Incorrecto. Era ' + personajeSecreto.nombre + '.';
        // Al fallar se guarda en el top 5 el puntaje acumulado hasta este momento
        guardarEnRankings('recordCartas', puntaje);
    }

    // Termina la ronda (en los dos casos): se bloquea todo hasta que el
    // jugador apriete "Jugar de nuevo"
    btnPreguntar.disabled = true;
    btnAdivinar.disabled = true;
    selectPregunta.disabled = true;
    selectPersonaje.disabled = true;
});


// ---------- 8. Botón "Jugar de nuevo" ----------

// Arma una ronda nueva: otro personaje secreto, tablero completo y
// controles habilitados. NO reinicia el puntaje.
btnReiniciar.addEventListener('click', () => {
  // Elige un nuevo personaje secreto (el mismo sorteo de la sección 5)
  indiceSecreto = Math.floor(Math.random() * personajes.length);
  personajeSecreto = personajes[indiceSecreto];

  // Destapa todas las cartas descartadas de un saque: querySelectorAll
  // trae todas las que tienen la clase "descartada" y forEach le saca la
  // clase a cada una.
  const cartasDescartadas = document.querySelectorAll('.descartada');
  cartasDescartadas.forEach(carta => {
    carta.classList.remove('descartada');
  });

  // Limpia los mensajes
  respuestaEl.textContent = '';
  resultadoFinalEl.textContent = '';

  // Vuelve los selects a la opción vacía
  selectPregunta.value = '';
  selectPersonaje.value = '';

  // Rehabilita todo lo que quedó bloqueado al adivinar
  btnPreguntar.disabled = false;
  btnAdivinar.disabled = false;
  selectPregunta.disabled = false;
  selectPersonaje.disabled = false;
});