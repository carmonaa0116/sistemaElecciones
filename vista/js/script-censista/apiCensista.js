

setTimeout(async () => {
    const filterSelect = document.getElementById('filter-select');
    const btnInsertar = document.getElementById('btn-insertar');
    const censistasJSON = await getCensistas();
    actualizarTabla(censistasJSON);

    if (!btnInsertar) {
        console.error('No se encontró el botón insertar');
    }
    btnInsertar.addEventListener('click', async () => {
        const modalPadreInsert = document.getElementById('modalPadreInsert');
        modalPadreInsert.style.display = 'block';
    });

    filterSelect.addEventListener('change', async () => {
        const valorSeleccionado = filterSelect.value;
        const censistasFiltrados = await getCensistasConFiltro(valorSeleccionado);
        console.log(valorSeleccionado);
        actualizarTabla(censistasFiltrados);
    });

    const formInsert = document.getElementById('modal-form-insert');
    formInsert.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const datos = {};
        formData.forEach((value, key) => {
            datos[key] = value;
            console.log(key + ' ' + value);
        });

        datos['localidad'] = document.getElementById('select-localidad').value;

        console.log('Datos de Insertar: ');
        console.log(datos.localidad);
        console.log(datos.dni);
        console.log(datos.nombre);
        console.log(datos.apellido);
        console.log(datos.fechaNacimiento);
        console.log(datos.email);

        await insertarAlCenso(datos);
        actualizarTabla(await getCensistas());
    });
}, 250);

async function actualizarTabla(censistasJSON) {
    const tbody = document.getElementById('tbody-censo');
    if (!tbody) {
        console.error('No se encontró el tbody');
        return;
    }
    tbody.innerHTML = '';

    censistasJSON.censo.forEach(censista => {
        const tr = createTr(censista);

        tbody.appendChild(tr);

        tr.addEventListener('click', () => {
            const modalPadre = document.getElementById('modalPadreUpdate');
            console.log(modalPadre);
            modalPadre.style.display = 'block';
            const modalForm = document.getElementById('modal-form-update');
            if (modalForm) {
                const modalFormInputs = modalForm.querySelectorAll('input');
                const selectLocalidad = document.getElementById('select-localidad');

                selectLocalidad.value = censista.localidad;
                console.log(selectLocalidad.value);
                const option = document.querySelectorAll('option');
                option.forEach((opt) => {
                    if (opt.value === censista.localidad) {
                        opt.selected = true;
                    }
                });
                modalFormInputs[1].value = censista.dni;
                modalFormInputs[2].value = censista.nombre;
                modalFormInputs[3].value = censista.apellido;
                modalFormInputs[4].value = censista.fechaNacimiento;
                modalFormInputs[5].value = censista.email;

            } else {
                console.log('No se encontró el formulario del modal');
            }

            const btnActualizar = document.getElementById('btn-actualizar');
            btnActualizar.addEventListener('click', async (e) => {
                e.preventDefault();
                const censistaActualizado = await actualizarCensista();
                console.log(censistaActualizado);
                modalPadre.style.display = 'none';
                window.location.reload();
            });
            const btnEliminar = document.getElementById('btn-eliminar');
            btnEliminar.addEventListener('click', async (e) => {
                const idCenso = censista.idCenso;
                await eliminarCensista(idCenso);
                actualizarTabla(await getCensistas());
                console.log('Eliminado');
            });
        });
    });
}

function createTr(censista) {
    const tr = document.createElement('tr');

    const tdIdCenso = document.createElement('td');
    tdIdCenso.textContent = censista.idCenso;
    tr.appendChild(tdIdCenso);

    const tdDNI = document.createElement('td');
    tdDNI.textContent = censista.dni;
    tr.appendChild(tdDNI);

    const tdNombre = document.createElement('td');
    tdNombre.textContent = censista.nombre;
    tr.appendChild(tdNombre);

    const tdApellido = document.createElement('td');
    tdApellido.textContent = censista.apellido;
    tr.appendChild(tdApellido);

    const tdFechaNacimiento = document.createElement('td');
    tdFechaNacimiento.textContent = censista.fechaNacimiento;
    tr.appendChild(tdFechaNacimiento);

    const tdLocalidad = document.createElement('td');
    tdLocalidad.textContent = censista.localidad;
    tr.appendChild(tdLocalidad);

    const tdEmail = document.createElement('td');
    tdEmail.textContent = censista.email;
    tr.appendChild(tdEmail);

    return tr;
}

async function insertarAlCenso(datos) {
    try {
        const response = await fetch('../../../controlador/insert/insertarAlCenso.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        if (!response.ok) throw new Error('Error en la petición');
        const data = await response.json();
        if (data.error) {
            console.log(data.error);
        }
        if (data.exito) {
            console.log(data.exito);
        }
    } catch (error) {
        console.log(error);
    }
    const modalPadreInsert = document.getElementById('modalPadreInsert');
    modalPadreInsert.style.display = 'none';
}

async function eliminarCensista(idCenso) {
    try {
        const response = await fetch('../../../controlador/delete/deleteCensoId.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idCenso })
        });
        if (!response.ok) throw new Error('Error en la petición');
        window.location.reload();
    } catch (error) {
        console.error(error);
    }
}

async function actualizarCensista() {
    const form = document.getElementById('modal-form-update');
    const inputs = form.querySelectorAll('input');

    const dni = inputs[1].value;
    console.log(dni);
    const nombre = inputs[2].value;
    console.log(nombre);
    const apellido = inputs[3].value;
    console.log(apellido);
    const fechaNacimiento = inputs[4].value;
    console.log(fechaNacimiento);
    const localidad = document.getElementById('select-localidad').value;
    console.log(localidad);
    const email = inputs[5].value;
    console.log(email);

    const datos = {
        dni: dni,
        nombre: nombre,
        apellido: apellido,
        email: email,
        fechaNacimiento: fechaNacimiento,
        localidad: localidad
    };

    try {
        const response = await fetch('../../../controlador/update/updateUnCenso.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        if (!response.ok) throw new Error('Error en la petición');
        window.location.reload();
    } catch (error) {
        console.error(error);
    }
}

async function getCensistas() {
    try {
        const response = await fetch('../../../controlador/select/selectTodosCensoTabla.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Error en la petición');
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

async function getCensistasConFiltro(orden) {
    try {
        const response = await fetch('../../../controlador/select/selectTodosCensoFiltroTabla.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orden })
        });
        if (!response.ok) throw new Error('Error en la petición');
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

export async function getLocalidades() {
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
