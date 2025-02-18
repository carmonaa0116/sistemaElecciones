import { getLocalidades } from './apiCensista.js';
document.addEventListener('DOMContentLoaded', async () => {
    await generateMainContent();
    const filterSelect = document.getElementById('filter-select');
    const btnInsertar = document.getElementById('btn-insertar');
    if(!filterSelect || !btnInsertar){
        console.error('No se encontró el botón insertar o el select');
        return;
    }
});

export async function generateMainContent() {
    const main = document.createElement('main');
    const modalInsert = await createModalInsert();
    const modalUpdate = await createModalUpdate();
    const h1 = createHeader();
    const btnInsertar = createInsertButton();
    const filterSelect = createFilterSelect();
    const divTabla = createTableDiv();

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

    const form = await createFormInsert();

    const closeButton = createCloseButton(modalPadre);
    contenidoModal.appendChild(closeButton);
    contenidoModal.appendChild(form);

    modalPadre.appendChild(contenidoModal);

    return modalPadre;
}


async function createModalUpdate() {
    const modalPadre = document.createElement('div');
    modalPadre.id = 'modalPadreUpdate';
    modalPadre.style.display = 'none';

    const contenidoModal = document.createElement('div');
    contenidoModal.className = 'contenidoModal';

    const form = await createFormUpdate();
    const closeButton = createCloseButton(modalPadre);

    contenidoModal.appendChild(closeButton);
    contenidoModal.appendChild(form);
    modalPadre.appendChild(contenidoModal);

    return modalPadre;
}
async function createFormInsert() {
    const form = document.createElement('form');
    form.id = 'modal-form-insert';

    const responseLocalidades = await getLocalidades();

    const localidades = responseLocalidades.localidades;
    if (!Array.isArray(localidades)) {
        console.error("Se esperaba un array de localidades, pero se obtuvo:", localidades);
        return;  // Detener si no es un array
    }

    const inputDni = createInput('text', 'dni', 'DNI');
    const inputNombre = createInput('text', 'nombre', 'Nombre');
    const inputApellido = createInput('text', 'apellido', 'Apellido');
    const inputFechaNacimiento = createInput('date', 'fechaNacimiento');
    const inputLocalidad = await createOptions(localidades); 
    const inputEmail = createInput('email', 'email', 'Email');
    const submitButton = createSubmitButton();

    form.appendChild(inputDni);
    form.appendChild(inputNombre);
    form.appendChild(inputApellido);
    form.appendChild(inputFechaNacimiento);
    form.appendChild(inputLocalidad);
    form.appendChild(inputEmail);
    form.appendChild(submitButton);

    return form;
}



async function createFormUpdate() {
    const form = document.createElement('form');
    form.id = 'modal-form-update';

    const inputIdCenso = createInput('hidden', 'idCenso', 'idCenso');
    const inputDni = createInput('text', 'dni', 'DNI');
    const inputNombre = createInput('text', 'nombre', 'Nombre');
    const inputApellido = createInput('text', 'apellido', 'Apellido');
    const inputFechaNacimiento = createInput('date', 'fechaNacimiento');
    const localidadesJSON = await getLocalidades();
    const localidades = localidadesJSON.localidades;
    const inputLocalidad = await createOptions(localidades);
    const inputEmail = createInput('email', 'email', 'Email');
    const updateButton = createUpdateButton();
    const deleteButton = createDeleteButton();

    form.appendChild(inputIdCenso);
    form.appendChild(inputDni);
    form.appendChild(inputNombre);
    form.appendChild(inputApellido);
    form.appendChild(inputFechaNacimiento);
    form.appendChild(inputLocalidad);
    form.appendChild(inputEmail);
    form.appendChild(updateButton);
    form.appendChild(deleteButton);

    return form;
}

async function createOptions(jsonLocalidades) {
    const localidades = jsonLocalidades;
    const select = document.createElement('select');
    select.id = 'select-localidad';

  
    localidades.forEach(localidad => {
        const option = document.createElement('option');
        option.value = localidad.nombre;
        option.textContent = localidad.nombre;
        select.appendChild(option);
    });
    return select;
}

function createInput(type, name, placeholder = '') {
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.placeholder = placeholder;
    return input;
}

function createSubmitButton() {
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Enviar';
    return submitButton;
}

function createUpdateButton() {
    const btnActualizar = document.createElement('button');
    btnActualizar.id = 'btn-actualizar';
    btnActualizar.textContent = 'ACTUALIZAR';
    return btnActualizar;
}

function createDeleteButton() {
    const btnEliminar = document.createElement('button');
    btnEliminar.id = 'btn-eliminar';
    btnEliminar.textContent = 'ELIMINAR';
    return btnEliminar;
}

function createCloseButton(modalPadre) {
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.textContent = 'Cerrar';
    closeButton.addEventListener('click', () => {
        modalPadre.style.display = 'none';
    });
    return closeButton;
}

function createHeader() {
    const h1 = document.createElement('h1');
    h1.textContent = 'PANEL CENSISTA';
    return h1;
}

function createInsertButton() {
    const btnInsertar = document.createElement('button');
    btnInsertar.id = 'btn-insertar';
    btnInsertar.textContent = 'INSERTAR';
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

function createTableDiv() {
    const divTabla = document.createElement('div');
    divTabla.id = 'div-tabla-censo';

    const table = document.createElement('table');
    table.id = 'tabla-censo';

    const thead = createTableHeader();
    const tbody = document.createElement('tbody');
    tbody.id = 'tbody-censo';

    table.appendChild(thead);
    table.appendChild(tbody);
    divTabla.appendChild(table);

    return divTabla;
}

function createTableHeader() {
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');

    ['IdCenso', 'DNI', 'Nombre', 'Apellido', 'Fecha de Nacimiento', 'Localidad', 'Email'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        tr.appendChild(th);
    });

    thead.appendChild(tr);
    return thead;
}