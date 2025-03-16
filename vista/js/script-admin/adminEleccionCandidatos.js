import { getDnisCenso, getIdElecciones, getLocalidades, getDatosCenso, getCandidatosNombre, insertarCandidato, getUnDniConIdCenso, getUnaLocalidadIdLocalidad, getUnaPreferenciaIdCandidato, updateCandidatoFormUpdate, deleteCandidato, getNombrePartidoConId } from "./apiAdmin.js";
import { createSubmitButton, createCloseButton, createDeleteButton, createLabeledField } from "./generarContenidoSinEleccion.js";
import { getPartidos } from "./apiAdmin.js";
import { createHeader } from "../main-content/utilidades.js";

export async function generarContenidoEleccionCandidatos() {

    const main = document.querySelector('main');

    main.innerHTML = `

        <div id="modalPadreInsert"></div>
        <h1>PANEL CANDIDATOS</h1>
        <div class="gridTable">

            <div class="gridTitleHeader">

                <h2>idCandidato</h2>
                <h2>idCenso</h2>
                <h2>Partido</h2>
                <h2>Localidad</h2>
                <h2>Preferencia</h2>
                <h2>Eleccion Asociada</h2>

            </div>

            <div class="gridTableBody" id="gridTableBody">

                <!-- Aquí se generará la tabla -->
            
            </div>
        
        </div>

    
    `;

    const contenidoModal = `

        <button type="submit" class="btn-close" id="cerrar">Cerrar</button>

        <form class="formularioModal">
        
            <div class="flexModalSection">
            
                <div>
                    <label for="select-opciones-dni">DNI:</label>
                    <select name="select-opciones-dni" id="select-opciones-dni"></select>
                </div>

                <div>
                    <label for="select-opciones-localidad">Localidad:</label>
                    <select name="select-opciones-localidad" id="select-opciones-localidad"></select>
                </div>
            
            </div>

            <div class="flexModalSection">
            
                <div>
                    <label for="select-opciones-idElecciones">Elección:</label>
                    <select name="select-opciones-idElecciones" id="select-opciones-idElecciones"></select>
                </div>

                <div>
                    <label for="select-opciones-preferencia">Preferencia:</label>
                    <select name="select-opciones-preferencia" id="select-opciones-preferencia"></select>
                </div>
            
            </div>

            <div>
                <label for="select-opciones-partidos">Partido:</label>
                <select name="select-opciones-partidos" id="select-opciones-partidos"></select>
            </div>

            <div class="buttonModalSection">

                <button type="submit" class="btn-submit" id="insertar">Insertar</button>
                <button type="submit" class="btn-delete" id="borrar">Borrar</button>
                <button type="submit" class="btn-update" id="actualizar">Actualizar</button>

            </div>
        
        </form>

    `;

    let modalPadre = document.getElementById('modalPadreInsert');
    modalPadre.style.display = 'none';
    modalPadre.innerHTML = contenidoModal;

    const gridTableBody = document.getElementById('gridTableBody');
    const borrarBtn = document.getElementById('borrar');
    const actualizarBtn = document.getElementById('actualizar');
    const cerrarBtn = document.getElementById('cerrar');
    const insertar = document.getElementById('insertar');
    const btnInsertar = await createInsertButton(borrarBtn, actualizarBtn, insertar);


    createGridTable(gridTableBody)
    cerrarBtn.addEventListener("click", () => handleCerrarBtn(modalPadre))

    main.appendChild(btnInsertar);
    document.body.appendChild(main);
}


