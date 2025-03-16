import { actualizarUsuarioEditarPerfil, getDatosCensoUsuario, getDatosUsuario } from './apiVotante.js';

generarContenido();

export async function generarContenido() {
    const main = document.querySelector('main');

    main.innerHTML = `
        <h1>EDITAR PERFIL</h1>
        <div class="container-perfil">
            <form class="perfil-form" autocomplete="off">
                <div class="contenido-inputs">
                    <div>
                        <label for="input-nombre">Nombre:</label>
                        <input type="text" id="input-nombre" name="input-nombre" autocomplete="off"><br><br>
                    </div>
                    <div>
                        <label for="input-apellido">Apellido:</label>
                        <input type="text" id="input-apellido" name="input-apellido" autocomplete="off"><br><br>
                    </div>
                    <div>
                        <label for="input-correo">Correo:</label>
                        <input type="email" id="input-correo" name="input-correo" autocomplete="off"><br><br>
                    </div>
                    <div>
                        <label for="input-password">Contraseña:</label>
                        <input type="password" id="input-password" name="input-password" autocomplete="new-password"><br><br>
                    </div>
                </div>
                <input type="submit" value="Actualizar">
            </form>
        </div>
    `;

    await fillContent();
}

async function fillContent() {
    const datosUsuario = await getDatosUsuario();
    const datosCensoUsuario = await getDatosCensoUsuario(datosUsuario.idCenso);

    console.log(datosCensoUsuario, datosUsuario);

    // Rellenar los campos del formulario con los datos del usuario
    document.getElementById('input-nombre').value = datosCensoUsuario.censo.nombre;
    document.getElementById('input-apellido').value = datosCensoUsuario.censo.apellido;
    document.getElementById('input-correo').value = datosCensoUsuario.censo.email;
    document.getElementById('input-password').value = '';

    document.querySelector('.perfil-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const nombre = document.getElementById('input-nombre').value;
        const apellido = document.getElementById('input-apellido').value;
        const correo = document.getElementById('input-correo').value;
        const password = document.getElementById('input-password').value;

        await actualizarUsuarioEditarPerfil(nombre, apellido, correo, password, datosUsuario.idUsuario, datosUsuario.idCenso);

        window.location.reload();
    });
}
