import { generarContenidoVotante } from './generarContenidoVotante.js';

export function generarContenidoAdministrador() {
    generarContenidoVotante();
    const main = document.querySelector("main");

    crearBotonGestionCandidatos(main);
    crearBotonGestionPartidos(main);
    crearBotonGestionElecciones(main);
    crearBotonGestionEscrutinio(main);
}

async function crearBotonGestionCandidatos(main) {
    const button = document.createElement('button');
    button.textContent = "GESTIÓN DE CANDIDATOS";
    button.addEventListener('click', async () => {
        await guardarCookieEleccion('eleccion', 'candidatos');
        window.location.href = '../html/admin/gestionAdmin.html';
    });
    main.appendChild(button);
}

async function crearBotonGestionPartidos(main) {
    const button = document.createElement('button');
    button.textContent = "GESTIÓN DE PARTIDOS";
    button.addEventListener('click', async () => {
        await guardarCookieEleccion('eleccion', 'partidos');
        window.location.href = '../html/admin/gestionAdmin.html';
    });
    main.appendChild(button);
}

async function crearBotonGestionElecciones(main) {
    const button = document.createElement('button');
    button.textContent = "GESTIÓN DE ELECCIONES";
    button.addEventListener('click', async () => {
        await guardarCookieEleccion('eleccion', 'elecciones');
        window.location.href = '../html/admin/gestionAdmin.html';
    });
    main.appendChild(button);
}

async function crearBotonGestionEscrutinio(main) {
    const button = document.createElement('button');
    button.textContent = "APERTURA O CIERRE DE ESCRUTINIO";
    button.addEventListener('click', async () => {
        await guardarCookieEleccion('eleccion', 'escrutinio');
        window.location.href = '../html/admin/gestionAdmin.html';
    });
    main.appendChild(button);
}


async function guardarCookieEleccion(nombre, valor) {
    const datos = {
        nombre: nombre,
        valor: valor
    };
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
    };
    return fetch('../../controlador/cookies/guardarCookie.php', fetchOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición a ' + response.url + ': ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}
