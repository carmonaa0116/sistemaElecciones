import { getDnisCenso, getIdElecciones, getLocalidades, getDatosCenso, getCandidatosNombre, insertarCandidato, getUnDniConIdCenso, getUnaLocalidadIdLocalidad, getUnaPreferenciaIdCandidato, updateCandidatoFormUpdate, deleteCandidato, getNombrePartidoConId, getElecciones, updateEleccionFormUpdate, enviarCorreoGanador } from "./apiAdmin.js";
import { createSubmitButton, createCloseButton, createDeleteButton, createLabeledField } from "./generarContenidoSinEleccion.js";
import { getPartidos } from "./apiAdmin.js";
import { createHeader } from "../main-content/utilidades.js";

export async function generarContenidoEleccionAEscrutinio() {

    const main = document.querySelector('main');

    main.innerHTML = `

        <div id="modalPadreInsert"></div>
        <h1>APERTURA O CIERRE DE ESCRUTINIO</h1>
        <div class="elecciones-container">
            <h2>ELECCIONES GENERALES</h2>
            <div id="elecciones-container-generales" class="elections-container">
                <!-- Aqui las elecciones generales -->
            </div>
            <h2>ELECCIONES AUTONOMICAS</h2>
            <div id="elecciones-container-autonomicas" class="elections-container">
                <!-- Aqui las elecciones autonomicas -->
            </div>
        </div>

    `;

    const contenidoModal = `

        <button type="submit" class="btn-close" id="cerrar">Cerrar</button>
        
        <div class="formularioModal">
        <h1>¿QUE QUIERES HACER CON LA ELECCION?</h1>
            <div class="flexModalSection">
            
                <div>
                    <button id="btn-abrir">Abrir</button>
                </div>
                <div>
                    <button id="btn-cerrar">Cerrar</button>
                </div>
                                <div>
                    <button id="btn-terminar">Terminar</button>
                </div>
            
            </div>
        </div>
    `;


    const contenedorElecciones = document.querySelector('.elecciones-container');
    const contenedorGenerales = document.getElementById('elecciones-container-generales');
    const contenedorAutonomicas = document.getElementById('elecciones-container-autonomicas');


    let modalPadre = document.getElementById('modalPadreInsert');
    modalPadre.style.display = 'none';
    modalPadre.innerHTML = contenidoModal;

    const contenedorBotones = document.querySelector('formularioModal');

    const cerrarBtn = document.getElementById('cerrar');
    let abrirBtn = document.getElementById('btn-abrir');
    let terminarBtn = document.getElementById('btn-terminar');
    let cerrarEleccionBtn = document.getElementById('btn-cerrar');

    fillElections(contenedorGenerales, contenedorAutonomicas);

    cerrarBtn.addEventListener("click", () => handleCerrarBtn(modalPadre))
    document.body.appendChild(main);
}


async function fillElections(contenedorGenerales, contenedorAutonomicas) {

    let elecciones = await getElecciones();
    console.log(elecciones)
    for (let eleccion of elecciones) {

        let idEleccion = eleccion.idEleccion;
        let tipoEleccion = eleccion.tipo;
        let estadoEleccion = eleccion.estado;
        let fechaInicioEleccion = eleccion.fechaInicio;
        let fechaFinEleccion = eleccion.fechaFin;

        let eleccionDiv = document.createElement('div');
        eleccionDiv.className = 'eleccion';
        if(eleccion.estado === "cerrada") {
            eleccionDiv.style.backgroundColor = "#602b00";
        } else if(eleccion.estado === "abierta") {
            eleccionDiv.style.backgroundColor = "#0b6000";
        } else if(eleccion.estado === "terminada") {
            eleccionDiv.style.backgroundColor = "#750000";
        }
        eleccionDiv.innerHTML = `
            <img style="width: 10vw; height: auto; margin: 10px;" src="../../img/${tipoEleccion === "general" ? "96.jpg" : "autonomicas.png"}" alt="${tipoEleccion}">
            <p><strong>Elección ${tipoEleccion} nº:</strong> ${idEleccion}</p>
            <p><strong>Estado:</strong> ${estadoEleccion}</p>
            <p><strong>Fecha Inicio:</strong> ${fechaInicioEleccion}</p>    
            <p><strong>Fecha Fin:</strong> ${fechaFinEleccion}</p>
        `;

        eleccionDiv.addEventListener('click', async (event) => {
            event.preventDefault();
            let modalPadre = document.getElementById('modalPadreInsert');
            modalPadre.style.display = 'block';
            const contenidoModal = `

            <button type="submit" class="btn-close" id="cerrar">Cerrar</button>
            
            <div class="formularioModal">
            <h1>¿QUE QUIERES HACER CON LA ELECCION?</h1>
                <div class="flexModalSection">
                
                    <div>
                        <button id="btn-abrir">Abrir</button>
                    </div>
                    <div>
                        <button id="btn-cerrar">Cerrar</button>
                    </div>
                    <div>
                        <button id="btn-terminar">Terminar</button>
                    </div>
                
                </div>
            </div>
        `;
            modalPadre.innerHTML = contenidoModal;

            let abrirBtn = document.getElementById('btn-abrir');
            let terminarBtn = document.getElementById('btn-terminar');
            let cerrarEleccionBtn = document.getElementById('btn-cerrar');

            abrirBtn.addEventListener('click', async () => {
                let estado = 'abierta';
                await updateEleccionFormUpdate(idEleccion, tipoEleccion, estado, fechaInicioEleccion, fechaFinEleccion);
                handleCerrarBtn(modalPadre);
                window.location.reload();
            });

            terminarBtn.addEventListener('click', async () => {
                let estado = 'finalizada';
                await updateEleccionFormUpdate(idEleccion, tipoEleccion, estado, fechaInicioEleccion, fechaFinEleccion);
                handleCerrarBtn(modalPadre);
                let enviarCorreo = await enviarCorreoGanador(idEleccion);
                console.log(enviarCorreo);
                window.location.reload();
                
            });

            cerrarEleccionBtn.addEventListener('click', async () => {
                let estado = 'cerrada';
                await updateEleccionFormUpdate(idEleccion, tipoEleccion, estado, fechaInicioEleccion, fechaFinEleccion);
                handleCerrarBtn(modalPadre);
                window.location.reload();
            });



        });

        if (tipoEleccion == 'general') {
            contenedorGenerales.appendChild(eleccionDiv);
        } else {
            contenedorAutonomicas.appendChild(eleccionDiv);
        }
    }
}

function handleCerrarBtn(modal) {
    modal.style.display = 'none';
}