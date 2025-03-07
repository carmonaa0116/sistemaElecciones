import { getDnisCenso, getIdElecciones, getLocalidades, getDatosCenso, getCandidatosNombre, insertarCandidato, getUnDniConIdCenso, getUnaLocalidadIdLocalidad, getUnaPreferenciaIdCandidato, updateCandidatoFormUpdate, deleteCandidato, getNombrePartidoConId } from "./apiAdmin.js";
import { createSubmitButton, createCloseButton, createDeleteButton, createLabeledField } from "./generarContenidoSinEleccion.js";
import { getPartidos } from "./apiAdmin.js";

export async function generarContenidoEleccionCandidatos() {
    const main = document.querySelector('main');
    main.innerHTML = '';
    console.log('Ha entrado en adminEleccionCandidatos.js');
    const modalInsert = await createModalInsert();
    const modalUpdate = await createModalUpdate();
    const h1 = createHeader();
    const btnInsertar = createInsertButton();
    const divTabla = await createTableDiv();

    main.appendChild(modalInsert);
    main.appendChild(modalUpdate);
    main.appendChild(h1);
    main.appendChild(btnInsertar);
    main.appendChild(divTabla);

    document.body.appendChild(main);
}

async function createModalInsert() {
    const modalPadre = document.createElement('div');
    modalPadre.id = 'modalPadreInsert';
    modalPadre.style.display = 'none';
    const contenidoModal = document.createElement('div');
    contenidoModal.className = 'contenidoModal';

    const form = await createFormInsertCandidatos();

    const closeButton = createCloseButton(modalPadre);
    contenidoModal.appendChild(closeButton);
    contenidoModal.appendChild(form);

    modalPadre.appendChild(contenidoModal);

    return modalPadre;
}

function createSelectDnis(jsonDni, nombreSelect) {
    const select = document.createElement('select');
    select.name = `select-opciones-${nombreSelect}`;

    // Opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = ""; // Valor null en HTML se representa con una cadena vacía
    defaultOption.textContent = `Selecciona ${nombreSelect}`;
    defaultOption.selected = true;
    defaultOption.disabled = true;
    select.appendChild(defaultOption);

    for (let i = 0; i < jsonDni.length; i++) {
        const option = document.createElement('option');
        option.value = jsonDni[i].dni;
        option.textContent = jsonDni[i].dni;
        select.appendChild(option);
    }
    return select;
}

function createSelectIdElecciones(jsonElecciones, nombreSelect) {
    const select = document.createElement('select');
    select.name = `select-opciones-${nombreSelect}`;

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
    localidades.localidades.forEach(localidad => {
        const option = document.createElement('option');
        option.value = localidad.nombre;
        option.textContent = localidad.nombre;
        select.appendChild(option);
    });

    return select;
}

function createSelectPreferencia() {

    const select = document.createElement('select');
    select.name = 'select-opciones-preferencia';

    const optionNull = document.createElement('option');
    optionNull.name = null;
    optionNull.textContent = 'Selecciona la preferencia';

    select.appendChild(optionNull);

    const preferencias = ["1", "2", "3"];

    preferencias.forEach(preferencia => {
        const option = document.createElement('option');
        option.id = `preferencia-${preferencia}`;
        option.name = `preferencia-${preferencia}`;
        option.textContent = preferencia;
        select.appendChild(option);
    });

    return select;


}
async function createFormInsertCandidatos() {
    const form = document.createElement('form');
    form.id = 'modal-form-insert';

    let dnisResponse = await getDnisCenso();
    dnisResponse = dnisResponse.value;
    const selectDni = createSelectDnis(dnisResponse, 'dni');
    const idElecciones = await getIdElecciones();
    const selectIdElecciones = createSelectIdElecciones(idElecciones, 'idElecciones');
    const localidades = await getLocalidades();
    const selectLocalidad = createSelectLocalidad(localidades, 'localidad');
    const selectEleccion = createSelectPreferencia();
    const partidos = await getPartidos();
    const selectPartidos = await createSelectPartidos(partidos);

    form.appendChild(createLabeledField('DNI:', selectDni));
    form.appendChild(createLabeledField('Localidad:', selectLocalidad));
    form.appendChild(createLabeledField('ID Elección:', selectIdElecciones));
    form.appendChild(createLabeledField('Preferencia:', selectEleccion));
    form.appendChild(createLabeledField('Partido', selectPartidos));

    const submitButtonCandidatos = createSubmitButton();
    form.appendChild(submitButtonCandidatos);

    form.addEventListener('submit', async (event) => {
        const formData = new FormData(form);
        const dni = formData.get('select-opciones-dni');
        const idEleccion = formData.get('select-opciones-idElecciones');
        const idLocalidad = formData.get('select-opciones-localidad');
        const preferencia = formData.get('select-opciones-preferencia');
        const partido = formData.get('select-opciones-partidos');
        console.log(dni);
        console.log(idEleccion);
        console.log(idLocalidad);
        console.log(preferencia);


        await insertarCandidato(dni, idLocalidad, idEleccion, preferencia, partido);
        await generarContenidoEleccionCandidatos();
    });

    return form;
}




