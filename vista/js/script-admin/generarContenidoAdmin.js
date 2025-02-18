
document.addEventListener('DOMContentLoaded', async () => {
    const eleccion = await getCookieNombre('eleccion');
    console.log(eleccion.valor);
    const eleccionValor = eleccion.valor;
    generarContenidoPorEleccion(eleccionValor);
});

async function generarContenidoPorEleccion(eleccion) {
    switch (eleccion) {
        case 'candidatos':
            console.log('Candidatos');
            await generarContenidoCandidatosAdmin(eleccion);
            break;
        case 'partidos':
            console.log('Partidos');
            await generarContenidoPartidosAdmin(eleccion);
            break;
        case 'elecciones':
            console.log('Elecciones');
            await generarContenidoEleccionesAdmin(eleccion);
            break;
        case 'escrutinio':
            console.log('Escrutinio');
            await generarContenidoEscrutinioAdmin(eleccion);
            break;
        case 'finalizar':
            console.log('Finalizar');
            await generarContenidoFinalizarAdmin(eleccion);
            break;

        default:
            console.log('Error');
            break;
    }
}

async function generarContenidoCandidatosAdmin(eleccion) {
    // Lógica para generar contenido de candidatos
    console.log('Generando contenido de candidatos');
    await generateMainContent(eleccion);
}

async function generarContenidoPartidosAdmin(eleccion) {
    // Lógica para generar contenido de partidos
    console.log('Generando contenido de partidos');
    await generateMainContent(eleccion);
}

async function generarContenidoEleccionesAdmin(eleccion) {
    // Lógica para generar contenido de elecciones
    console.log('Generando contenido de elecciones');
    await generateMainContent(eleccion);
}

async function generarContenidoEscrutinioAdmin(eleccion) {
    // Lógica para generar contenido de escrutinio
    console.log('Generando contenido de escrutinio');
    await generateMainContent(eleccion);
}

async function generarContenidoFinalizarAdmin(eleccion) {
    // Lógica para generar contenido de finalizar
    console.log('Generando contenido de finalizar');
    await generateMainContent(eleccion);
}

async function getCookieNombre(nombre) {
    try {
        const response = await fetch('../../../controlador/cookies/getUnaCookie.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombreCookie: nombre })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return { valor: data.valor };
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}


async function generateMainContent(eleccion) {
    const main = document.createElement('main');
    const modalInsert = await createModalInsert(eleccion);
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

async function createModalInsert(eleccion) {
    const modalPadre = document.createElement('div');
    modalPadre.id = 'modalPadreInsert';
    modalPadre.style.display = 'none';
    const contenidoModal = document.createElement('div');
    contenidoModal.className = 'contenidoModal';

    const form = await createFormInsert(eleccion);

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

async function createFormInsert(eleccion) {
    const form = document.createElement('form');
    switch (eleccion) {
        case 'candidatos':
            form.id = 'modal-form-insert';

            const selectDni = await createSelect(await getDnisCenso(), 'dni', 'dni', 'dni');
            const selectLocalidades = await createSelect(await getLocalidades(), 'localidad', 'id', 'nombre');
            const selectIdElecciones = createSelect(await getIdElecciones(), 'idElecciones', 'id', 'id');
            const submitButtonCandidatos = createSubmitButton();

            form.appendChild(selectDni);
            form.appendChild(selectLocalidades);
            form.appendChild(selectIdElecciones);
            form.appendChild(submitButtonCandidatos);
            break;
        case 'partidos':
            form.id = 'modal-form-insert';

            const inputNombrePartido = createInput('text', 'nombrePartido', 'Nombre del partido');
            const inputSiglasPartido = createInput('text', 'siglasPartido', 'Siglas del partido');
            const submitButtonPartidos = createSubmitButton();

            form.appendChild(inputNombrePartido);
            form.appendChild(inputSiglasPartido);
            form.appendChild(submitButtonPartidos);

            break;
        case 'elecciones':
            const selectTipo = createSelect([{ value: 'autonómica' }, { value: 'general' }], 'tipo', 'value', 'value');
            const selectEstado = createSelect([{ value: 'abierta' }, { value: 'cerrada' }, {value: 'finalizada'}], 'estado', 'value', 'value');
            const inputFechaInicio = createInput('date', 'fechaInicio');
            const fechaFin = createInput('date', 'fechaFin');
            const submitButtonElecciones = createSubmitButton();

            form.appendChild(selectTipo);
            form.appendChild(selectEstado);
            form.appendChild(inputFechaInicio);
            form.appendChild(fechaFin);
            form.appendChild(submitButtonElecciones);
            break;
        case 'escrutinio':

            break;
        case 'finalizar':

            break;

        default:
            console.log('Error');
            break;

    }

}

function createInput(type, name, placeholder = '') {
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.placeholder = placeholder;
    return input;
}

async function createSelect(jsonOpciones, nombreSelect, keyValue, keyText) {
    // Accede al array que contiene las opciones, si jsonOpciones no es un array directamente
    const opciones = Array.isArray(jsonOpciones) ? jsonOpciones : jsonOpciones[Object.keys(jsonOpciones)[0]];
    console.log(opciones);

    // Crea el select
    const select = document.createElement('select');
    select.id = `select-optiones-${nombreSelect}`;

    // Recorre las opciones y crea los elementos <option>
    opciones.forEach(opcion => {
        const option = document.createElement('option');
        
        option.value = opcion[keyValue];  // 'keyValue' es la clave para el valor
        option.textContent = opcion[keyText];  // 'keyText' es la clave para el texto mostrado

        select.appendChild(option);
    });

    return select;
}


async function getDnisCenso() {
    try {
        const response = await fetch('../../../controlador/select/selectDnisCenso.php');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}

async function getLocalidades() {
    try {
        const response = await fetch('../../../controlador/select/selectTodasLocalidad.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Error en la petición');
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

async function getIdElecciones() {
    try {
        const response = await fetch('../../../controlador/select/selectIdElecciones.php');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}
function createSubmitButton() {
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Enviar';
    return submitButton;
}

