// Referencias del DOM 
const recordCartasEl = document.getElementById('record-cartas');
const recordDadosEl = document.getElementById('record-dados');
const recordPreguntasEl = document.getElementById('record-preguntas');

// Lee un record de localStorage y lo muestra en el elemento indicado. 
// Si la clave todavia no existe (getItem devuelve null), muestra el mensaje de "sin record" en vez de un numero
function mostrarRecord(clave, elemento) {
    const valorGuardado = localStorage.getItem(clave);

    if (valorGuardado === null) {
        elemento.textContent = 'No hay records todavia';
    } else {
        elemento.textContent = valorGuardado;
    }
}

mostrarRecord('recordCartas', recordCartasEl);
mostrarRecord('recordDados', recordDadosEl);
mostrarRecord('recordPreguntas', recordPreguntasEl);