async function createFormUpdateCandidatos() {
    const form = document.createElement('form');
    form.id = 'modal-form-update';

    const idCandidatoInput = document.createElement('input');
    idCandidatoInput.type = 'text';
    idCandidatoInput.name = 'idCandidato';
    idCandidatoInput.placeholder = 'ID Candidato';
    idCandidatoInput.readOnly = true;

    let dnisResponse = await getDnisCenso();
    dnisResponse = dnisResponse.value;
    const selectDni = createSelectDnis(dnisResponse, 'dni');
    const idElecciones = await getIdElecciones();
    const selectIdElecciones = createSelectIdElecciones(idElecciones, 'idElecciones');
    const localidades = await getLocalidades();
    const selectLocalidad = createSelectLocalidad(localidades, 'localidad');
    const preferenciaSelect = createSelectPreferencia();
    const partidos = await getPartidos();
    const selectPartidos = await createSelectPartidos(partidos);
    form.appendChild(createLabeledField('ID Candidato:', idCandidatoInput));
    form.appendChild(createLabeledField('DNI:', selectDni));
    form.appendChild(createLabeledField('Localidad:', selectLocalidad));
    form.appendChild(createLabeledField('ID Elección:', selectIdElecciones));
    form.appendChild(createLabeledField('Preferencia:', preferenciaSelect));
    form.appendChild(createLabeledField('Partido', selectPartidos))

    const submitButton = createSubmitButton();
    form.appendChild(submitButton);

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const idCandidato = formData.get('idCandidato');
        const dni = formData.get('select-opciones-dni');
        const localidad = formData.get('select-opciones-localidad');
        const eleccion = formData.get('select-opciones-idElecciones');
        const preferencia = formData.get('select-opciones-preferencia');
        const idPartido = formData.get('select-opciones-partidos')
        console.log(idCandidato);

        const atributos = {
            idCandidato: idCandidato,
            dni: dni,
            localidad: localidad,
            eleccion: eleccion,
            preferencia: preferencia,
            idPartido: idPartido
        };

        console.log(atributos);

        await updateCandidatoFormUpdate(atributos);
        await generarContenidoEleccionCandidatos();
    });

    return form;
}



function createHeader() {
    const h1 = document.createElement('h1');
    h1.textContent = `PANEL CANDIDATOS`;
    return h1;
}

function createInsertButton() {
    const btnInsertar = document.createElement('button');
    btnInsertar.id = 'btn-insertar';
    btnInsertar.textContent = 'INSERTAR';
    btnInsertar.addEventListener('click', () => {
        const divPadre = document.getElementById('modalPadreInsert');
        divPadre.style.display = 'block';
    });
    return btnInsertar;
}



async function createTableDiv(eleccion) {
    const divTabla = document.createElement('div');
    divTabla.id = 'div-tabla-censo';

    const table = document.createElement('table');
    table.id = 'tabla-censo';

    const thead = createTableHeader(eleccion);
    const tbody = await createTableBody();


    table.appendChild(thead);
    table.appendChild(tbody);
    divTabla.appendChild(table);

    return divTabla;
}

function createTableHeader() {
    const thead = document.createElement('thead');
    thead.id = 'theadCandidatos';
    const tr = document.createElement('tr');

    ['idCandidato', 'DNI', 'Localidad', 'Eleccion', 'Preferencia', 'Partido'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        tr.appendChild(th);
    });

    thead.appendChild(tr); // Agregar la fila al thead
    return thead;
}


