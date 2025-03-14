// RECOGIENDO EL MAIN
const main = document.querySelector("main");

// Crear elementos iniciales
main.innerHTML = "<h1>PANEL CANDIDATOS</h1>"

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
main.appendChild(select);

function generarTabla(resultadoBusqueda, data) {
    console.log(data)
}
