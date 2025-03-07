document.addEventListener('DOMContentLoaded', generarFormularioRegistro);
const contenedor = document.getElementById("contenedor");

function generarFormularioRegistro() {
    contenedor.innerHTML = '';

    const botonVolver = document.createElement('button');
    botonVolver.textContent = "Volver Atrás";
    botonVolver.id = "btn-volver";
    botonVolver.addEventListener('click', () => window.location.href = '../../index.html');

    const h1Registro = document.createElement('h1');
    h1Registro.textContent = "REGISTRO";

    const divContenedorFormulario = document.createElement('div');
    divContenedorFormulario.id = "contenedorFormulario";

    const form = document.createElement('form');
    form.id = "form-registro";

    const labelDni = document.createElement('label');
    labelDni.textContent = "DNI:";
    labelDni.setAttribute('for', 'dni');

    const inputDni = document.createElement('input');
    inputDni.type = 'text';
    inputDni.id = 'dni';
    inputDni.name = 'dni';
    inputDni.placeholder = 'Introduce tu DNI';
    inputDni.required = true;

    const labelPassword = document.createElement('label');
    labelPassword.textContent = "Contraseña:";
    labelPassword.setAttribute('for', 'password');

    const inputPassword = document.createElement('input');
    inputPassword.type = 'password';
    inputPassword.id = 'password';
    inputPassword.name = 'password';
    inputPassword.placeholder = 'Introduce tu contraseña';
    inputPassword.required = true;

    const labelRepeatPassword = document.createElement('label');
    labelRepeatPassword.textContent = "Repetir Contraseña:";
    labelRepeatPassword.setAttribute('for', 'repeat-password');

    const inputRepeatPassword = document.createElement('input');
    inputRepeatPassword.type = 'password';
    inputRepeatPassword.id = 'repeat-password';
    inputRepeatPassword.name = 'repeat-password';
    inputRepeatPassword.placeholder = 'Repite tu contraseña';
    inputRepeatPassword.required = true;

    const botonEnviar = document.createElement('button');
    botonEnviar.type = 'submit';
    botonEnviar.textContent = 'Registrarse';

    // Mensaje de "Ya registrado"
    const mensaje = document.createElement('p');
    mensaje.id = "mensaje";
    mensaje.textContent = "¿Ya tienes cuenta? Inicia sesión aquí:";

    const enlaceLogin = document.createElement('a');
    enlaceLogin.href = "../../index.html";
    enlaceLogin.textContent = "Login";

    // Mensaje de error
    let mensajeError = document.createElement("p");
    mensajeError.id = "mensajeError";

    // Agregar los elementos al formulario
    form.appendChild(labelDni);
    form.appendChild(inputDni);
    form.appendChild(document.createElement('br'));
    form.appendChild(labelPassword);
    form.appendChild(inputPassword);
    form.appendChild(document.createElement('br'));
    form.appendChild(labelRepeatPassword);
    form.appendChild(inputRepeatPassword);
    form.appendChild(document.createElement('br'));
    form.appendChild(document.createElement('br'));
    form.appendChild(botonEnviar);

    // Agregar el formulario y los mensajes al contenedor
    divContenedorFormulario.appendChild(form);
    divContenedorFormulario.appendChild(mensaje);
    divContenedorFormulario.appendChild(enlaceLogin);


    // Agregar elementos al contenedor principal
    contenedor.appendChild(h1Registro);
    contenedor.appendChild(divContenedorFormulario);
    contenedor.appendChild(mensajeError);
    contenedor.appendChild(botonVolver);

    // Manejo del submit
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que el formulario se envíe automáticamente

        const dni = inputDni.value;
        console.log(dni);
        const password = inputPassword.value;
        console.log(password);
        const repeatPassword = inputRepeatPassword.value;
        console.log(repeatPassword);

        if (password !== repeatPassword) {
            mensajeError.textContent = "Las contraseñas no coinciden";
            console.log("Las contraseñas no coinciden");
            return;
        } else {
            mensajeError.textContent = '';
        }

        const body = {
            dni: dni,
            password: password
        };

        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };

        fetch('../../controlador/auth/registro.php', fetchOptions)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.exito) {
                        console.log(data.exito);
                        mensajeError.textContent = '';
                        window.location.href = "../html/main.php";
                    }
                    if (data.error) {
                        alert(data.error);
                    }
                })
                .catch(error => {
                    console.error("Error en la petición:", error);
                    mensaje.textContent = "Hubo un error en la solicitud.";
                });
    });
}

