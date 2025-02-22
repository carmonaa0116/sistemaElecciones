import { getIdElecciones } from "./apiAdmin.js";
import { getDnisCenso } from "./apiAdmin.js";
import { getLocalidades } from "./apiAdmin.js";
import { getCandidatosNombre } from "./apiAdmin.js";
import { getCookieNombre } from "./apiAdmin.js";
import { createInput } from "./generarContenidoSinEleccion.js";
import { createSubmitButton } from "./generarContenidoSinEleccion.js";
import { insertarCandidato } from "./apiAdmin.js";
import { generarContenidoPorEleccion } from "./script-admin-main.js";

/*

ESTA PAGINA HAY QUE ELIMINARLA


*/



async function createModalInsert(eleccion) {
    const modalPadre = document.createElement('div');
    modalPadre.id = 'modalPadreInsert';
    modalPadre.style.display = 'none';
    const contenidoModal = document.createElement('div');
    contenidoModal.className = 'contenidoModal';

    const form = await createFormInsert(eleccion);
    console.log('FORMULARIO:');
    console.log(form);


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
    console.log(eleccion);
    switch (eleccion) {
        case 'candidatos':
            form.id = 'modal-form-insert';
            let dnisResponse = await getDnisCenso();
            dnisResponse = dnisResponse.value;

            const selectDni = createSelectDnis(dnisResponse, 'dni');
            const idElecciones = await getIdElecciones();

            console.log('ID de elecciones');
            console.log(idElecciones);
            const selectIdElecciones = await createSelectIdElecciones(idElecciones, 'idElecciones', 'id', 'id');
            console.log(selectIdElecciones);

            const localidades = await getLocalidades();
            const selectLocalidad = createSelectLocalidad(localidades, 'localidades');

            const submitButtonCandidatos = createSubmitButton();
            form.appendChild(selectDni);
            form.append(selectLocalidad);
            form.appendChild(selectIdElecciones);
            form.appendChild(submitButtonCandidatos);

            form.addEventListener('click', (event) => {
                event.preventDefault();
                const formData = new FormData(form);
                const dni = formData.get('select-opciones-dni');
                const idEleccion = formData.get('select-opciones-idElecciones');
                const localidad = formData.get('select-opciones-localidades');



            });


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
            form.id = 'modal-form-insert'; // Asegurar que el form tenga un ID

            const opcionesTipo = [{ value: 'Autonómica' }, { value: 'General' }];
            const selectTipo = createSelectTipos(opcionesTipo, 'tipo');
            const inputFechaInicio = createInput('date', 'fechaInicio', 'Fecha de Inicio');
            const inputFechaFin = createInput('date', 'fechaFin', 'Fecha de Fin');
            const submitButtonElecciones = createSubmitButton();

            form.appendChild(selectTipo);
            form.appendChild(inputFechaInicio);
            form.appendChild(inputFechaFin);
            form.appendChild(submitButtonElecciones);

            form.addEventListener('submit', (event) => {
                event.preventDefault();
                const formData = new FormData(form);
                const tipo = formData.get('select-opciones-tipo');
                const fechaInicio = formData.get('fechaInicio');
                const fechaFin = formData.get('fechaFin');

                const datos = {
                    tipo: tipo,
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin,

                }
                const fetchOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',

                    },
                    body: JSON.stringify(datos) // Solo para métodos que envían datos como POST o PUT
                }

                fetch('../../../controlador/insert/insertarAelecciones.php', fetchOptions)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('No se ha establecido la conexion con insertarAelecciones.php');
                        }
                        return response.json();

                    })
                    .then(data => {
                        if (data.exito) {
                            console.log(data.exito);
                            generateMainContent(eleccion)
                        } else if (data.error) {
                            console.log(data.error);
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    })

            });

            break;
        case 'escrutinio':

            break;
        case 'finalizar':

            break;

        default:
            console.log('Error');
            break;

    }

    return form;

}




function createSelectTipos(jsonTipos, nombreSelect) {
    const select = document.createElement('select');
    select.name = `select-opciones-${nombreSelect}`;

    jsonTipos.forEach(item => {
        const option = document.createElement('option');
        option.value = item.value;
        option.textContent = item.value;
        select.appendChild(option);
    });

    return select;
}

function createSelectPreferencia(jsonPreferencia, nombreSelect) {
    const select = document.createElement('select');
    select.name = nombreSelect;

    jsonPreferencia.forEach(item => {

    });
}




async function createSelect(jsonOpciones, nombreSelect) {
    // Verificamos si jsonOpciones es un array
    const opciones = Array.isArray(jsonOpciones) ? jsonOpciones : [];

    console.log('Ha entrado en createSelect con el siguiente array de opciones: ');
    console.log(opciones);

    // Crea el select
    const select = document.createElement('select');
    select.id = `select-opciones-${nombreSelect}`;

    // Recorre las opciones y crea los elementos <option>
    opciones.forEach(opcion => {
        console.log(opcion);
        const option = document.createElement('option');

        // Aquí simplemente asignamos el nombre de la localidad tanto al 'value' como al texto del option
        option.value = opcion;
        option.textContent = opcion;

        select.appendChild(option);
    });

    console.log('Sale de createSelect: ');
    console.log(select);
    return select;
}

async function insertarEleccion() {

}








