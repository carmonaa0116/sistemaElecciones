import { crearBotonCerrarSesion } from './utilidades.js';

export function generarContenidoVotante() {
    const main = document.querySelector("main");
    main.innerHTML = '';


    const header = generateHader();
    const title = generateTitle();
    const buttonContainer = generateButtons();

    main.appendChild(crearBotonCerrarSesion());
    main.appendChild(header);
    main.appendChild(title);
    main.appendChild(buttonContainer);

    if (!document.body.contains(main)) {
        document.body.appendChild(main);
    }
}

function generateHader() {
    const header = document.createElement('header');
    header.classList.add('logoCivio');
    const a = document.createElement('a');
    a.href = '../main.php';
    const img = document.createElement('img');
    img.src = "../img/logoCivio.png";
    a.appendChild(img);
    header.appendChild(a);
    return header;
}

function generateTitle() {
    const title = document.createElement('h1');
    title.textContent = 'CIVIO VOTACIONES';
    return title;
}

function generateButtons() {

    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'button-container';

    const voteButton = document.createElement('button');
    voteButton.textContent = 'VOTAR';

    voteButton.addEventListener('click', () => {
        window.location.href = './votantes/gestionVotantes.html';
    });

    const resultsButton = document.createElement('button');
    resultsButton.textContent = 'VER RESULTADOS';

    buttonContainer.appendChild(voteButton);
    buttonContainer.appendChild(resultsButton);



    return buttonContainer;
}