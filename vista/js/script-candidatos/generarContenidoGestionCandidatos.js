const main = document.querySelector("main");

// Crear elementos iniciales
const h1 = document.createElement('h1');
h1.textContent = 'SELECCIONA LA PERSONA';

const h2 = document.createElement('h2');
h2.textContent = 'BUSCAR POR...';

const select = document.createElement('select');
select.id = 'selectOptionsGcandidatos';

const valores = ['Selecciona uno', 'NOMBRE', 'DNI'];
valores.forEach(valor => {
    const option = document.createElement('option');
    option.value = valor;
    option.textContent = valor;
    select.appendChild(option);
});

// Añadir elementos al main
main.appendChild(h1);
main.appendChild(h2);
main.appendChild(select);

const resultadoBusqueda = document.createElement('div');
resultadoBusqueda.id = 'resultadoBusqueda';
resultadoBusqueda.innerHTML = '<p>Introduce un valor para buscar resultados</p>';
resultadoBusqueda.style.display = 'none'; // Oculto inicialmente
main.appendChild(resultadoBusqueda);

// Evento para manejar el cambio en el select
select.addEventListener('change', async (event) => {
    resultadoBusqueda.innerHTML = '';
    resultadoBusqueda.style.display = 'none'; // Ocultamos el div al cambiar la opción

    // Eliminar contenido anterior si existe
    let existingInputDiv = document.querySelector('.dynamic-input');
    if (existingInputDiv) {
        existingInputDiv.remove();
    }

    const selectedOption = event.target.value;

    if (selectedOption === 'NOMBRE') {
        // Crear un contenedor para el input
        const inputDiv = document.createElement('div');
        inputDiv.classList.add('dynamic-input');

        // Crear el label e input dinámicamente
        const label = document.createElement('label');
        label.textContent = selectedOption === 'NOMBRE' ? 'Introduce el nombre:' : 'Introduce el DNI:';
        label.setAttribute('for', `${selectedOption}-input`);

        const input = document.createElement('input');
        input.id = `${selectedOption}-input`;
        input.type = 'text';
        input.placeholder = selectedOption === 'NOMBRE' ? 'Escribe el nombre' : 'Escribe el DNI';

        // Añadir elementos al contenedor y luego al main
        inputDiv.appendChild(label);
        inputDiv.appendChild(input);
        main.appendChild(inputDiv);

        // Mover el div de resultados justo debajo del input
        main.appendChild(resultadoBusqueda);

        input.addEventListener('input', (event) => {
            const valor = event.target.value;

            const url = `../../../controlador/select/selectUnCensoNombre.php?nombre=${encodeURIComponent(valor)}`;

            if (valor !== '') {
                fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        resultadoBusqueda.innerHTML = '';
                        if (data.vacio) {
                            resultadoBusqueda.innerHTML = '<p>No existe alguien con ese nombre</p>';
                        } else {
                            generarTabla(resultadoBusqueda, data);
                        }
                        resultadoBusqueda.style.display = 'block'; // Mostrar el div de resultados
                    })
                    .catch(error => {
                        console.error("Error en la petición:", error);
                        resultadoBusqueda.innerHTML = `<p>Hubo un error en la solicitud: ${error.message}</p>`;
                        resultadoBusqueda.style.display = 'block';
                    });
            } else {
                resultadoBusqueda.innerHTML = '<p>Introduce un valor para buscar resultados</p>';
                resultadoBusqueda.style.display = 'block';
            }
        });
    } else if (selectedOption === 'DNI') {
        // Crear un contenedor para el input
        const inputDiv = document.createElement('div');
        inputDiv.classList.add('dynamic-input');

        // Crear el label e input dinámicamente
        const label = document.createElement('label');
        label.textContent = selectedOption === 'NOMBRE' ? 'Introduce el nombre:' : 'Introduce el DNI:';
        label.setAttribute('for', `${selectedOption}-input`);

        const input = document.createElement('input');
        input.id = `${selectedOption}-input`;
        input.type = 'text';
        input.placeholder = selectedOption === 'NOMBRE' ? 'Escribe el nombre' : 'Escribe el DNI';

        // Añadir elementos al contenedor y luego al main
        inputDiv.appendChild(label);
        inputDiv.appendChild(input);
        main.appendChild(inputDiv);

        // Mover el div de resultados justo debajo del input
        main.appendChild(resultadoBusqueda);

        input.addEventListener('input', (event) => {
            const valor = event.target.value;

            const url = `../../../controlador/select/selectUnCensoDni.php?dni=${encodeURIComponent(valor)}`;

            if (valor !== '') {
                fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        resultadoBusqueda.innerHTML = '';
                        if (data.vacio) {
                            resultadoBusqueda.innerHTML = '<p>No existe alguien con ese DNI</p>';
                        } else {
                            generarTabla(resultadoBusqueda, data);
                        }
                        resultadoBusqueda.style.display = 'block'; // Mostrar el div de resultados
                    })
                    .catch(error => {
                        console.error("Error en la petición:", error);
                        resultadoBusqueda.innerHTML = `<p>Hubo un error en la solicitud: ${error.message}</p>`;
                        resultadoBusqueda.style.display = 'block';
                    });
            } else {
                resultadoBusqueda.innerHTML = '<p>Introduce un valor para buscar resultados</p>';
                resultadoBusqueda.style.display = 'block';
            }
        });
    }
});

function generarTabla(resultadoBusqueda, data) {
    if (data.vacio) {
        resultadoBusqueda.innerHTML = '<p>No existe alguien con ese DNI</p>';
        return;
    }
    const censos = data.censo;
    const tabla = document.createElement('table');
    tabla.id = 'tablaCenso';
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const encabezados = ['DNI', 'Nombre', 'Apellido', 'Email', 'Fecha de Nacimiento', 'Localidad'];
    const filaEncabezados = document.createElement('tr');

    encabezados.forEach(texto => {
        const th = document.createElement('th');
        th.textContent = texto;
        filaEncabezados.appendChild(th);
    });

    thead.appendChild(filaEncabezados);
    tabla.appendChild(thead);

    censos.forEach(censo => {
        const fila = document.createElement('tr');

        const datosCenso = [
            censo.dni,
            censo.nombre,
            censo.apellido,
            censo.email,
            censo.fechaNacimiento,
            censo.localidad
        ];

        datosCenso.forEach(datoCenso => {
            const td = document.createElement('td');
            td.textContent = datoCenso;
            fila.appendChild(td);
        });

        fila.addEventListener('click', () => {
            console.log('fila: '+datosCenso[0]);
        });

        tbody.appendChild(fila);
    });

    tabla.appendChild(tbody);
    resultadoBusqueda.appendChild(tabla);
}
