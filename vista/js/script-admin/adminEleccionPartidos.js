
import { getDnisCenso, insertarPartido, updatePartido } from "./apiAdmin.js";
import { getIdElecciones } from "./apiAdmin.js";
import { getLocalidades } from "./apiAdmin.js";
import { createDeleteButton, createInput, createSubmitButton } from "./generarContenidoSinEleccion.js";
import { createCloseButton } from "./generarContenidoSinEleccion.js";
import { getCandidatosNombre } from "./apiAdmin.js";
import { insertarCandidato } from "./apiAdmin.js";
import { getNombrePartidos } from "./apiAdmin.js";
import { getPartidos } from "./apiAdmin.js";
import { deletePartido } from "./apiAdmin.js";

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
    console.log('Ha entrado en createSelectDnis');
    const select = document.createElement('select');
    select.name =`select-opciones-${nombreSelect}`;
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = `Selecciona ${nombreSelect}`;
    defaultOption.selected = true;
    defaultOption.disabled = true;
    select.appendChild(defaultOption);
    for(let i = 0; i < jsonDni.value.length; i++) {
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

    ['idPartido', 'nombre', 'siglas', 'imagen'].forEach(text => {
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

        // Crear celda para la imagen
        const tdImagen = document.createElement('td');
        const img = document.createElement('img');
        img.src = partido.imagen ? partido.imagen : '../../img/no-image.png'; 
        img.alt = partido.nombre;
        img.style.width = '4vw'; // Ajustar el tamaño si es necesario
        img.style.height = 'auto';
        img.style.borderRadius = '5px';
        tdImagen.appendChild(img);

        tr.appendChild(tdIdPartido);
        tr.appendChild(tdNombre);
        tr.appendChild(tdSiglas);
        tr.appendChild(tdImagen);

        tr.addEventListener('click', async () => {
            const modalUpdate = document.getElementById('modalPadreUpdate');
            modalUpdate.style.display = 'block';
            const datosFila = {
                idPartido: partido.idPartido,
                nombre: partido.nombre,
                siglas: partido.siglas,
                imagen: partido.imagen
            };

            await fillUpdateForm(datosFila);

        });

        tbody.appendChild(tr);
    });

    return tbody;
}



async function fillUpdateForm(datosFila){
    const formUpdate = document.getElementById('modal-form-update');
    console.log(datosFila);
    formUpdate.querySelector('[name="inputIdPartido"]').value = datosFila.idPartido;

    formUpdate.querySelector('[name="inputNombre"]').value = datosFila.nombre;

    formUpdate.querySelector('[name="inputSiglas"]').value = datosFila.siglas;
}

async function createModalUpdate() {
    const modalPadre = document.createElement('div');
    modalPadre.id = 'modalPadreUpdate';
    modalPadre.style.display = 'none';

    const contenidoModal = document.createElement('div');
    contenidoModal.className = 'contenidoModal';

    const form = await createFormUpdatePartidos();
    const closeButton = createCloseButton(modalPadre);

    const deleteButton = createDeleteButton();
    deleteButton.addEventListener('click', async () => {
        const formData = new FormData(form);
        const idPartido = formData.get('inputIdPartido');

        await deletePartido(idPartido);
        await generarContenidoEleccionPartidos();
    });

    contenidoModal.appendChild(closeButton);
    contenidoModal.appendChild(form);
    contenidoModal.appendChild(deleteButton);
    modalPadre.appendChild(contenidoModal);
    

    return modalPadre;
}