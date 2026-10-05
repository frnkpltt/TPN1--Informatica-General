/* ===========================================================
   ranking.js
   Página de rankings: lee el top 5 de puntajes que guardó cada juego
   en localStorage y lo muestra como una lista numerada.

   Cada juego guarda su top 5 con una clave propia:
     "recordCartas"    -> Quién es Quién
     "recordDados"     -> Diez Mil
     "recordPreguntas" -> juego de preguntas
   Esas claves tienen que coincidir EXACTAMENTE con las que usa cada
   juego al guardar: si una no coincide, ese ranking aparece vacío
   aunque el juego esté guardando bien.
   =========================================================== */

// Referencias del DOM: las tres listas (<ol>) de la página, una por juego
const recordCartasEl = document.getElementById('record-cartas');
const recordDadosEl = document.getElementById('record-dados');
const recordPreguntasEl = document.getElementById('record-preguntas');

// Lee el top 5 guardado en localStorage para un juego y lo muestra
// como lista. Recibe la clave de localStorage y la lista (<ol>) donde
// se va a mostrar.
function mostrarRankings(clave, elementoLista) {
    // Puntajes que se van a mostrar. Arranca vacía y solo se llena si
    // lo guardado resulta ser válido.
    let historial = [];

    // Si lo guardado no es una lista válida (dato viejo o corrupto),
    // lo tratamos como si no hubiera nada en vez de romper la página.
    // try/catch: JSON.parse tira un error si el texto guardado no tiene
    // formato JSON válido; con el catch ese error no corta el script.
    try {
        // Si la clave todavía no existe (nunca se guardó nada),
        // localStorage.getItem devuelve null, por eso el "|| '[]'":
        // así JSON.parse siempre recibe un texto válido (un array vacío).
        const datos = JSON.parse(localStorage.getItem(clave) || '[]');
        // Array.isArray comprueba que lo guardado sea realmente una lista.
        // Si es otra cosa (por ejemplo un número suelto que guardó una
        // versión anterior de un juego), no se usa.
        if (Array.isArray(datos)) {
            historial = datos;
        }
    } catch (error) {
        historial = [];
    }

    // Si no hay puntajes, se muestra un mensaje en la lista y se corta
    // la función con return.
    if (historial.length === 0) {
        elementoLista.innerHTML = '<li>No hay puntajes guardados.</li>';
        return;
    }

    // Se vacía la lista y se agrega un <li> por cada puntaje. Los puntajes
    // ya se guardaron ordenados de mayor a menor (lo hace guardarEnRankings
    // en cada juego), así que el primero de la lista es el mejor.
    elementoLista.innerHTML = '';
    historial.forEach(puntaje => {
        const item = document.createElement('li');
        item.textContent = puntaje;
        elementoLista.append(item);
    });
}


// Se muestra el ranking de cada juego en su lista
mostrarRankings('recordCartas', recordCartasEl);
mostrarRankings('recordDados', recordDadosEl);
mostrarRankings('recordPreguntas', recordPreguntasEl);