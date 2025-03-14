import { crearBotonCerrarSesion } from "../main-content/utilidades.js";
import { getPartidos, getDatosCensoUsuario, getElecciones, getDatosUsuario, votar } from "./apiVotante.js";

document.addEventListener('DOMContentLoaded', () => {
    mostrarContenido();
});

// 🔹 Función para obtener las elecciones en las que el usuario NO ha votado
async function obtenerEleccionesNoVotadas() {
    try {
        // 1️⃣ Obtener los datos del usuario desde las cookies
        const usuario = await getDatosUsuario();
        console.log(usuario.eleccionesVotadas);
        const todasLasElecciones = await getElecciones();
        console.log(todasLasElecciones.eleccion);

        // 2️⃣ Filtrar las elecciones no votadas
        const eleccionesNoVotadas = todasLasElecciones.eleccion.filter(eleccion => 
            !usuario.eleccionesVotadas.includes(parseInt(eleccion.idEleccion))
        );

        console.log("Elecciones en las que el usuario NO ha votado (sin duplicados):", eleccionesNoVotadas);
        return eleccionesNoVotadas;
    } catch (error) {
        console.error("Error al obtener elecciones no votadas:", error);
        return [];
    }
}

async function mostrarContenido() {
    const main = document.querySelector('main');
    main.innerHTML = ""; // Limpiar contenido previo

    const botonCerrarSesion = crearBotonCerrarSesion();

    const header = createHeader();
    const h1 = document.createElement('h1');
    h1.textContent = "PANEL DE VOTACIÓN";

    const divContenido = document.createElement('div');
    divContenido.className = 'divContenido';

    const divEleccionesGenerales = document.createElement('div');
    divEleccionesGenerales.id = 'divEleccionesGenerales';

    const divEleccionesAutonomicas = document.createElement('div');
    divEleccionesAutonomicas.id = 'divEleccionesAutonomicas';

    divContenido.appendChild(divEleccionesGenerales);
    divContenido.appendChild(divEleccionesAutonomicas);

    main.appendChild(botonCerrarSesion);
    main.appendChild(header);
    main.appendChild(h1);
    main.appendChild(divContenido);

    // Obtener y mostrar elecciones en las que el usuario NO ha votado
    const eleccionesNoVotadas = await obtenerEleccionesNoVotadas();
    console.log(eleccionesNoVotadas);
    if (eleccionesNoVotadas.length === 0) {
        divContenido.innerHTML = "<p>Has votado en todas las elecciones abiertas.</p>";
        return;
    }

    eleccionesNoVotadas.forEach(eleccion => {
        if (eleccion.tipo === "general") {
            fillEleccion(divEleccionesGenerales, eleccion);
        } else if (eleccion.tipo === "autonomica") {
            fillEleccion(divEleccionesAutonomicas, eleccion);
        }
    });
}

// 🔹 Función para crear el encabezado con el logo
function createHeader() {
    const header = document.createElement('header');
    header.className = 'logoCivio';

    const a = document.createElement('a');
    a.href = '../main.php';

    const img = document.createElement('img');
    img.src = '../../img/logoCivio.png';

    a.appendChild(img);
    header.appendChild(a);
    return header;
}

// 🔹 Función para llenar los divs de elecciones
function fillEleccion(div, eleccion) {
    const eleccionDiv = document.createElement('div');
    eleccionDiv.className = 'eleccion';
    eleccionDiv.innerHTML = `
        <p><strong>Elección ${eleccion.tipo} nº:</strong> ${eleccion.idEleccion}</p>
        <p><strong>Estado:</strong> ${eleccion.estado}</p>
        <p><strong>Fecha Inicio:</strong> ${eleccion.fechaInicio}</p>
        <p><strong>Fecha Fin:</strong> ${eleccion.fechaFin}</p>
    `;

    eleccionDiv.addEventListener('click', () => mostrarPartidos(eleccion));
    div.appendChild(eleccionDiv);
}

// 🔹 Función para mostrar los partidos de una elección
async function mostrarPartidos(eleccion) {
    console.log("Elección seleccionada:", eleccion);

    const main = document.querySelector('main');
    main.innerHTML = ''; // Limpiar contenido

    const h1 = document.createElement('h1');
    h1.textContent = `Partidos de la Elección Nº ${eleccion.idEleccion}`;
    main.appendChild(h1);

    const divPartidos = document.createElement('div');
    divPartidos.id = 'divPartidos';

    try {
        const partidos = await getPartidos(eleccion.idEleccion);
        if (partidos.partidos.length > 0) {
            partidos.partidos.forEach(partido => {
                const partidoDiv = document.createElement('div');
                partidoDiv.className = 'partido';

                const nombrePartido = document.createElement('p');
                nombrePartido.textContent = partido.nombre;

                const imagenPartido = document.createElement('img');
                imagenPartido.src = "data:image/png;base64," + partido.imagen;

                partidoDiv.appendChild(nombrePartido);
                partidoDiv.appendChild(imagenPartido);
                divPartidos.appendChild(partidoDiv);

                partidoDiv.addEventListener('click', async () => {
                    console.log(partido);
                    await mostrarModal(partido, partido.idPartido, eleccion.idEleccion);
                });
            });
        } else {
            divPartidos.textContent = "No hay partidos disponibles para esta elección.";
        }

        const botonVolver = document.createElement('button');
        botonVolver.textContent = "VOLVER";
        botonVolver.addEventListener('click', () => {
            main.innerHTML = '';
            mostrarContenido();
        });

        main.appendChild(divPartidos);
        main.appendChild(botonVolver);
    } catch (error) {
        console.error("Error al obtener los partidos de la elección:", error);
    }
}

// 🔹 Función para mostrar un modal de confirmación de voto
async function mostrarModal(partido, idPartido, idEleccion) {
    const modal = document.createElement('div');
    modal.style.position = 'absolute';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = '#600000';
    modal.style.padding = '20px';
    modal.style.borderRadius = '10px';
    modal.style.border = '1px solid #ccc';
    modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    modal.style.zIndex = '9999';

    const mensaje = document.createElement('p');
    mensaje.textContent = `¿Deseas votar a ${partido.nombre}?`;
    modal.appendChild(mensaje);

    const botonSi = document.createElement('button');
    botonSi.textContent = 'SI';
    botonSi.addEventListener('click', async () => {
        const datosUsuario = await getDatosUsuario();
        const datosCenso = await getDatosCensoUsuario(datosUsuario.idCenso);

        const data = {
            idUsuario: datosUsuario.idUsuario,
            idEleccion: idEleccion,
            idPartido: idPartido,
            email: datosCenso.censo.email,
            idLocalidad: datosCenso.censo.idLocalidad,
            idCandidato: null
        };

        setTimeout(async () => {
            await votar(data);
            alert(`HAS VOTADO A ${partido.nombre}`);
            modal.remove();
           
        }, 1000);
    });
    const botonNo = document.createElement('button');
    botonNo.textContent = 'NO';
    botonNo.addEventListener('click', () => {
        modal.remove();
    })

    modal.appendChild(botonSi);
    modal.appendChild(botonNo);
    document.body.appendChild(modal);
}
