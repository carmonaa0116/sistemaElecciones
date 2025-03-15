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

async function createModalInsert() {
    const modalPadre = document.createElement('div');
    modalPadre.id = 'modalPadreInsert';
    modalPadre.style.display = 'none';
    const contenidoModal = document.createElement('div');
    contenidoModal.className = 'contenidoModal';

    const form = await createFormInsertPartido();
    console.log('FORMULARIO:');
    console.log(form);


    const closeButton = createCloseButton(modalPadre);
    contenidoModal.appendChild(closeButton);
    contenidoModal.appendChild(form);

    modalPadre.appendChild(contenidoModal);

    return modalPadre;
}

function createSelectDnis(jsonDni, nombreSelect) {
    console.log('Ha entrado en createSelectDnis');
    const select = document.createElement('select');
    select.name = `select-opciones-${nombreSelect}`;
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = `Selecciona ${nombreSelect}`;
    defaultOption.selected = true;
    defaultOption.disabled = true;
    select.appendChild(defaultOption);
    for (let i = 0; i < jsonDni.value.length; i++) {
        console.log(jsonDni.value[i].dni);
        const option = document.createElement('option');
        option.value = jsonDni.value[i].dni;
        option.textContent = jsonDni.value[i].dni;
        select.appendChild(option);
    }
    console.log(select);
    return select;
}

function createSelectIdElecciones(jsonElecciones, nombreSelect) {
    const select = document.createElement('select');
    select.name = `select-opciones-${nombreSelect}`;

    // Opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = `Selecciona ${nombreSelect}`;
    defaultOption.selected = true;
    defaultOption.disabled = true;
    select.appendChild(defaultOption);

    jsonElecciones.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        select.append(option);
    });

    return select;
}

function createSelectLocalidad(localidades, nombreSelect) {
    const select = document.createElement('select');
    select.name = `select-opciones-${nombreSelect}`;

    // Opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = `Selecciona ${nombreSelect}`;
    defaultOption.selected = true;
    defaultOption.disabled = true;
    select.appendChild(defaultOption);
    console.log(localidades.localidades);
    localidades.localidades.forEach(localidad => {
        const option = document.createElement('option');
        option.value = localidad;
        option.textContent = localidad;
        select.appendChild(option);
    });

    return select;
}

async function createFormInsertPartido() {
    const form = document.createElement('form');
    form.id = 'modal-form-insert';
    form.enctype = 'multipart/form-data';

    const inputNombrePartido = document.createElement('input');
    inputNombrePartido.name = 'input-nombre-partido';
    inputNombrePartido.type = 'text';
    inputNombrePartido.required = true;
    inputNombrePartido.placeholder = 'Inserta el nombre del partido';

    const inputSiglasPartido = document.createElement('input');
    inputSiglasPartido.name = 'input-siglas-partido';
    inputSiglasPartido.type = 'text';
    inputSiglasPartido.required = true;
    inputSiglasPartido.placeholder = 'Inserta las siglas del partido';

    // Campo para la imagen
    const inputImagenPartido = document.createElement('input');
    inputImagenPartido.name = 'input-imagen-partido';
    inputImagenPartido.type = 'file';
    inputImagenPartido.accept = 'image/*'; // Acepta solo imágenes

    const submitButton = createSubmitButton();

    form.appendChild(inputNombrePartido);
    form.appendChild(inputSiglasPartido);
    form.appendChild(inputImagenPartido);
    form.appendChild(submitButton);

    form.addEventListener('submit', async (event) => {
        const formData = new FormData(form);
        console.log(formData.getAll);
        await insertarPartido(formData);
        await generarContenidoEleccionPartidos();
    });

    return form;
}


async function createFormUpdatePartidos() {
    const form = document.createElement('form');
    form.id = 'modal-form-update';

    const idPartidoInput = document.createElement('input');
    idPartidoInput.type = 'text';
    idPartidoInput.name = 'idPartido';
    idPartidoInput.placeholder = 'ID Partido';
    idPartidoInput.disabled = true;


    const inputIdElecciones = createInput('text', 'inputIdPartido', 'ID Partido');
    inputIdElecciones.readOnly = true;

    const inputNombre = createInput('text', 'inputNombre', 'Nombre del partido');

    const inputSiglas = createInput('text', 'inputSiglas', 'Siglas del partido');

    const inputImagen = createInput('file', 'inputImagen', 'Imagen del partido')

    const preferenciaSelect = document.createElement('select');
    preferenciaSelect.name = 'preferencia';
    ['1', '2', '3'].forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        preferenciaSelect.appendChild(option);
    });

    const submitButton = createSubmitButton();
    form.appendChild(inputIdElecciones);
    form.appendChild(inputNombre);
    form.appendChild(inputSiglas);
    form.appendChild(inputImagen);
    form.appendChild(submitButton);

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form); // Enviar como FormData
        formData.append('idPartido', document.querySelector('[name="inputIdPartido"]').value);
        formData.append('nombre', document.querySelector('[name="inputNombre"]').value);
        formData.append('siglas', document.querySelector('[name="inputSiglas"]').value);
        formData.append('imagen', document.querySelector('[name="inputImagen"]').files[0]); // Archivo de imagen

        await updatePartido(formData);
        await generarContenidoEleccionPartidos()
    });


    return form;
}


function createHeader() {
    const h1 = document.createElement('h1');
    h1.textContent = 'PANEL PARTIDOS';
    return h1;
}

function createInsertButton() {
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