import { generarContenidoEleccionCandidatos } from "./adminEleccionCandidatos.js";
import { generarContenidoEleccionPartidos } from "./adminEleccionPartidos.js";
import { generarContenidoEleccionElecciones } from "./adminEleccionElecciones.js";
import { getCookieNombre } from "./apiAdmin.js";
import { generarContenidoACescrutinio } from "./adminEleccionEscrutinio.js";
document.addEventListener('DOMContentLoaded', async () => {
    const eleccion = await getCookieNombre('eleccion');
    console.log(eleccion.valor);
    const eleccionValor = eleccion.valor;
    generarContenidoPorEleccion(eleccionValor);
});

export async function generarContenidoPorEleccion(eleccion) {
    switch (eleccion) {
        case 'candidatos':
            await generarContenidoEleccionCandidatos();
            break;
        case 'partidos':
            await generarContenidoEleccionPartidos();
            break;
        case 'elecciones':
            await generarContenidoEleccionElecciones();
            break;
        case 'escrutinio':
            await generarContenidoACescrutinio();
            break;
        case 'finalizar':
            await generateMainContent(eleccion);
            break;
        default:
            console.log('Error');
            break;
    }
}