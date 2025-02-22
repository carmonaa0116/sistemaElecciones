import { generarContenidoEleccionCandidatos } from "./adminEleccionCandidatos.js";
import { generarContenidoEleccionPartidos } from "./adminEleccionPartidos.js";
import { generarContenidoEleccionElecciones } from "./adminEleccionElecciones.js";
import { getCookieNombre } from "./apiAdmin.js";
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
            await generateMainContent(eleccion);
            break;
        case 'finalizar':
            await generateMainContent(eleccion);
            break;
        default:
            console.log('Error');
            break;
    }
}

async function generateMainContent(eleccion) {
    const main = document.createElement('main');
    const modalInsert = await createModalInsert(eleccion);
    //const modalUpdate = await createModalUpdate();
    const h1 = createHeader(eleccion);
    const btnInsertar = createInsertButton();
    const filterSelect = createFilterSelect();
    const divTabla = await createTableDiv(eleccion);

    main.appendChild(modalInsert);
    //main.appendChild(modalUpdate);
    main.appendChild(h1);
    main.appendChild(btnInsertar);
    main.appendChild(filterSelect);
    main.appendChild(divTabla);

    document.body.appendChild(main);
}
