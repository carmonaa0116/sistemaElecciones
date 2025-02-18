export function crearBotonCerrarSesion() {
    const botonCerrarSesion = document.createElement('button');
    botonCerrarSesion.textContent = "CERRAR SESIÓN";
    botonCerrarSesion.id = 'cerrar-sesion';
    console.log("boton cerrar sesion");
    console.log(botonCerrarSesion);
    botonCerrarSesion.addEventListener('click', () => {
        console.log("Cerrando sesión...");
        window.location.href = '../html/login.html';
    });

    return botonCerrarSesion;
}
