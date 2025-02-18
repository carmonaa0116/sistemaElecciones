import { generarContenidoVotante } from './generarContenidoVotante.js';

export function generarContenidoCensista() {
    generarContenidoVotante();
    const main = document.querySelector("main");
    const censistaButton = document.createElement('button');
    censistaButton.textContent = "PANEL DE CENSISTA";

    censistaButton.addEventListener('click', () => {
        window.location.href = './censista/gestionCenso.html';
    })

    main.appendChild(censistaButton);
}
