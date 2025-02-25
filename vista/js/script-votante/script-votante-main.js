import { crearBotonCerrarSesion } from "../main-content/utilidades.js";
import { getCandidatos } from "./apiVotante.js";
mostrarContenido();

async function mostrarContenido(){
    const main = document.querySelector('main');

    const botonCerrarSesion = crearBotonCerrarSesion();

    const header = createHeader();

    const h1 = document.createElement('h1');

    const divContenido = document.createElement('div');

    h1.textContent = `PANEL DE VOTACION`;
    const divEleccionesGenerales = document.createElement('div');
    divEleccionesGenerales.className = 'divElecciones';
    divEleccionesGenerales.id = 'divEleccionesGenerales';

    const contenidoEleccionesGenerales = await fillEleccionesGenerales();

    const divEleccionesAutonomicas = document.createElement('div');
    divEleccionesAutonomicas.className = 'divElecciones';
    divEleccionesAutonomicas.id = 'divEleccionesAutonomicas';
    
    divContenido.appendChild(divEleccionesGenerales);
    divContenido.appendChild(divEleccionesAutonomicas);

    main.appendChild(botonCerrarSesion);
    main.appendChild(header);
    main.appendChild(h1);
    main.appendChild(divContenido);
}

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

async function fillEleccionesGenerales(){
    const candidatos = await getCandidatos();
    candidatos.forEach(candidato => {
        console.log(candidato);
    });
}