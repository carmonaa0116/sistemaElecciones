import { crearBotonCerrarSesion } from './utilidades.js';

export function generarContenidoVotante() {
    const main = document.querySelector("main");
    main.innerHTML = '';
    main.appendChild(crearBotonCerrarSesion());

    const header = document.createElement('header');
    header.classList.add('logoCivio');
    const a = document.createElement('a');
    a.href = '../main.php';
    const img = document.createElement('img');
    img.src = "../img/logoCivio.png";
    

    a.appendChild(img);
    header.appendChild(a);
    main.appendChild(header);


    const title = document.createElement('h1');
    title.textContent = 'CIVIO VOTACIONES';

    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'button-container';
    const voteButton = document.createElement('button');
    voteButton.textContent = 'VOTAR';
    const resultsButton = document.createElement('button');
    resultsButton.textContent = 'VER RESULTADOS';
    buttonContainer.appendChild(voteButton);
    buttonContainer.appendChild(resultsButton);

    main.appendChild(title);
    main.appendChild(buttonContainer);

    if (!document.body.contains(main)) {
        document.body.appendChild(main);
    }
}