async function createTableBody() {
    const tbody = document.createElement('tbody');
    const candidatos = await getCandidatosNombre();

    for (const candidato of candidatos) {

        const datosCenso = await getDatosCenso(candidato.idCenso);
        console.log(datosCenso);
        const tr = document.createElement('tr');

        const tdIdCandidato = document.createElement('td');
        tdIdCandidato.textContent = candidato.idCandidato;

        const tdIdCenso = document.createElement('td');
        tdIdCenso.textContent = datosCenso.censo.dni;

        const tdIdLocalidad = document.createElement('td');
        const localidad = await getUnaLocalidadIdLocalidad(candidato.idLocalidad);
        tdIdLocalidad.textContent = localidad.nombre;
        
        const tdIdEleccion = document.createElement('td');
        tdIdEleccion.textContent = candidato.idEleccion;

        const tdPreferencia = document.createElement('td');
        tdPreferencia.textContent = candidato.preferencia;

        const partido = await getNombrePartidoConId(candidato.idPartido);

        const tdPartido = document.createElement('td');
        tdPartido.textContent = partido.nombre; // Corrección aquí
        tr.appendChild(tdIdCandidato);
        tr.appendChild(tdIdCenso);
        tr.appendChild(tdIdLocalidad);
        tr.appendChild(tdIdEleccion);
        tr.appendChild(tdPreferencia);
        tr.appendChild(tdPartido);

        tr.addEventListener('click', async () => {
            const modalUpdate = document.getElementById('modalPadreUpdate');
            modalUpdate.style.display = 'block';
            const datos = {
                idCandidato: candidato.idCandidato,
                idCenso: candidato.idCenso,
                idLocalidad: candidato.idLocalidad,
                idEleccion: candidato.idEleccion,
                preferencia: candidato.preferencia,
                idPartido: candidato.idPartido
            };

            await fillUpdateForm(datos);
        });

        tbody.appendChild(tr);
    }

    return tbody;
}

async function fillUpdateForm(datos) {
    const formUpdate = document.getElementById('modal-form-update');
    formUpdate.querySelector('[name="idCandidato"]').value = datos.idCandidato;

    const selectDni = formUpdate.querySelector('[name="select-opciones-dni"]');
    const dni = await getUnDniConIdCenso(datos.idCenso);
    selectDni.value = dni.dni;

    const selectLocalidad = formUpdate.querySelector('[name="select-opciones-localidad"]');
    const nombreLocalidad = await getUnaLocalidadIdLocalidad(datos.idLocalidad);

    selectLocalidad.value = nombreLocalidad.nombre;

    const selectEleccion = formUpdate.querySelector('[name="select-opciones-idElecciones"]');
    selectEleccion.value = datos.idEleccion;

    const selectPreferencia = formUpdate.querySelector('[name="select-opciones-preferencia"]');
    const preferencia = await getUnaPreferenciaIdCandidato(datos.idCandidato);
    selectPreferencia.value = preferencia.preferencia;

    const selectPartido = formUpdate.querySelector('[name="select-opciones-partidos"]');
    const nombrePartido = await getNombrePartidoConId(datos.idPartido);
    console.log(nombrePartido);
    selectPartido.value = nombrePartido.nombre;
}

async function createModalUpdate() {
    const modalPadre = document.createElement('div');
    modalPadre.id = 'modalPadreUpdate';
    modalPadre.style.display = 'none';

    const contenidoModal = document.createElement('div');
    contenidoModal.className = 'contenidoModal';

    const form = await createFormUpdateCandidatos();
    const closeButton = createCloseButton(modalPadre);

    const deleteButton = createDeleteButton(modalPadre);

    deleteButton.addEventListener('click', async () => {
        const formData = new FormData(form);
        const idCandidato = formData.get('idCandidato');

        await deleteCandidato(idCandidato);
        await generarContenidoEleccionCandidatos();

    });

    contenidoModal.appendChild(closeButton);
    contenidoModal.appendChild(form);
    contenidoModal.appendChild(deleteButton)
    modalPadre.appendChild(contenidoModal);

    return modalPadre;
}

async function createSelectPartidos(partidos) {
    const select = document.createElement('select');
    select.name = 'select-opciones-partidos';
    partidos.forEach(partido => {
        const option = document.createElement('option');
        option.value = partido.nombre;
        option.textContent = partido.nombre;
        select.appendChild(option);
    });
    return select;
}