import { generarContenidoVotante } from './generarContenidoVotante.js';
import { generarContenidoAdministrador } from './generarContenidoAdministrador.js';
import { generarContenidoCensista } from './generarContenidoCensista.js';

mostrarContenido();

async function mostrarContenido() {
    try {
        const response = await fetch('../../controlador/cookies/getDatosUsuarioCookies.php');
        if (!response.ok) {
            throw new Error('No se ha establecido conexión con getDatosUsuarioCookies.php');
        }

        const data = await response.json();

        if (data.error) {
            console.error('Error en los datos del usuario:', data.error);
        } else {
            switch (data.rol) {
                case 'Votante':
                    generarContenidoVotante();
                    break;
                case 'Administrador':
                    generarContenidoAdministrador();
                    break;
                case 'administrador':
                    generarContenidoAdministrador();
                    break;
                case 'censista':
                    generarContenidoCensista();
                    break;
                default:
                    console.log('Rol no reconocido:', data.rol);
            }
        }
    } catch (error) {
        console.error('Error en la petición:', error);
    }
}
