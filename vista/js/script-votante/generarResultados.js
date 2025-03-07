import * as apiVotante from './apiVotante.js';
import { crearBotonCerrarSesion } from "../main-content/utilidades.js";

async function mostrarContenido() {
    const userInfo = await apiVotante.getDatosUsuario();
    console.log(userInfo);
    const main = document.querySelector('main');
    main.innerHTML = "";

    // Crear y agregar elementos en el orden correcto
    const botonCerrarSesion = crearBotonCerrarSesion();
    const header = createHeader();
    const h1 = createHeading('RESULTADOS DE LA VOTACION');
    const h2 = createHeading('ELIGE UNA DE LAS VOTACIONES FINALIZADAS');

    // Obtener elecciones y mostrar la lista
    const elecciones = await apiVotante.getElecciones();
    console.log(elecciones);

    const divElecciones = createDivElecciones(elecciones.eleccion);

    // Mostrar todo en el DOM
    main.appendChild(botonCerrarSesion);
    main.appendChild(header);
    main.appendChild(h1);
    main.appendChild(h2);
    main.appendChild(divElecciones);  // Mostrar las elecciones
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

function createHeading(text) {
    const heading = document.createElement(text.startsWith('RESULTADOS') ? 'h1' : 'h2');
    heading.textContent = text;
    return heading;
}

function createDivElecciones(elecciones) {
    const divElecciones = document.createElement('div');
    divElecciones.className = 'divElecciones';

    elecciones.forEach(eleccionA => {
        if (eleccionA.estado === 'finalizada') {
            const divEleccion = createEleccionDiv(eleccionA);
            divElecciones.appendChild(divEleccion);
        }
    });

    return divElecciones;
}

function createEleccionDiv(eleccion) {
    const divEleccion = document.createElement('div');
    divEleccion.className = 'eleccion';
    const img = createEleccionImage(eleccion);
    const nombre = createEleccionName(eleccion);

    divEleccion.appendChild(img);
    divEleccion.appendChild(nombre);

    divEleccion.style.margin = '10px';
    divEleccion.style.height= '20vh';
    
    divEleccion.addEventListener('mouseover', () => {
        divEleccion.style.cursor = 'pointer';
    });

    divEleccion.addEventListener('click', async () => {
        console.log(eleccion.idEleccion);
        await createDivResultados(eleccion.idEleccion);
    });

    return divEleccion;
}

function createEleccionImage(eleccion) {
    const img = document.createElement('img');
    img.style.width = '5vw';
    img.style.height = 'auto';
    img.src = eleccion.tipo === 'general' ? '../../img/96.jpg' : '../../img/autonomicas.png';
    return img;
}

function createEleccionName(eleccion) {
    const nombre = document.createElement('p');
    nombre.textContent = `Eleccion ${eleccion.tipo} nº ${eleccion.idEleccion}`;
    return nombre;
}

async function createDivResultados(idEleccion) {
    const main = document.querySelector('main');
    main.innerHTML = '';  // Limpiamos el contenido de main

    // Crear el contenedor de resultados
    const divResultadosContenedor = document.createElement('div');
    divResultadosContenedor.className = 'resultadosContenedor';

    // Crear los partidos y mostrarlos
    const divPartidos = document.createElement('div');
    divPartidos.className = 'divPartidosResultado';

    // Obtener los partidos de la elección seleccionada
    const partidosJSON = await apiVotante.getPartidos(idEleccion);
    console.log(partidosJSON);
    for (const partido of partidosJSON.partidos) {
        const partidoDiv = document.createElement('div');
        partidoDiv.style.border = '1px solid white';
        partidoDiv.style.borderRadius = '10px';
        partidoDiv.style.margin = '10px';
        partidoDiv.className = 'partidoResultado';
        partidoDiv.textContent = partido.nombre;
        divPartidos.appendChild(partidoDiv);
        const candidatosJSON = await apiVotante.getCandidatosPartido(partido.idPartido);
        if(candidatosJSON) {
            candidatosJSON.candidatos.forEach((candidato, index) => {
                const nombre = document.createElement('p');
                nombre.textContent = `PREFERENCIA ${index+1}: ${candidato.nombre}`;
                divPartidos.appendChild(nombre);
            });
        }

    }

    // Añadir los partidos al contenedor
    divResultadosContenedor.appendChild(divPartidos);

    // Crear el gráfico de resultados
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'canvasContainer';
    const canvas = document.createElement('canvas');
    canvas.id = 'resultadosChart';
    canvasContainer.appendChild(canvas);
    divResultadosContenedor.appendChild(canvasContainer);

    main.appendChild(divResultadosContenedor);

    // Renderizar el gráfico
    const ctx = canvas.getContext('2d');
    const resultadosJSON = await apiVotante.getResultadosEleccion(idEleccion);
    console.log(resultadosJSON);
    const partidos = resultadosJSON.resultados.map(p => p.nombre);
    const votos = resultadosJSON.resultados.map(p => p.votos);

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: partidos,
            datasets: [{
                label: 'Votos por Partido',
                data: votos,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF9800'],
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return `${tooltipItem.label}: ${tooltipItem.raw} votos`;
                        }
                    }
                }
            }
        }
    });

    // Crear el botón de "VOLVER"
    const botonVolver = document.createElement('button');
    botonVolver.textContent = 'VOLVER';
    botonVolver.className = 'botonVolver';
    botonVolver.addEventListener('click', async() => {
        // Redirigir a la página anterior o a una sección específica
        await mostrarContenido()
    });

    // Añadir el botón al contenedor de resultados
    divResultadosContenedor.appendChild(botonVolver);
}

await mostrarContenido();
