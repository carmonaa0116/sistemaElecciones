import { getDnisCenso, insertarPartido } from "./apiAdmin.js";
import { getIdElecciones } from "./apiAdmin.js";
import { getLocalidades } from "./apiAdmin.js";
import { createSubmitButton } from "./generarContenidoSinEleccion.js";
import { createCloseButton } from "./generarContenidoSinEleccion.js";
import { getCandidatosNombre } from "./apiAdmin.js";
import { insertarCandidato } from "./apiAdmin.js";
import { getNombrePartidos } from "./apiAdmin.js";
import { getPartidos } from "./apiAdmin.js";

export async function generarContenidoEleccionPartidos() {
    const main = document.querySelector('main');
    main.innerHTML = '';
    console.log('Ha entrado en adminEleccionPartidos.js');
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

    const select = document.createElement('select');
    select.name = `select-opciones-${nombreSelect}`;

    // Opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = ""; // Valor null en HTML se representa con una cadena vacía
    defaultOption.textContent = `Selecciona ${nombreSelect}`;
    defaultOption.selected = true;
    defaultOption.disabled = true;
    select.appendChild(defaultOption);

    for(let i = 0; i < jsonDni.length; i++) {
        console.log(jsonDni[i].dni);
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

async function createFormInsertPartido() {
    const form = document.createElement('form');
    form.id = 'modal-form-insert';

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

    const submitButtonCandidatos = createSubmitButton();

    form.appendChild(inputNombrePartido);
    form.appendChild(inputSiglasPartido);
    form.appendChild(submitButtonCandidatos);

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const nombrePartido = formData.get('input-nombre-partido');
        const siglasPartido = formData.get('input-siglas-partido');

        await insertarPartido(nombrePartido, siglasPartido);
        await generarContenidoEleccionPartidos();
    });

    return form;
}

async function createFormUpdatePartidos() {
    const form = document.createElement('form');
    form.id = 'modal-form-update';

    const idCandidatoInput = document.createElement('input');
    idCandidatoInput.type = 'text';
    idCandidatoInput.name = 'idCandidato';
    idCandidatoInput.placeholder = 'ID Candidato';
    idCandidatoInput.disabled = true; // Assuming ID should not be editable
    let selectDni = null;
    const dnisResponse = await getDnisCenso().then(data => {
        selectDni = createSelectDnis(data, 'dni');
        console.log(selectDni);
    });
    console.log(dnisResponse);

    const idElecciones = await getIdElecciones();
    const selectIdElecciones = createSelectIdElecciones(idElecciones, 'idElecciones');

    const localidades = await getLocalidades();
    const selectLocalidad = createSelectLocalidad(localidades, 'localidad');

    const preferenciaSelect = document.createElement('select');
    preferenciaSelect.name = 'preferencia';
    ['1', '2', '3'].forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        preferenciaSelect.appendChild(option);
    });

    const submitButton = createSubmitButton();
    form.appendChild(idCandidatoInput);
    form.appendChild(selectDni);
    form.appendChild(selectLocalidad);
    form.appendChild(selectIdElecciones);
    form.appendChild(preferenciaSelect);
    form.appendChild(submitButton);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const idCandidato = formData.get('idCandidato');
        const dni = formData.get('select-opciones-dni');
        const idEleccion = formData.get('select-opciones-idElecciones');
        const localidad = formData.get('select-opciones-localidad');
        const preferencia = formData.get('preferencia');

        
    });

    return form;
}


function createHeader() {
    const h1 = document.createElement('h1');
    h1.textContent = `PANEL PARTIDOS`;
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
        { value: 'nombre', text: 'Por Nombre' },
        { value: 'siglas', text: 'Por Apellido' }
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
    divTabla.id = 'div-tabla-partidos';

    const table = document.createElement('table');
    table.id = 'tabla-partidos';

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

    ['idPartido', 'nombre', 'siglas'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        tr.appendChild(th);
    });

    thead.appendChild(tr); // Agregar la fila al thead
    console.log(thead);
    return thead;
}


async function createTableBody() {
    const tbody = document.createElement('tbody');
    const partidos = await getPartidos();
    console.log(partidos);
    partidos.forEach(partido => {
        const tr = document.createElement('tr');

        const tdIdPartido = document.createElement('td');
        tdIdPartido.textContent = partido.idPartido;

        const tdNombre = document.createElement('td');
        tdNombre.textContent = partido.nombre;

        const tdSiglas = document.createElement('td');
        tdSiglas.textContent = partido.siglas;

        tr.appendChild(tdIdPartido);
        tr.appendChild(tdNombre);
        tr.appendChild(tdSiglas);

        tr.addEventListener('click', () => {

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

    const form = await createFormUpdatePartidos();
    const closeButton = createCloseButton(modalPadre);

    contenidoModal.appendChild(closeButton);
    contenidoModal.appendChild(form);
    modalPadre.appendChild(contenidoModal);

    return modalPadre;
}