// AQUI SE CREA EL INSERT BUTTON DONDE CARGA INFORMACIÖN DENTRO DE LOS SELECTS
async function createInsertButton(borrarBtn, actualizarBtn, insertar) {
    const btnInsertar = document.createElement('button');
    btnInsertar.id = 'btn-insertar';
    btnInsertar.textContent = 'Insertar Candidato';

    btnInsertar.addEventListener('click', async (event) => {

        event.preventDefault();

        const divPadre = document.getElementById('modalPadreInsert');
        divPadre.style.display = 'flex';
        insertar.style.display = 'block';
        borrarBtn.style.display = "none";
        actualizarBtn.style.display = "none";

        // RELLENANDO LOS CAMPOS DEL FORMULARIO
        await cargarSelects()

        insertar.addEventListener('click', async (event) => {

            // Prevent the default form submission
            event.preventDefault();

            // OBTENER LOS VALORES DE LOS SELECTS
            const dni = document.getElementById('select-opciones-dni').value;
            const idLocalidad = document.getElementById('select-opciones-localidad').value;
            const idElecciones = document.getElementById('select-opciones-idElecciones').value;
            const preferencia = document.getElementById('select-opciones-preferencia').value;
            const partido = document.getElementById('select-opciones-partidos').value;



            let insertandoCandidato = await insertarCandidato(dni, idLocalidad, idElecciones, preferencia, partido);
            console.log(insertandoCandidato);
            window.location.reload();
        })


    });

    return btnInsertar;
}

// RELLENANDO LOS CAMPOS DE LOS FORMULARIOS
async function cargarSelects() {

    // AQUÍ EMPIEZA EL CÓDIGO PARA CARGAR LOS DATOS PARA EL MODAL
    async function createSelectDnis() {


        let jsonDni = await getDnisCenso();
        let selectDNIS = document.getElementById('select-opciones-dni');
        // Opción por defecto
        const defaultOption = document.createElement('option');
        defaultOption.value = ""; // Valor null en HTML se representa con una cadena vacía
        defaultOption.textContent = `Selecciona Dni`;
        defaultOption.selected = true;
        defaultOption.disabled = true;
        selectDNIS.appendChild(defaultOption);

        let listaDNIs = jsonDni.value;

        listaDNIs.forEach(dni => {
            const option = document.createElement('option');
            option.value = dni.dni;
            option.textContent = dni.dni;
            selectDNIS.append(option);
        });
    }

    async function createSelectIdElecciones() {

        let jsonElecciones = await getIdElecciones();
        let selectIdElecciones = document.getElementById('select-opciones-idElecciones');

        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = `Selecciona elecciones`;
        defaultOption.selected = true;
        defaultOption.disabled = true;
        selectIdElecciones.appendChild(defaultOption);

        jsonElecciones.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            selectIdElecciones.append(option);
        });

    }

    async function createSelectLocalidad() {

        let localidades = await getLocalidades();
        let selectLocalidad = document.getElementById('select-opciones-localidad');

        localidades.localidades.forEach(localidad => {
            const option = document.createElement('option');
            option.value = localidad.idLocalidad;
            option.textContent = localidad.nombre;
            selectLocalidad.appendChild(option);
        });

    }

    function createSelectPreferencia() {

        const selectPreferencia = document.getElementById("select-opciones-preferencia")

        const optionNull = document.createElement('option');
        optionNull.name = null;
        optionNull.textContent = 'Selecciona la preferencia';

        selectPreferencia.appendChild(optionNull);

        const preferencias = ["1", "2", "3"];

        preferencias.forEach(preferencia => {
            const option = document.createElement('option');
            option.id = `preferencia-${preferencia}`;
            option.name = `preferencia-${preferencia}`;
            option.textContent = preferencia;
            selectPreferencia.appendChild(option);
        });

    }

    async function createSelectPartidos() {

        let partidos = await getPartidos();
        const selectPartidos = document.getElementById('select-opciones-partidos');

        partidos.forEach(partido => {
            const option = document.createElement('option');
            option.value = partido.idPartido;
            option.textContent = partido.nombre;
            selectPartidos.appendChild(option);
        });
    }

    await createSelectDnis();
    await createSelectPartidos();
    await createSelectIdElecciones();
    await createSelectLocalidad();
    createSelectPreferencia();
}

