export async function getCandidatos() {
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch('../../../controlador/select/selectTodosCandidatos.php', fetchOptions);

        if (!response.ok) {
            throw new Error('Ha habido un error en la conexión con selectTodosCandidatos.php');
        }

        const data = await response.json();

        if (data.error) {
            console.error(data.error);
            return null;
        }

        return data.candidatos || null;

    } catch (error) {
        console.error('Error en getCandidatosNombre:', error);
        return [];
    }
}

export async function getPartidos() {
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch('../../../controlador/select/selectTodosPartidos.php', fetchOptions);

        if (!response.ok) {
            throw new Error('Ha habido un error en la conexión con selectTodosCandidatos.php');
        }

        const data = await response.json();

        if (data.error) {
            console.error(data.error);
            return null;
        }

        return data || null;
    } catch (error) {
        console.error('Error en getPartidos() ', error);
    }
}

export async function getElecciones() {
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch('../../../controlador/select/selectTodasEleccion.php', fetchOptions);

        if (!response.ok) {
            throw new Error('Ha habido un error en la conexión con selectTodosCandidatos.php');
        }

        const data = await response.json();

        if (data.error) {
            console.error(data.error);
            return null;
        }

        return data || null;
    } catch (error) {
        console.error('Error en getPartidos() ', error);
    }
}

export async function votar(data) {
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            idUsuario: data.idUsuario,
            idEleccion: data.idEleccion,
            idPartido: data.idPartido,
            email: data.email,
            idLocalidad: data.idLocalidad,
            idCandidato: data.idCandidato
        })

    };

    try {
        const response = await fetch('../../../controlador/insert/insertRegistro_Votantes.php', fetchOptions);

        if (!response.ok) {
            throw new Error('Ha habido un error en la conexión con insertRegistro_Votantes.php');
        }

        const data = await response.json();

        if (data.error) {
            console.error(data.error);
            return null;
        }

        return data || null;
    } catch (error) {
        console.error(`Error en votar(): ${error}`);
        console.log(error);
    }
}


export async function getDatosUsuario() {
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch('../../../controlador/cookies/getDatosUsuarioCookies.php', fetchOptions);

        if (!response.ok) {
            throw new Error('Ha habido un error en la conexión con getDatosUsuarioCookies.php');
        }

        const data = await response.json();
        if (data.error) {
            console.error(data.error);
            return null;
        }

        return data || null;
    } catch (error) {
        console.error('Error en getPartidos() ', error);
    }
}

export async function getDatosCensoUsuario(idCenso) {
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idCenso: idCenso
        })
    };

    try {
        const response = await fetch('../../../controlador/select/selectUnCensoIdCenso.php', fetchOptions);

        if (!response.ok) {
            throw new Error('Ha habido un error en la conexión con getDatosUsuarioCookies.php');
        }

        const data = await response.json();
        if (data.error) {
            console.error(data.error);
            return null;
        }

        return data || null;
    } catch (error) {
        console.error('Error en getPartidos() ', error);
    }
}