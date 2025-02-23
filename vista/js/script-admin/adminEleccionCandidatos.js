import { getDnisCenso, getIdElecciones,getLocalidades, getCandidatosNombre, insertarCandidato, getUnDniConIdCenso, getUnaLocalidadIdLocalidad, getUnaPreferenciaIdCandidato, updateCandidatoFormUpdate, deleteCandidato } from "./apiAdmin.js";
import { createSubmitButton, createCloseButton, createDeleteButton, createLabeledField } from "./generarContenidoSinEleccion.js";

export async function generarContenidoEleccionCandidatos() {
    const main = document.querySelector('main');
    main.innerHTML = '';
    console.log('Ha entrado en adminEleccionCandidatos.js');
    const modalInsert = await createModalInsert();
    const modalUpdate = await createModalUpdate();
    const h1 = createHeader();
    const btnInsertar = createInsertButton();
    const filterSelect = createFilterSelect();
    const divTabla = await createTableDiv();

    main.appendChild(modalInsert);
    main.appendChild(modalUpdate);
    main.appendChild(h1);
    main.appendChild(btnInsertar);
    main.appendChild(filterSelect);
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

    localidades.forEach(localidad => {
        const option = document.createElement('option');
        option.value = localidad;
        option.textContent = localidad;
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

    form.appendChild(createLabeledField('DNI:', selectDni));
    form.appendChild(createLabeledField('Localidad:', selectLocalidad));
    form.appendChild(createLabeledField('ID Elección:', selectIdElecciones));
    form.appendChild(createLabeledField('Preferencia:', selectEleccion));

    const submitButtonCandidatos = createSubmitButton();
    form.appendChild(submitButtonCandidatos);

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const dni = formData.get('select-opciones-dni');
        const idEleccion = formData.get('select-opciones-idElecciones');
        const localidad = formData.get('select-opciones-localidad');
        const preferencia = formData.get('select-opciones-preferencia');

        await insertarCandidato(dni, localidad, idEleccion, preferencia);
        await generarContenidoEleccionCandidatos();
    });

    return form;
}



async function fillUpdateForm(datosFila) {
    const formUpdate = document.getElementById('modal-form-update');
    console.log(datosFila);
    formUpdate.querySelector('[name="idCandidato"]').value = datosFila.idCandidato;

    const selectDni = formUpdate.querySelector('[name="select-opciones-dni"]');
    const dni = await getUnDniConIdCenso(datosFila.idCenso);
    selectDni.value = dni.dni;

    const selectLocalidad = formUpdate.querySelector('[name="select-opciones-localidad"]');
    const localidad = await getUnaLocalidadIdLocalidad(datosFila.idLocalidad);
    selectLocalidad.value = localidad.nombre;

    const selectEleccion = formUpdate.querySelector('[name="select-opciones-idElecciones"]');
    selectEleccion.value = datosFila.idEleccion;

    const selectPreferencia = formUpdate.querySelector('[name="select-opciones-preferencia"]');
    const preferencia = await getUnaPreferenciaIdCandidato(datosFila.idCandidato);
    console.log(preferencia);
    selectPreferencia.value = preferencia.preferencia;
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
    console.log(dnisResponse);
    const selectDni = createSelectDnis(dnisResponse, 'dni');
    const idElecciones = await getIdElecciones();
    const selectIdElecciones = createSelectIdElecciones(idElecciones, 'idElecciones');
    const localidades = await getLocalidades();
    const selectLocalidad = createSelectLocalidad(localidades, 'localidad');
    const preferenciaSelect = createSelectPreferencia();

    form.appendChild(createLabeledField('ID Candidato:', idCandidatoInput));
    form.appendChild(createLabeledField('DNI:', selectDni));
    form.appendChild(createLabeledField('Localidad:', selectLocalidad));
    form.appendChild(createLabeledField('ID Elección:', selectIdElecciones));
    form.appendChild(createLabeledField('Preferencia:', preferenciaSelect));

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

        console.log(idCandidato);

        const atributos = {
            idCandidato: idCandidato,
            dni: dni,
            localidad: localidad,
            eleccion: eleccion,
            preferencia: preferencia
        };

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



function createFilterSelect() {
    const filterSelect = document.createElement('select');
    filterSelect.id = 'filter-select';

    const options = [
        { value: 'all', text: 'Todos' },
        { value: 'localidad', text: 'Por Localidad' },
        { value: 'fechaNacimiento', text: 'Por Fecha de Nacimiento' },
        { value: 'nombre', text: 'Por Nombre' },
        { value: 'apellido', text: 'Por Apellido' }
    ];

    options.forEach(optionData => {
        const option = document.createElement('option');
        option.value = optionData.value;
        option.textContent = optionData.text;
        filterSelect.appendChild(option);
    });

    return filterSelect;
}

async function createTableDiv(eleccion) {
    const divTabla = document.createElement('div');
    divTabla.id = 'div-tabla-censo';

    const table = document.createElement('table');
    table.id = 'tabla-censo';

    const thead = createTableHeader(eleccion);
    const tbody = await createTableBody(eleccion);


    table.appendChild(thead);
    table.appendChild(tbody);
    divTabla.appendChild(table);

    return divTabla;
}

function createTableHeader() {
    const thead = document.createElement('thead');
    thead.id = 'theadCandidatos';
    const tr = document.createElement('tr');

    ['idCandidato', 'idCenso', 'idLocalidad', 'idEleccion', 'preferencia'].forEach(text => {
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
    candidatos.forEach(candidato => {
        const tr = document.createElement('tr');

        const tdIdCandidato = document.createElement('td');
        tdIdCandidato.textContent = candidato.idCandidato;

        const tdIdCenso = document.createElement('td');
        tdIdCenso.textContent = candidato.idCenso;

        const tdIdLocalidad = document.createElement('td');
        tdIdLocalidad.textContent = candidato.idLocalidad;

        const tdIdEleccion = document.createElement('td');
        tdIdEleccion.textContent = candidato.idEleccion;

        const tdPreferencia = document.createElement('td');
        tdPreferencia.textContent = candidato.preferencia;

        tr.appendChild(tdIdCandidato);
        tr.appendChild(tdIdCenso);
        tr.appendChild(tdIdLocalidad);
        tr.appendChild(tdIdEleccion);
        tr.appendChild(tdPreferencia);

        tr.addEventListener('click', async () => {
            const modalUpdate = document.getElementById('modalPadreUpdate');
            modalUpdate.style.display = 'block';
            const datosFila = {
                idCandidato: candidato.idCandidato,
                idCenso: candidato.idCenso,
                idLocalidad: candidato.idLocalidad,
                idEleccion: candidato.idEleccion,
                preferencia: candidato.preferencia
            };

            await fillUpdateForm(datosFila);

        });

        tbody.appendChild(tr);
    });

    return tbody;
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
    });

    contenidoModal.appendChild(closeButton);
    contenidoModal.appendChild(form);
    contenidoModal.appendChild(deleteButton)
    modalPadre.appendChild(contenidoModal);

    return modalPadre;
}