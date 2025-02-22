
export function createInput(type, name, placeholder = '') {
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.placeholder = placeholder;
    return input;
}

export function createSubmitButton() {
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Enviar';
    return submitButton;
}

export function createCloseButton(modalPadre) {
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.textContent = 'Cerrar';
    closeButton.addEventListener('click', () => {
        modalPadre.style.display = 'none';
    });
    return closeButton;
}

