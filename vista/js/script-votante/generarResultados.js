import { getCandiadatosPartidoLocalidad, getDatosCensoUsuario, getDatosUsuario, getElecciones, getLocalidades, getPartidosYVotosAutonomica, getPartidosYVotosGenerales } from "./apiVotante.js";

await mostrarContenido();

async function mostrarContenido() {
    const main = document.querySelector('main');

    main.innerHTML = `
        <div id="modalPadreInsert"></div>
        <h1>RESULTADOS DE LAS ELECCIONES</h1>
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
        const elecciones = await getElecciones();
        console.log(elecciones);
        let divGenerales = document.getElementById('elecciones-container-generales');
        let divAutonomicas = document.getElementById('elecciones-container-autonomicas');

        if (!divGenerales || !divAutonomicas) {
            console.error("No se encontraron los contenedores de elecciones");
            return;
        }

        elecciones.eleccion.forEach(eleccion => {
            if (eleccion.estado === 'finalizada') {
                let eleccionDiv = document.createElement('div');
                eleccionDiv.className = 'eleccion';
                eleccionDiv.innerHTML = `
                    <img style="width: 10vw; height: auto; margin: 10px;" src="../../img/${eleccion.tipo === 'general' ? '96.jpg' : 'autonomicas.png'}" alt="${eleccion.tipo}">
                    <p><strong>Elección ${eleccion.tipo} nº:</strong> ${eleccion.idEleccion}</p>
                    <p><strong>Fecha Inicio:</strong> ${eleccion.fechaInicio}</p>    
                    <p><strong>Fecha Fin:</strong> ${eleccion.fechaFin}</p>
                `;

                if (eleccion.tipo === 'general') {
                    eleccionDiv.addEventListener("click", async () => {
                        await mostrarResultadosEleccionGeneral(eleccion.idEleccion);
                    });
                    divGenerales.appendChild(eleccionDiv);
                } else if (eleccion.tipo === 'autonomica') {
                    eleccionDiv.addEventListener("click", async () => {
                        await mostrarResultadosEleccionAutonomica(eleccion.idEleccion);
                    });
                    divAutonomicas.appendChild(eleccionDiv);
                }
            }
        });

    } catch (error) {
        console.error("Error al cargar elecciones:", error);
    }
}

async function mostrarResultadosEleccionGeneral(idEleccion) {
    let main = document.querySelector('main');

    main.innerHTML = `
        <h1>RESULTADOS DE LAS ELECCIONES GENERALES</h1>
        <div class="partidos-generales-container"></div>
    `;

    const partidosYvotosGenerales = await getPartidosYVotosGenerales(idEleccion);

    partidosYvotosGenerales.forEach(partido => {
        let partidoDiv = document.createElement('div');
        partidoDiv.className = 'partido';
        partidoDiv.innerHTML = `
            <img style="width: 10vw; height: auto; margin: 10px;" src="data:image/jpeg;base64,${partido.imagen}" alt="${partido.siglas}">
            <p><strong>Partido:</strong> ${partido.siglas}</p>
            <p><strong>Nombre:</strong> ${partido.nombre}</p>
            <p><strong>Votos:</strong> ${partido.total_votos}</p>
        `;
        main.querySelector('.partidos-generales-container').appendChild(partidoDiv);
    });
}

async function mostrarResultadosEleccionAutonomica(idEleccion) {
    let main = document.querySelector('main');

    main.innerHTML = `
        <h1>RESULTADOS DE LAS ELECCIONES AUTONÓMICAS</h1>
        <form id="form-eleccion-autonomica">
            <select class='select-localidades-autonomicas'></select>
        </form>
        <div class="partidos-autonomicos-container"></div>
    `;

    let selectLocalidades = document.querySelector('.select-localidades-autonomicas');
    const localidades = await getLocalidades();

    localidades.localidades.forEach(localidad => {
        let option = document.createElement('option');
        option.value = localidad.idLocalidad;
        option.textContent = localidad.nombre;
        selectLocalidades.appendChild(option);
    });

    const datosUsuario = await getDatosUsuario();
    const datosCenso = await getDatosCensoUsuario(datosUsuario.idCenso);
    selectLocalidades.value = datosCenso.censo.idLocalidad;

    await cargarResultadosAutonomicos(idEleccion, selectLocalidades.value);

    selectLocalidades.addEventListener('change', async () => {
        await cargarResultadosAutonomicos(idEleccion, selectLocalidades.value);
    });
}

async function cargarResultadosAutonomicos(idEleccion, idLocalidad) {
    let main = document.querySelector('main');
    let container = main.querySelector('.partidos-autonomicos-container');
    container.innerHTML = '';

    const partidosYvotosAutonomica = await getPartidosYVotosAutonomica(idEleccion, idLocalidad);
    console.log(partidosYvotosAutonomica);
    partidosYvotosAutonomica.forEach(async partido => {
        let partidoDiv = document.createElement('div');
        partidoDiv.className = 'partido';
        partidoDiv.innerHTML = `
            <img style="width: 10vw; height: auto; margin: 10px;" src="data:image/jpeg;base64,${partido.imagen}" alt="${partido.siglas}">
            <p><strong>Partido:</strong> ${partido.siglas}</p>
            <p><strong>Nombre:</strong> ${partido.nombre}</p>
            <p><strong>Votos:</strong> ${partido.total_votos}</p>
            <div class="candidatos-container"></div>
        `;

        container.appendChild(partidoDiv);

        let candidatosPartidoLocalidad = await getCandiadatosPartidoLocalidad(partido.idPartido, idLocalidad, idEleccion);
        console.log(candidatosPartidoLocalidad);
        let candidatosContainer = partidoDiv.querySelector('.candidatos-container');

        candidatosPartidoLocalidad.candidatos.forEach((candidato, index) => {
            let candidatoDiv = document.createElement('div');
            candidatoDiv.className = 'candidato';
            candidatoDiv.innerHTML = `
                <p><strong>Candidato:nº${index+1}</strong></p>
                <p><strong>Nombre:</strong> ${candidato.nombre}</p>
            `;
            candidatosContainer.appendChild(candidatoDiv);
        });
    });
}
