// Seleccionamos el contenedor existente en el DOM
const contenedor = document.getElementById('contenedor');

// Creamos el div que contendrá los botones
const botonesOpciones = document.createElement('div');
botonesOpciones.id = 'botonesOpcionesIndex';

// Creamos el botón de iniciar sesión
const btnIniciarSesion = document.createElement('button');
btnIniciarSesion.id = 'btn-iniciarSesion';
btnIniciarSesion.textContent = 'Iniciar';

btnIniciarSesion.addEventListener('click', () => {
   window.location.href = "./vista/html/login.html"; 
});

// Creamos el botón de registrarse
const btnRegistrarse = document.createElement('button');
btnRegistrarse.id = 'btn-registrarse';
btnRegistrarse.textContent = 'Registrarse';

btnRegistrarse.addEventListener('click', () => {
   window.location.href = "./vista/html/register.html"; 
});

// Agregamos los botones al div contenedor
botonesOpciones.appendChild(btnIniciarSesion);
botonesOpciones.appendChild(btnRegistrarse);

// Agregamos el div con los botones al contenedor principal
contenedor.appendChild(botonesOpciones);