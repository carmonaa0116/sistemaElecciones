const contenedor = document.getElementById('contenedor');
document.addEventListener('DOMContentLoaded', () => {
    generarFormularioLogin();
});

function generarFormularioLogin() {
    contenedor.innerHTML = '';
    const botonVolver = document.createElement('button');
    botonVolver.textContent = "Volver Atrás";
    botonVolver.id = "btn-volver";
    botonVolver.addEventListener('click', () => window.location.href = '../../index.html');

    const h1Login = document.createElement('h1');
    h1Login.textContent = "LOGIN";

    const divContenedorFormulario = document.createElement('div');
    divContenedorFormulario.id = "contenedorFormulario";

    const form = document.createElement('form');
    form.id = "form-login";

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



    const botonEnviar = document.createElement('button');
    botonEnviar.type = 'submit';
    botonEnviar.textContent = 'Iniciar sesión';

    form.appendChild(labelDni);
    form.appendChild(inputDni);
    form.appendChild(document.createElement('br'));
    form.appendChild(labelPassword);
    form.appendChild(inputPassword);
    form.appendChild(document.createElement('br'));
    form.appendChild(document.createElement('br'));
    form.appendChild(botonEnviar);

    const mensajeRegistrado = document.createElement('p');
    mensajeRegistrado.textContent = "¿No te has registrado? Haz clic aquí:";
    const enlaceLogin = document.createElement('a');
    enlaceLogin.href = "./register.html";
    enlaceLogin.textContent = "Registrarse";
    divContenedorFormulario.appendChild(form);

    divContenedorFormulario.appendChild(mensajeRegistrado);
    divContenedorFormulario.appendChild(enlaceLogin);
    
    const mensajeError = document.createElement('p');
    mensajeError.id = 'mensajeError';
    
    
    contenedor.appendChild(h1Login);
    contenedor.appendChild(divContenedorFormulario);
    contenedor.appendChild(botonVolver);
    contenedor.appendChild(mensajeError);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const dni = inputDni.value;
        console.log(dni);
        const password = inputPassword.value;
        console.log(password);
        const datos = {
            dni: dni,
            password: password
        };

        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        };

        fetch('../../controlador/auth/login.php', fetchOptions)
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
                        console.log(data.error);
                        mensajeError.textContent = data.error;
                    }
                })
                .catch(error => {
                    console.error("Error en la petición:", error);
                    mensajeError.textContent = "Hubo un error en la solicitud.";
                });


    });
}

function aniadirContraseniaRol(padre) {
    const divContrasenia = document.createElement('div');
    divContrasenia.id = 'divContrasenia';
    const inputContraseniaRol = document.createElement('input');
    inputContraseniaRol.type = "password";
    inputContraseniaRol.name = "nameContraseñaRol";
    inputContraseniaRol.required = true;

    divContrasenia.appendChild(inputContraseniaRol);
    padre.appendChild(divContrasenia);
}

function quitarContraseniaRol() {
    const divContrasenia = document.getElementById('divContrasenia');
    if (divContrasenia) {
        divContrasenia.remove();
    }
}
