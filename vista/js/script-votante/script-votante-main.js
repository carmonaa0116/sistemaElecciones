import { getCandidatosPartido, getDatosCensoUsuario, getDatosUsuario, getEleccionesUsuario, getPartidos, getPartidosLocalidad, getPartidosLocalidadEleccion, votarAutonomica, votarGeneral } from "./apiVotante.js";
const datosUsuario = await getDatosUsuario();
const datosCensoUsuario = await getDatosCensoUsuario(datosUsuario.idCenso);
async function mostrarContenidoVotacion() {
    const main = document.querySelector('main');

    main.innerHTML = `
        <div id="modalPadreInsert"></div>
        <h1>PANEL DE VOTACION</h1>
        <div class="elecciones-container">
            <h2>ELECCIONES GENERALES</h2>
            <div id="elecciones-container-generales" class="elections-container"></div>
            <h2>ELECCIONES AUTONOMICAS</h2>
            <div id="elecciones-container-autonomicas" class="elections-container"></div>
        </div>
    `;

    let modalPadre = document.getElementById('modalPadreInsert');

    if (!modalPadre) {
        console.error("No se encontró modalPadreInsert en el DOM");
        return;
    }

    modalPadre.style.display = 'none';

    modalPadre.innerHTML = `
        <button type="submit" class="btn-close" id="cerrar">Cerrar</button>
        <div class="formularioModal">
            <h1>¿QUÉ QUIERES HACER CON LA ELECCIÓN?</h1>
            <div class="flexModalSection">
                <button id="btn-abrir">Abrir</button>
                <button id="btn-cerrar">Cerrar</button>
                <button id="btn-terminar">Terminar</button>
            </div>
        </div>
    `;

    await fillElecciones();
}

async function fillElecciones() {
    try {

        console.log(datosUsuario.idUsuario);
        const eleccionesUsuario = await getEleccionesUsuario(datosUsuario.idUsuario);
        console.log(eleccionesUsuario);
        if (!eleccionesUsuario || !eleccionesUsuario.elecciones) {
            console.error("No se recibieron elecciones");
            return;
        }

        let divGenerales = document.getElementById('elecciones-container-generales');
        let divAutonomicas = document.getElementById('elecciones-container-autonomicas');

        if (!divGenerales || !divAutonomicas) {
            console.error("No se encontraron los contenedores de elecciones");
            return;
        }

        eleccionesUsuario.elecciones.forEach(eleccion => {
            if (eleccion.estado === 'abierta') {
                if (eleccion.tipo === 'general') {
                    let eleccionDiv = document.createElement('div');
                    eleccionDiv.className = 'eleccion';
                    eleccionDiv.innerHTML = `
                        <img style="width: 10vw; height: auto; margin: 10px;" src="../../img/96.jpg" alt="general">
                        <p><strong>Elección general nº:</strong> ${eleccion.idEleccion}</p>
                        <p><strong>Fecha Inicio:</strong> ${eleccion.fechainicio}</p>    
                        <p><strong>Fecha Fin:</strong> ${eleccion.fechafin}</p>
                    `;

                    // Evento para elecciones generales
                    eleccionDiv.addEventListener("click", async () => {
                        await manejarVotoGeneral(eleccion.idEleccion);
                    });

                    divGenerales.appendChild(eleccionDiv);
                }

                if (eleccion.tipo === 'autonomica') {
                    let eleccionDiv = document.createElement('div');
                    eleccionDiv.className = 'eleccion';
                    eleccionDiv.innerHTML = `
                        <img style="width: 10vw; height: auto; margin: 10px;" src="../../img/autonomicas.png" alt="autonomica">
                        <p><strong>Elección autonómica nº:</strong> ${eleccion.idEleccion}</p>
                        <p><strong>Fecha Inicio:</strong> ${eleccion.fechainicio}</p>    
                        <p><strong>Fecha Fin:</strong> ${eleccion.fechafin}</p>
                    `;

                    // Evento para elecciones autonómicas
                    eleccionDiv.addEventListener("click", () => {
                        manejarVotoAutonomico(eleccion.idEleccion);
                    });

                    divAutonomicas.appendChild(eleccionDiv);
                }
            }
        });

    } catch (error) {
        console.error("Error al cargar elecciones:", error);
    }
}

