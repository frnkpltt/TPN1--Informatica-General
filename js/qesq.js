// Array de personajes. Cada uno es un objeto con sus atributos en
// true/false, para poder comparar contra la pregunta que elija
// el usuario en el <select>. 

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
        nombre: 'Freddy Mercury', foto: 'img/cartas/freddy.png', esMujer: false, esArgentino: false, esMusico: true,
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
        nombre: 'La Mona Gimenez', foto: 'img/cartas/lamona.png', esMujer: false, esArgentino: true, esMusico: true, 
        esFiguraDeEspectaculo: true, esDeportista: false, esEmpresario: false, sigueConVida: true, esPersonajeDeFiccion: false,
        esPolitico: false, esArtista: true
    }, 
    {
        nombre: 'La Negra Vernaci', foto: 'img/cartas/lanegra.png', esMujer: true, esArgentino: true, esMusico: false, 
        esFiguraDeEspectaculo: true, esDeportista: false, esEmpresario: false, sigueConVida: true, esPersonajeDeFiccion: false,
        esPolitico: false, esArtista: false
    }, 
    {
        nombre: 'Maddona', foto: 'img/cartas/maddona.png', esMujer: true, esArgentino: false, esMusico: true, 
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
        esFiguraDeEspectaculo: false, esDeportista: false, esEmpresario: true, sigueConVida: false, esPersonajeDeFiccion: false,
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
// Puntaje acumulado de aciertos en la sesión — reiniciar arma una ronda
// nueva pero NO resetea esto, es un contador de toda la partida
let puntaje = 0;

// Referencias del DOM
const tablero = document.getElementById('tablero');
const selectPersonaje = document.getElementById('select-personaje');
const selectPregunta = document.getElementById('select-pregunta');
const btnPreguntar = document.getElementById('btn-preguntar');
const btnAdivinar = document.getElementById('btn-adivinar');
const respuestaEl = document.getElementById('respuesta');
const resultadoFinalEl = document.getElementById('resultado-final');
const btnReiniciar = document.getElementById('btn-reiniciar');
const puntajeEl = document.getElementById('puntaje');

// Guarda un puntaje nuevo en el top 5 historico de localStorage para un juego. Reutilizable por los tres juegos del sitio: cada uno la llama con su propia clave
    function guardarEnRankings(clave, puntajeNuevo) {
        const historial = JSON.parse(localStorage.getItem(clave) || '[]');
        historial.push(puntajeNuevo);
        historial.sort((a, b) => b - a); // Orden descendente
        const top5 = historial.slice(0, 5); // Solo los 5 mejores
        localStorage.setItem(clave, JSON.stringify(top5));
    }

// arma el tablero; una carta por personaje

personajes.forEach(personaje => {
  const carta = document.createElement('article');
  carta.classList.add('carta');

  const img = document.createElement('img');
  img.src = personaje.foto;
  img.alt = personaje.nombre;

  const nombre = document.createElement('p');
  nombre.textContent = personaje.nombre;

  carta.append(img, nombre);
  tablero.append(carta);

  carta.addEventListener('click', () => {
    carta.classList.toggle('descartada');
  });
});

// Arma las opciones del select de "adivinar" a partir del mismo array,
// para no tener que escribir los 25 nombres dos veces (HTML y JS)
personajes.forEach(personaje => {
  const opcion = document.createElement('option');
  opcion.value = personaje.nombre;
  opcion.textContent = personaje.nombre;
  selectPersonaje.append(opcion);
});
 
// Elige el personaje secreto al azar entre los 25
let indiceSecreto = Math.floor(Math.random() * personajes.length);
let personajeSecreto = personajes[indiceSecreto];
 
// TODO: btnPreguntar -> leer selectPregunta.value (el nombre del atributo)
// y usar personajeSecreto[valor] con corchetes para responder Sí/No en respuestaEl
btnPreguntar.addEventListener('click', () => {
  const atributoElegido = selectPregunta.value;

  if (atributoElegido === '') {
    respuestaEl.textContent = 'Elegí una pregunta primero.';
    return;
  }

  const esVerdad = personajeSecreto[atributoElegido];
  respuestaEl.textContent = esVerdad ? 'Sí' : 'No';
});
 
// TODO: btnAdivinar -> comparar selectPersonaje.value contra personajeSecreto.nombre
btnAdivinar.addEventListener('click', () => {
    const nombreElegido = selectPersonaje.value;

    if (nombreElegido === '') {
        resultadoFinalEl.textContent = 'Elegí un personaje primero.';
        return;
    }

    if (nombreElegido === personajeSecreto.nombre) {
            puntaje++;
            puntajeEl.textContent = puntaje;
            resultadoFinalEl.textContent = '¡Correcto! Era ' + personajeSecreto.nombre + '.';
    } else {
        resultadoFinalEl.textContent = 'Incorrecto. Era ' + personajeSecreto.nombre + '.';
        guardarEnRankings('recordCartas', puntaje);
    }

    btnPreguntar.disabled = true;
    btnAdivinar.disabled = true;
    selectPregunta.disabled = true;
    selectPersonaje.disabled = true;
});

btnReiniciar.addEventListener('click', () => {
  // Elige un nuevo personaje secreto
  indiceSecreto = Math.floor(Math.random() * personajes.length);
  personajeSecreto = personajes[indiceSecreto];

  // Destapa todas las cartas descartadas de un saque
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