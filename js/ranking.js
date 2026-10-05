// Referencias del DOM 
const recordCartasEl = document.getElementById('record-cartas');
const recordDadosEl = document.getElementById('record-dados');
const recordPreguntasEl = document.getElementById('record-preguntas');

// Lee el top 5 guardado en localStorage para un juego y lo muestro
// como lista. Si la clave todavia no existe, (nunca se guardo nada), 
// localStorage.getItem devuelve null, por eso el "|| '[]'" para que JSON.parse reciba un string valido y no tire error
function mostrarRankings(clave, elementoLista) {
    let historial = [];

    // Si lo guardado no es una lista válida (dato viejo o corrupto),
    // lo tratamos como si no hubiera nada en vez de romper la página
    try {
        const datos = JSON.parse(localStorage.getItem(clave) || '[]');
        if (Array.isArray(datos)) {
            historial = datos;
        }
    } catch (error) {
        historial = [];
    }

    if (historial.length === 0) {
        elementoLista.innerHTML = '<li>No hay puntajes guardados.</li>';
        return;
    }

    elementoLista.innerHTML = '';
    historial.forEach(puntaje => {
        const item = document.createElement('li');
        item.textContent = puntaje;
        elementoLista.append(item);
    });
}


mostrarRankings('recordCartas', recordCartasEl);
mostrarRankings('recordDados', recordDadosEl);
mostrarRankings('recordPreguntas', recordPreguntasEl);