// Funciones para manejar votos en distintos tipos de elecciones
async function manejarVotoGeneral(idEleccion) {
    const main = document.querySelector('main');
    //ELIMINO EL CONTENIDO ANTERIOR
    main.innerHTML = '';
    //GENERO EL CONTENIDO DE LAS VOTACIONES
    main.innerHTML = `
        <div id="modalPadreInsert"></div>
        <h1>PANEL DE VOTACION</h1>
        <h2>SELECCIONA AL PARTIDO QUE QUIERES VOTAR</h2>
        <div class="partidos-container">
            
        </div>
        <button id="btn-volver">VOLVER</button>
    `;

    // EN EL CASO DE DARLE AL BOTON DE VOLVER, VUELVO AL PANEL DE VOTACIONES
    const buttonVolver = document.getElementById('btn-volver');
    buttonVolver.addEventListener('click', () => {
        mostrarContenidoVotacion();
    });

    let modalPadre = document.getElementById('modalPadreInsert');
    modalPadre.style.display = 'none';

    let partidosContainer = document.querySelector('.partidos-container');
    const partidosJSON = await getPartidos();

    partidosJSON.partidos.forEach(partido => {
        console.log(partido);
        let partidoDiv = document.createElement('div');
        partidoDiv.innerHTML = `
            <img style="width: 10vw; height: auto; margin: 10px;" src="data:image/png;base64,${partido.imagen}" alt="autonomica">
            <p><strong>${partido.nombre}</strong></p>
        `;

        partidoDiv.addEventListener("click", async () => {
            let confirmarVoto = confirm(`¿Quieres votar a ${partido.nombre}?`);
            
            if (confirmarVoto) {
                const voto = await votarGeneral(idEleccion, partido.idPartido);
                console.log(voto);
                if (voto) {
                    await mostrarContenidoVotacion();
                } else {
                    alert('Error al votar: '+voto);
                }
            } else {
                alert("Has cancelado tu voto.");
            }
        });
        
        partidosContainer.appendChild(partidoDiv);
    });
}

async function manejarVotoAutonomico(idEleccion) {
    
    const main = document.querySelector('main');
    //ELIMINO EL CONTENIDO ANTERIOR
    main.innerHTML = '';
    //GENERO EL CONTENIDO DE LAS VOTACIONES
    main.innerHTML = `
        <div id="modalPadreInsert"></div>
        <h1>PANEL DE VOTACION</h1>
        <h2>SELECCIONA AL PARTIDO QUE QUIERES VOTAR</h2>
        <div class="partidos-container-autonomica">
            
        </div>
        <button id="btn-volver">VOLVER</button>
    `;

    // EN EL CASO DE DARLE AL BOTON DE VOLVER, VUELVO AL PANEL DE VOTACIONES
    const buttonVolver = document.getElementById('btn-volver');
    buttonVolver.addEventListener('click', () => {
        mostrarContenidoVotacion();
    });

    let modalPadre = document.getElementById('modalPadreInsert');
    modalPadre.style.display = 'none';

    let partidosContainer = document.querySelector('.partidos-container-autonomica');
    const idLocalidadUsuario = datosCensoUsuario.censo.idLocalidad;
    const partidosLocalidadEleccion = await getPartidosLocalidadEleccion(idLocalidadUsuario, idEleccion);
    console.log(partidosLocalidadEleccion)

    
    if (!Array.isArray(partidosLocalidadEleccion.partidos) || partidosLocalidadEleccion.partidos.length === 0) {  
        const p = document.createElement('p');
        console.log('NO HAY PARTIDOS EN TU LOCALIDAD');
        p.innerHTML = `<strong>NO HAY PARTIDOS EN TU LOCALIDAD PARA ESTA ELECCION</strong>`;
        partidosContainer.appendChild(p);
    }
    
    partidosLocalidadEleccion.partidos.forEach(async partido => {
        console.log(partido);
        let partidoDiv = document.createElement('div');
        const candidatosPartidoLocalidad = await getCandidatosPartido(idLocalidadUsuario);
        partidoDiv.innerHTML = `
        
            <img style="width: 10vw; height: auto; margin: 10px;" src="${partido.imagen}" alt="autonomica">
            <p><strong>${partido.nombre}</strong></p>
        `;

        candidatosPartidoLocalidad.candidatos.forEach((candidato, index) => {
            partidoDiv.innerHTML += `
                <p><strong>Candidato nº ${index + 1}: ${candidato.apellido}, ${candidato.nombre}</strong></p>
            `;
        });

    
        partidoDiv.addEventListener("click", async () => {
            let confirmarVoto = confirm(`¿Quieres votar a ${partido.nombre}?`);
            
            if (confirmarVoto) {
                const voto = await votarAutonomica(idEleccion, partido.idPartido);
                console.log(voto);
                if (voto) {
                    await mostrarContenidoVotacion();
                } else {
                    alert('Error al votar: '+voto);
                }
            } else {
                alert("Has cancelado tu voto.");
            }
        });
        
        partidosContainer.appendChild(partidoDiv);
    });

}

// Ejecutar la función principal
mostrarContenidoVotacion();
