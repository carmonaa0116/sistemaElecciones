import { getDnisCenso, getIdElecciones, getLocalidades, getDatosCenso, getCandidatosNombre, insertarCandidato, getUnDniConIdCenso, getUnaLocalidadIdLocalidad, getUnaPreferenciaIdCandidato, updateCandidatoFormUpdate, deleteCandidato, getNombrePartidoConId, getElecciones, insertarEleccion, updateEleccionFormUpdate } from "./apiAdmin.js";
import { createSubmitButton, createCloseButton, createDeleteButton, createLabeledField } from "./generarContenidoSinEleccion.js";
import { getPartidos } from "./apiAdmin.js";
import { createHeader } from "../main-content/utilidades.js";

export async function generarContenidoEleccionElecciones() {
    
    const main = document.querySelector('main');
    
    main.innerHTML = `

        <div id="modalPadreInsert"></div>
        <h1>PANEL ELECCIONES</h1>
        <div class="gridTable">

            <div class="gridTitleHeader">

                <h2>idEleccion</h2>
                <h2>Tipo</h2>
                <h2>Estado</h2>
                <h2>Fecha de Inicio</h2>
                <h2>Fecha de Fin</h2>

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
                    <label for="select-opciones-estado">Estado:</label>
                    <select name="select-opciones-estado" id="select-opciones-estado"></select>
                </div>

                <div>
                    <label for="select-opciones-tipo">Tipo:</label>
                    <select name="select-opciones-tipo" id="select-opciones-tipo"></select>
                </div>
            
            </div>

            <div class="flexModalSection">
            
                <div>
                    <label for="select-opciones-fechainicio">Fecha de Inicio:</label>
                    <input type="date" name="select-opciones-fechainicio" id="select-opciones-fechainicio" />
                </div>

                <div>
                    <label for="select-opciones-fechafin">Fecha de Fin:</label>
                    <input type="date" name="select-opciones-fechafin" id="select-opciones-fechafin" />
                </div>
            
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


// AQUI SE CREA EL INSERT BUTTON DONDE CARGA INFORMACIÖN DENTRO DE LOS SELECTS
async function createInsertButton(borrarBtn, actualizarBtn, insertar) {
    const btnInsertar = document.createElement('button');
    btnInsertar.id = 'btn-insertar';
    btnInsertar.textContent = 'Insertar Eleccion';
    
    btnInsertar.addEventListener('click', async (event) => {
        
        event.preventDefault();

        const divPadre = document.getElementById('modalPadreInsert');
        divPadre.style.display = 'flex';
        insertar.style.display = 'block';
        borrarBtn.style.display = "none";
        actualizarBtn.style.display = "none";

        // RELLENANDO LOS CAMPOS DEL FORMULARIO
        await cargarSelects()

        insertar.addEventListener('click', async (event) => {

            // Prevent the default form submission
            event.preventDefault();

            // OBTENER LOS VALORES DE LOS SELECTS
            const tipoEleccion = document.getElementById('select-opciones-tipo').value;
            const fechaInicioEleccion = document.getElementById('select-opciones-fechainicio').value;
            const fechaFinEleccion = document.getElementById('select-opciones-fechafin').value;
            const estadoEleccion = document.getElementById('select-opciones-estado').value;

            let insertandoCandidato = await insertarEleccion(tipoEleccion, estadoEleccion, fechaInicioEleccion, fechaFinEleccion);
            console.log(insertandoCandidato);
        })


    });

    return btnInsertar;
}

// RELLENANDO LOS CAMPOS DE LOS FORMULARIOS
async function cargarSelects(){
    
    // AQUÍ EMPIEZA EL CÓDIGO PARA CARGAR LOS DATOS PARA EL MODAL
    function createEstadoSelect(){

        let estados = ["abierta", "cerrada", "finalizada"]
        let selectEstado = document.getElementById('select-opciones-estado');
        selectEstado.innerHTML = "";

        estados.forEach(estado => {
            let option = document.createElement('option');
            option.value = estado;
            option.textContent = estado;
            selectEstado.appendChild(option);
        })
    }

    function createTipoSelect(){

        let tipos = ["general", "autonomica"]
        let selectEstado = document.getElementById('select-opciones-tipo');
        selectEstado.innerHTML = "";

        tipos.forEach(tipo => {
            let option = document.createElement('option');
            option.value = tipo;
            option.textContent = tipo;
            selectEstado.appendChild(option);
        })

    }

    createEstadoSelect();
    createTipoSelect();
}

async function createGridTable(gridTable){

    let elecciones = await getElecciones();
    let modalPadre = document.getElementById('modalPadreInsert');
    const borrarBtn = document.getElementById('borrar');
    const actualizarBtn = document.getElementById('actualizar');
    const btnInsertar = document.getElementById('insertar');

    elecciones.forEach(async eleccion => {
        
        let idEleccion = eleccion.idEleccion;
        let tipoEleccion = eleccion.tipo;
        let estadoEleccion = eleccion.estado;
        let fechaInicioEleccion = eleccion.fechaInicio;
        let fechaFinEleccion = eleccion.fechaFin;

        const gridRow = document.createElement("div");
        let gridRowHTML = `

            <p>${idEleccion}</p>
            <p>${tipoEleccion}</p>
            <p>${estadoEleccion}</p>
            <p>${fechaInicioEleccion}</p>
            <p>${fechaFinEleccion}</p>
        
        `

        // ESTO ES CUANDO HACES CLIC ENCIMA DE UN CANDIDATO
        gridRow.addEventListener("click", async () => {
            
            modalPadre.style.display = 'flex';
            actualizarBtn.style.display = 'block';
            borrarBtn.style.display = 'block';
            btnInsertar.style.display = 'none';

            cargarSelects();

            // OBTENER LOS VALORES DE LOS SELECTS
            const tipoEleccionSelect = document.getElementById('select-opciones-tipo');
            const fechaInicioEleccionSelect = document.getElementById('select-opciones-fechainicio');
            const fechaFinEleccionSelect = document.getElementById('select-opciones-fechafin');
            const estadoEleccionSelect = document.getElementById('select-opciones-estado');

            console.log(tipoEleccion.value);
            console.log(fechaInicioEleccion.value);
            console.log(fechaFinEleccion.value);
            console.log(estadoEleccion.value);
            

            tipoEleccionSelect.value = tipoEleccion;
            fechaInicioEleccionSelect.value = fechaInicioEleccion;
            fechaFinEleccionSelect.value = fechaFinEleccion;
            estadoEleccionSelect.value = estadoEleccion;

            // GESTION DEL BORRARDO Y ACTUALIZACION
            borrarBtn.addEventListener('click', async (event) => {
                event.preventDefault();
                let borrado = await eliminar(candidato.idCandidato);
                console.log(borrado);
                createGridTable(gridTable);
            })

            actualizarBtn.addEventListener('click', async (event) => {

                let atributos = {
                    idEleccion: idEleccion,
                    tipoEleccion: tipoEleccionSelect.value,
                    estadoEleccion: estadoEleccionSelect.value,
                    fechaInicioEleccion: fechaInicioEleccionSelect.value,
                    fechaFinEleccion: fechaFinEleccionSelect.value
                }

                event.preventDefault();
                await updateEleccionFormUpdate(atributos);
            })
            
        
        })

        gridRow.innerHTML = gridRowHTML;
        gridTable.appendChild(gridRow);
        

    })

}

function handleCerrarBtn(modal){
    modal.style.display = 'none';
}