async function createGridTable(gridTable) {

    let candidatos = await getCandidatosNombre();
    let modalPadre = document.getElementById('modalPadreInsert');
    const borrarBtn = document.getElementById('borrar');
    const actualizarBtn = document.getElementById('actualizar');
    const btnInsertar = document.getElementById('insertar');

    candidatos.forEach(async candidato => {

        let dniCandidato = await getUnDniConIdCenso(candidato.idCenso);

        let idCandidato = candidato.idCandidato;
        let idCenso = candidato.idCenso;

        let nombreCandidato = await getDatosCenso(idCenso);
        nombreCandidato = nombreCandidato.censo.nombre;

        let idLocalidad = candidato.idLocalidad;
        let nombreLocalidad = await getUnaLocalidadIdLocalidad(idLocalidad);
        nombreLocalidad = nombreLocalidad.nombre;

        let idEleccion = candidato.idEleccion;

        let idPartido = candidato.idPartido;
        let nombrePartido = await getNombrePartidoConId(idPartido);
        nombrePartido = nombrePartido.nombre;

        let preferencia = candidato.preferencia;

        const gridRow = document.createElement("div");
        let gridRowHTML = `

            <p>${idCandidato}</p>
            <p>${nombreCandidato}</p>
            <p>${nombrePartido}</p>
            <p>${nombreLocalidad}</p>
            <p>${preferencia}</p>
            <p>${idEleccion}</p>
        
        `

        // ESTO ES CUANDO HACES CLIC ENCIMA DE UN CANDIDATO
        gridRow.addEventListener("click", async () => {

            modalPadre.style.display = 'flex';
            actualizarBtn.style.display = 'block';
            borrarBtn.style.display = 'block';
            btnInsertar.style.display = 'none';

            await cargarSelects();

            let selectDni = document.getElementById('select-opciones-dni');
            let selectPartido = document.getElementById('select-opciones-partidos');
            let selectIdElecciones = document.getElementById('select-opciones-idElecciones');
            let selectLocalidad = document.getElementById('select-opciones-localidad');
            let selectPreferencia = document.getElementById('select-opciones-preferencia');

            selectDni.value = dniCandidato.dni;
            selectPartido.value = candidato.idPartido;
            selectIdElecciones.value = candidato.idEleccion;
            selectLocalidad.value = candidato.idLocalidad;
            selectPreferencia.value = candidato.preferencia;



            // GESTION DEL BORRARDO Y ACTUALIZACION
            borrarBtn.addEventListener('click', async (event) => {
                event.preventDefault();
                let borrado = await deleteCandidato(candidato.idCandidato);
                console.log(borrado);
                createGridTable(gridTable);
                window.location.reload();
            });

            actualizarBtn.addEventListener('click', async (event) => {
                event.preventDefault();
            
                let selectDni = document.getElementById('select-opciones-dni');
                let selectPartido = document.getElementById('select-opciones-partidos');
                let selectIdElecciones = document.getElementById('select-opciones-idElecciones');
                let selectLocalidad = document.getElementById('select-opciones-localidad');
                let selectPreferencia = document.getElementById('select-opciones-preferencia');
                
                // Mostrar los valores de los select en la consola+
                console.log("Valor ID Candidato:", candidato.idCandidato);
                console.log("Valor DNI:", selectDni.value);
                console.log("Valor Partido:", selectPartido.value);
                console.log("Valor ID Elecciones:", selectIdElecciones.value);
                console.log("Valor Localidad:", selectLocalidad.value);
                console.log("Valor Preferencia:", selectPreferencia.value);
                const idCandidato = candidato.idCandidato; 
                const dni = selectDni.value; 
                const idPartido = selectPartido.value; 
                const idEleccion = selectIdElecciones.value; 
                const idLocalidad = selectLocalidad.value;
                const preferencia = selectPreferencia.value;
                await updateCandidatoFormUpdate(idCandidato, dni, idPartido, idEleccion, preferencia, idLocalidad);
                window.location.reload();
            });
            
        })
        gridRow.innerHTML = gridRowHTML;
        gridTable.appendChild(gridRow);
    });

}

function handleCerrarBtn(modal) {
    modal.style.display = 'none';
}