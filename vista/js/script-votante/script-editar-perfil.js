import { crearBotonCerrarSesion } from "../main-content/utilidades.js";
import { actualizarUsuario, getDatosCensoUsuario, getDatosUsuario } from "./apiVotante.js";

document.addEventListener('DOMContentLoaded', () => {
    mostrarContenido();
});
async function mostrarContenido() {
    const main = document.querySelector('main');
    main.innerHTML = ""; // Limpiar contenido previo

    const botonCerrarSesion = crearBotonCerrarSesion();
    const header = createHeader();
    const h1 = document.createElement('h1');
    h1.textContent = "EDITAR PERFIL";

    const divContenido = document.createElement('div');
    divContenido.className = 'divContenido';

    const form = document.createElement('form');
    form.id = 'formEditarPerfil';

    // Obtener datos del usuario
    const datos = await getDatosUsuario();
    console.log(datos.idUsuario);
    const datosCenso = await getDatosCensoUsuario(datos.idUsuario);
    console.log(datosCenso);
    // Crear campos del formulario con valores prellenados
    const labelEmail = document.createElement('label');
    labelEmail.setAttribute('for', 'email');
    labelEmail.textContent = 'Nuevo Correo:';
    form.appendChild(labelEmail);

    const inputEmail = document.createElement('input');
    inputEmail.type = 'email';
    inputEmail.id = 'email';
    inputEmail.name = 'email';
    inputEmail.value = datosCenso.censo.email;
    inputEmail.required = true;
    form.appendChild(inputEmail);

    const labelPassword = document.createElement('label');
    labelPassword.setAttribute('for', 'password');
    labelPassword.textContent = 'Nueva Contraseña:';
    form.appendChild(labelPassword);

    const inputPassword = document.createElement('input');
    inputPassword.type = 'password';
    inputPassword.id = 'password';
    inputPassword.name = 'password';
    inputPassword.required = true;
    form.appendChild(inputPassword);

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Guardar Cambios';
    form.appendChild(submitButton);


    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const datos = await getDatosUsuario();
        const datosCenso = await getDatosCensoUsuario(datos.idUsuario);
        const idUsuario = datos.idUsuario;
        const idCenso = datosCenso.censo.idCenso;
        try {  
            await actualizarUsuario({ email, password, idUsuario, idCenso });
            alert('Perfil actualizado con éxito');
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            alert('Error al actualizar perfil');
        }
    });

    divContenido.appendChild(form);
    main.appendChild(botonCerrarSesion);
    main.appendChild(header);
    main.appendChild(h1);
    main.appendChild(divContenido);
}


function createHeader() {
    const header = document.createElement('header');
    header.className = 'logoCivio';

    const a = document.createElement('a');
    a.href = '../main.php';

    const img = document.createElement('img');
    img.src = '../../img/logoCivio.png';

    a.appendChild(img);
    header.appendChild(a);
    return header;
}
