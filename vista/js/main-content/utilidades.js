export function crearBotonCerrarSesion() {
    const botonCerrarSesion = document.createElement('button');
    botonCerrarSesion.textContent = "CERRAR SESIÓN";
    botonCerrarSesion.id = 'cerrar-sesion';
    console.log("boton cerrar sesion");
    console.log(botonCerrarSesion);
    botonCerrarSesion.addEventListener('click', () => {
        console.log('hola')
        window.location.href = '../../index.html';
    });
    return botonCerrarSesion;
}

export function createHeader(texto) {
    const h1 = document.createElement('h1');
    h1.textContent = texto;
    return h1;
}
