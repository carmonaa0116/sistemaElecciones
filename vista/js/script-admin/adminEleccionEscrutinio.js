import { getElecciones, actualizarEstadoEleccion } from "./apiAdmin.js";

export async function generarContenidoACescrutinio() {
    const main = document.querySelector('main');
    main.innerHTML = '';

    console.log('Ha entrado en adminEleccionEscrutinio.js');

    const h1 = createHeader();
    const h2 = document.createElement('h2');
    h2.textContent = 'ELIGE UNAS ELECCIONES PARA ADMINISTRARLAS';

    const divElecciones = document.createElement('div');
    divElecciones.id = 'divContenedorElecciones';

    await rellenarDivElecciones(divElecciones);

    const modal = createModal();

    main.appendChild(h1);
    main.appendChild(h2);
    main.appendChild(divElecciones);
    main.appendChild(modal);
}

function createHeader() {
    const h1 = document.createElement('h1');
    h1.textContent = `ADMINISTRACIÓN DE ESCRUTINIO`;
    return h1;
}

function createModal() {
    const divModal = document.createElement('div');
    divModal.className = 'modalInsert';
    divModal.style.display = 'none';
    divModal.style.position = 'fixed';
    divModal.style.top = '0';
    divModal.style.left = '0';
    divModal.style.width = '100%';
    divModal.style.height = '100%';
    divModal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    divModal.style.alignItems = 'center';
    divModal.style.justifyContent = 'center';

    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#600000';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '10px';
    modalContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    modalContent.style.textAlign = 'center';
    modalContent.style.maxWidth = '400px';

    const mensaje = document.createElement('p');
    mensaje.id = 'modalMensaje';

    const btnAbrir = document.createElement('button');
    btnAbrir.textContent = 'Abrir';
    btnAbrir.style.margin = '10px';
    btnAbrir.id = 'btnAbrir';

    const btnCerrar = document.createElement('button');
    btnCerrar.textContent = 'Cerrar';
    btnCerrar.style.margin = '10px';
    btnCerrar.id = 'btnCerrar';

    const btnFinalizar = document.createElement('button');
    btnFinalizar.textContent = 'Finalizar';
    btnFinalizar.style.margin = '10px';
    btnFinalizar.id = 'btnFinalizar';
    btnFinalizar.style.backgroundColor = 'red';
    btnFinalizar.style.color = 'white';

    const btnCancelar = document.createElement('button');
    btnCancelar.textContent = 'Cancelar';
    btnCancelar.style.margin = '10px';
    btnCancelar.onclick = () => {
        divModal.style.display = 'none';
    };

    modalContent.appendChild(mensaje);
    modalContent.appendChild(btnAbrir);
    modalContent.appendChild(btnCerrar);
    modalContent.appendChild(btnFinalizar);
    modalContent.appendChild(btnCancelar);
    divModal.appendChild(modalContent);

    return divModal;
}

function mostrarModal(idEleccion) {
    const modal = document.querySelector('.modalInsert');
    if (!modal) {
        console.error("El modal no se encontró en el DOM.");
        return;
    }

    const mensaje = document.getElementById('modalMensaje');
    if (mensaje) {
        mensaje.textContent = `Administrar elección Nº ${idEleccion}`;
    }

    modal.style.display = 'flex';

    document.getElementById('btnAbrir').onclick = async () => {
        actualizarEstadoEleccion(idEleccion, 'abierta');
        actualizarUIEleccion(idEleccion, 'abierta', 'green');
        modal.style.display = 'none';
    };

    document.getElementById('btnCerrar').onclick = async () => {
        actualizarEstadoEleccion(idEleccion, 'cerrada');
        actualizarUIEleccion(idEleccion, 'cerrada', 'orange');
        modal.style.display = 'none';
    };

    document.getElementById('btnFinalizar').onclick = async () => {
        actualizarEstadoEleccion(idEleccion, 'finalizada');
        actualizarUIEleccion(idEleccion, 'finalizada', 'red');
        modal.style.display = 'none';
    };
}

function actualizarUIEleccion(idEleccion, estado, color) {
    const divCambiado = document.querySelector(`#divEleccion-${idEleccion}`);
    if (divCambiado) {
        divCambiado.querySelector('.divEstado').style.backgroundColor = color;
        divCambiado.querySelector('.textoEstado').textContent = estado;
    }
}

async function rellenarDivElecciones(divElecciones) {
    const elecciones = await getElecciones();
    console.log(elecciones);

    elecciones.forEach((eleccion, index) => {
        setTimeout(() => {

            const divEleccion = document.createElement('div');
            divEleccion.classList.add(`divEleccion`);
            divEleccion.id = `divEleccion-${eleccion.idEleccion}`;
            divEleccion.style.opacity = 0;
            divEleccion.style.transition = 'opacity 0.5s ease-in-out';

            const divNumeroEleccion = document.createElement('div');
            const textoNumeroEleccion = document.createElement('p');
            textoNumeroEleccion.textContent = `ELECCIÓN Nº ${eleccion.idEleccion}`;
            divNumeroEleccion.appendChild(textoNumeroEleccion);

            const divEstado = document.createElement('div');
            divEstado.className = 'divEstado';
            const textoEstado = document.createElement('p');
            textoEstado.className = 'textoEstado';
            textoEstado.textContent = eleccion.estado;

            const divFechaInicio = document.createElement('div');
            divFechaInicio.textContent = `Inicio: ${eleccion.fechaInicio}`;
            
            const divFechaFin = document.createElement('div');
            divFechaFin.textContent = `Fin: ${eleccion.fechaFin}`;

            divEstado.style.backgroundColor = eleccion.estado === 'finalizada' ? 'red' : eleccion.estado === 'cerrada' ? 'orange' : 'green';
            divEstado.style.color = 'black';
            divEstado.appendChild(textoEstado);

            divEleccion.appendChild(divNumeroEleccion);
            divEleccion.appendChild(divFechaInicio);
            divEleccion.appendChild(divFechaFin);
            divEleccion.appendChild(divEstado);

            divElecciones.appendChild(divEleccion);

            setTimeout(() => {
                divEleccion.style.opacity = 1;
            }, 50);

            divEleccion.addEventListener('click', () => {
                mostrarModal(eleccion.idEleccion);
            });
        }, index * 500);
    });
}