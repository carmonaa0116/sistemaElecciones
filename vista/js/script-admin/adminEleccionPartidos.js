import { getDnisCenso, getIdElecciones, getLocalidades, getDatosCenso, getCandidatosNombre, insertarCandidato, getUnDniConIdCenso, getUnaLocalidadIdLocalidad, getUnaPreferenciaIdCandidato, updateCandidatoFormUpdate, deleteCandidato, getNombrePartidoConId } from "./apiAdmin.js";
import { createSubmitButton, createCloseButton, createDeleteButton, createLabeledField } from "./generarContenidoSinEleccion.js";
import { getPartidos } from "./apiAdmin.js";
import { createHeader } from "../main-content/utilidades.js";

export async function generarContenidoEleccionPartidos() {

    const main = document.querySelector('main');

    main.innerHTML = `

        <div id="modalPadreInsert"></div>
        <h1>PANEL PARTIDOS</h1>
        <div class="gridTable">

            <div class="gridTitleHeader">

                <h2>idPartido</h2>
                <h2>Nombre</h2>
                <h2>Siglas</h2>
                <h2>Imagen</h2>

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
                    <label for="input-nombre">Nombre:</label>
                    <input type="input-nombre" id="input-nombre"></select>
                </div>

                <div>
                    <label for="input-siglas">Siglas:</label>
                    <input type="input-siglas" id="input-siglas"></select>
                </div>
            </div>
            
            <div>
                <label for="input-imagen-partido">Imagen del partido:</label>
                <input type="file" id="input-imagen-partido" name="input-imagen-partido" accept="image/*">
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

        insertar.addEventListener('click', async (event) => {

            // Prevent the default form submission
            event.preventDefault();

            // OBTENER LOS VALORES DE LOS SELECTS
            const dni = document.getElementById('select-opciones-dni').value;
            const localidad = document.getElementById('select-opciones-localidad').value;
            const idElecciones = document.getElementById('select-opciones-idElecciones').value;
            const preferencia = document.getElementById('select-opciones-preferencia').value;
            const partido = document.getElementById('select-opciones-partidos').value;

            let insertandoCandidato = await insertarCandidato(dni, localidad, idElecciones, preferencia, partido);
            console.log(insertandoCandidato);
        })


    });

    return btnInsertar;
}


async function createGridTable(gridTable) {

    let partidos = await getPartidos();
    let modalPadre = document.getElementById('modalPadreInsert');
    const borrarBtn = document.getElementById('borrar');
    const actualizarBtn = document.getElementById('actualizar');
    const btnInsertar = document.getElementById('insertar');

    partidos.forEach(async partido => {

        console.log(partido);

        let idPartido = partido.idPartido;
        let nombre = partido.nombre;
        let siglas = partido.siglas;
        let imagen = partido.imagen;

        const gridRow = document.createElement("div");
        let gridRowHTML = `

            <p>${idPartido}</p>
            <p>${nombre}</p>
            <p>${siglas}</p>
            <img style=" height: 30px;" src="data:image/png;base64,${imagen}" alt="imagen partido" />
        `

        // ESTO ES CUANDO HACES CLIC ENCIMA DE UN CANDIDATO
        gridRow.addEventListener("click", async () => {

            modalPadre.style.display = 'flex';
            actualizarBtn.style.display = 'block';
            borrarBtn.style.display = 'block';
            btnInsertar.style.display = 'none';


            let inputNombre = document.getElementById('input-nombre');
            let inputSiglas = document.getElementById('input-siglas');
            inputNombre.value = partido.nombre;
            inputSiglas.value = partido.siglas;

        })


        // GESTION DEL BORRARDO Y ACTUALIZACION
        borrarBtn.addEventListener('click', async (event) => {
            event.preventDefault();
            let borrado = await deleteCandidato(candidato.idCandidato);
            console.log(borrado);
            createGridTable(gridTable);
        })

        actualizarBtn.addEventListener('click', async (event) => {
            event.preventDefault();
            await updateCandidato(candidato.idCandidato, candidato.idCenso, candidato.idPartido, candidato.idLocalidad, candidato.preferencia, candidato.idEleccion);
            location.reload();
        })

        gridRow.innerHTML = gridRowHTML;
        gridTable.appendChild(gridRow);


    })

}

function handleCerrarBtn(modal) {
    modal.style.display = 'none';
}