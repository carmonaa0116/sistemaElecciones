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

export async function getPartidosYVotosAutonomica(idEleccion, idLocalidad) {
    try {
        const response = await fetch('../../../controlador/select/selectPartidosYVotosAutonomica.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idEleccion: idEleccion, idLocalidad: idLocalidad })
        });

        if (!response.ok) {
            throw new Error('No se estableció la conexion con selectPartidosYVotosAutonomica.php');
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
    }
}

export async function getLocalidades(){
    try {
        const response = await fetch('../../../controlador/select/selectTodasLocalidad.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Error en la petición');
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

export async function getPartidosYVotosGenerales(idEleccion) {
    try {
        const response = await fetch('../../../controlador/select/selectPartidosYvotosEleccionesGenerales.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idEleccion: idEleccion })
        });

        if (!response.ok) {
            throw new Error('No se estableció la conexion con selectPartidosYVotosGenerales.php');
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
    }

}
export async function getEleccionesUsuario(idUsuario) {
    try {
        const response = await fetch('../../../controlador/select/selectEleccionesUsuario.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idUsuario: idUsuario })
        });

        if (!response.ok) {
            throw new Error('No se estableció la conexion con selectEleccionesUsuario.php');
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
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
        console.error('Error en getDatosUsuario() ', error);
    }
}

export async function getPartidosLocalidadEleccion(idLocalidad, idEleccion) {
    try {
        const response = await fetch('../../../controlador/select/selectPartidosLocalidadEleccion.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idLocalidad: idLocalidad, idEleccion: idEleccion })
        });

        if (!response.ok) {
            throw new Error('No se estableció la conexion con selectPartidosLocalidadEleccion.php');
        }

        const data = await response.json();
        console.log(data);
        return data;

    } catch (error) {
        console.error(error);
    }
}

export async function getPartidosLocalidad(idLocalidad) {
    try {
        const response = await fetch('../../../controlador/select/selectPartidosLocalidad.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idLocalidad: idLocalidad })
        });

        if (!response.ok) {
            throw new Error('No se estableció la conexion con selectPartidosLocalidad.php');
        }

        const data = await response.json();
        console.log(data);
        return data;

    } catch (error) {
        console.error(error);
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
        console.error('Error en getDatosCensoUsuario() ', error);
    }
}

export async function getCandiadatosPartidoLocalidad(idPartido, idLocalidad, idEleccion) {
    try {
        const response = await fetch('../../../controlador/select/selectCandidatosPartidoLocalidad.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idPartido: idPartido, idLocalidad: idLocalidad, idEleccion: idEleccion })
        });

        if (!response.ok) {
            throw new Error('No se estableció la conexion con selectCandidatosPartidoLocalidad.php');
        }    

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
    }
}

export async function getCandidatosPartido(idPartido) {
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idPartido: idPartido
        })
    };

    try {
        const response = await fetch('../../../controlador/select/selectCandidatosPartido.php', fetchOptions);

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
        console.error('Error en getCandidatosPartido() ', error);
    }

}
//TIene que devilver nombre y votos
export async function getResultadosEleccion(idEleccion) {
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idEleccion: idEleccion
        })
    };

    try {
        const response = await fetch('../../../controlador/select/selectResultados.php', fetchOptions);

        if (!response.ok) {
            throw new Error('Ha habido un error en la conexión con getDatosUsuarioCookies.php');
        }

        const data = await response.json();
        console.log(data);
        if (data.error) {
            console.error(data.error);
            return null;
        }

        return data || null;
    } catch (error) {
        console.error('Error en getPartidos() ', error);
    }
}
export async function actualizarUsuario({ correo, password }) {
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, password })
    };

    try {
        const response = await fetch('../../../controlador/update/updateUsuario.php', fetchOptions);

        if (!response.ok) {
            throw new Error('Error en la conexión con updateUsuario.php');
        }

        const data = await response.json();

        if (data.error) {
            console.error(data.error);
            throw new Error(data.error);
        }

        return data;
    } catch (error) {
        console.error('Error en actualizarUsuario():', error);
        throw error;
    }
}

export async function actualizarUsuarioEditarPerfil(nombre, apellido, correo, password, idUsuario, idCenso) {
    try {
        console.log('Entra en actualizarUsuarioEditarPerfil');
        console.log(nombre);
        console.log(apellido);
        console.log(correo);
        console.log(password);
        console.log(idUsuario);
        console.log(idCenso)
        const response = await fetch('../../../controlador/update/updateEditarPerfil.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombre,
                apellido: apellido,
                correo: correo,
                password: password,
                idUsuario: idUsuario,
                idCenso: idCenso
            })
        });

        if (!response.ok) {
            throw new Error('No se estableció la conexion con updateUsuarioEditarPerfil.php');
        }
        const data = await response.json();
        console.log(data);
        if (data.status === 'success') {
            alert('Has actualizado tu perfil');
        }
        return data;
    } catch (error) {
        console.error(error);
    }
}

export async function votarAutonomica(idEleccion, idPartido) {
    const datosUsuario = await getDatosUsuario();
    const datosCensoUsuario = await getDatosCensoUsuario(datosUsuario.idCenso);
    try {
        const response = await fetch('../../../controlador/insert/insertVotoAutonomico.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idEleccion: idEleccion,
                idPartido: idPartido,
                idUsuario: datosUsuario.idUsuario,
                idLocalidad: datosCensoUsuario.censo.idLocalidad
            })
        });

        if (!response.ok) {
            throw new Error('No se estableció la conexion con insertVotoAutonomica.php');
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
    }
}

export async function votarGeneral(idEleccion, idPartido) {

    const datosUsuario = await getDatosUsuario();

    try {
        const response = await fetch('../../../controlador/insert/insertVotoGeneral.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idEleccion: idEleccion,
                idPartido: idPartido,
                idUsuario: datosUsuario.idUsuario
            })
        });

        if (!response.ok) {
            throw new Error('No se estableció la conexion con insertVotoGeneral.php');
        }
        const data = await response.json();
        console.log(data);
        return data;

    } catch (error) {
        console.error(error);
    }
}