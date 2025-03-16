export async function getIdElecciones() {
    try {
        const response = await fetch('../../../controlador/select/selectIdElecciones.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Error en la petición');

        const data = await response.json();

        if (data.value) {
            // Cambiar 'id' a 'idEleccion' para acceder correctamente
            const idElecciones = data.value.map(eleccion => eleccion.idEleccion);
            return idElecciones;
        } else {
            console.error('La estructura de datos no contiene un array de elecciones');
            return [];
        }

    } catch (error) {
        console.error('Error en getIdElecciones:', error);
        return [];
    }
}

export async function enviarCorreoGanador(idEleccion) {
    try {
        const response = await fetch('../../../controlador/auth/correoGanador.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idEleccion: idEleccion })
        });
        if (!response.ok) throw new Error('Error en la petición');
        return await response.json();
    } catch (error) {
        console.error('Error en enviarCorreoGanador:', error);
        return error;
    }
}

export async function getDnisCenso() {
    try {
        const response = await fetch('../../../controlador/select/selectDnisCenso.php');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}

export async function getUnDniConIdCenso(idCenso) {
    try {
        const idCensoFinal = idCenso;
        const response = await fetch('../../../controlador/select/selectUnDniConIdCenso.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idCenso: idCensoFinal
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.error) console.error(data.error);
        return data;

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return error;
    }
}

export async function getUnaLocalidadIdLocalidad(idLocalidad) {
    try {
        const idLocalidadFinal = idLocalidad;

        const response = await fetch('../../../controlador/select/selectUnaLocalidadConIdLocalidad.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idLocalidad: idLocalidadFinal
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.error) console.error(data.error);
        return data;

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return error;
    }
}

export async function getUnaPreferenciaIdCandidato(idCandidato) {
    try {
        const idCandidatoFinal = idCandidato;

        const response = await fetch('../../../controlador/select/selectUnaPreferenciaIdCandidato.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idCandidato: idCandidatoFinal
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.error) console.error(data.error);
        return data;

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return error;
    }
}


export async function getLocalidades() {
    try {
        const response = await fetch('../../../controlador/select/selectTodasLocalidad.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Error en la petición');

        const data = await response.json();
        return await data;

    } catch (error) {
        console.error('Error en getLocalidades:', error);
        return []; // Devolvemos un array vacío en caso de error
    }
}

export async function getCandidatosNombre() {
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

export async function getCookieNombre(nombre) {
    try {
        const response = await fetch('../../../controlador/cookies/getUnaCookie.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombreCookie: nombre })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return { valor: data.valor };
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}

export async function insertarEleccion(tipo, estado, fechainicio, fechafin) {
    let formData = new FormData();
    formData.append('tipo', tipo);
    formData.append('estado', estado);
    formData.append('fechainicio', fechainicio);
    formData.append('fechafin', fechafin);

    try {
        const response = await fetch("../../../controlador/insert/insertarAeleccion.php", {
            method: 'POST',
            body: formData
        });

        const text = await response.text();  // Captura la respuesta como texto para depuración

        console.log("Respuesta del servidor:", text);

        const datos = JSON.parse(text);  // Intenta convertir a JSON

        return datos;
    } catch (error) {
        console.error("Error en la petición:", error);
    }
}



export async function insertarCandidato(dni, idLocalidad, idEleccion, preferencia, idPartido) {

    console.log('Entra en insertarCandidato');
    console.log('dni: ', dni);
    console.log('idLocalidad: ', idLocalidad);
    console.log('idEleccion: ', idEleccion);
    console.log('preferencia: ', preferencia);
    console.log('idPartido: ', idPartido);

    try {
        const response = await fetch('../../../controlador/insert/insertarAcandidatos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dni: dni,
                idLocalidad: idLocalidad,
                idEleccion: idEleccion,
                preferencia: preferencia,
                idPartido: idPartido
            })
        });

        if (!response.ok) {
            throw new Error('La respuesta no fue correcta');
        }
        const data = await response.json();
        if (data.exito) console.log(data.exito);
        if (data.error) {
            console.log(data);
            return null;
        }
    } catch (error) {
        console.error('Ha habido un problema con el fetch: ', error);
        throw error;
    }
}

export async function insertarPartido(nombre, siglas, imagenFile) {
    try {
        const reader = new FileReader();
        reader.readAsDataURL(imagenFile);

        reader.onload = async () => {
            const imagenBase64 = reader.result; // Imagen en formato Base64

            const response = await fetch('../../../controlador/insert/insertarApartidos.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: nombre,
                    siglas: siglas,
                    imagen: imagenBase64
                })
            });

            if (!response.ok) {
                throw new Error('La respuesta no fue correcta');
            }

            const data = await response.json();
            if (data.exito) alert(data.exito);
            if (data.error) {
                console.log(data.error);
                return null;
            }
        };
    } catch (error) {
        console.error('Ha habido un problema con el fetch: ', error);
        throw error;
    }
}


export async function getPreferenciasDisponibles(idLocalidad) {

}


export async function getNombrePartidos() {

    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch('../../../controlador/select/selectNombrePartidos.php', fetchOptions);

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
        if (data.partidos) {
            return data.partidos;
        }
        console.log(data.candidatos || 'Ha salido null');
        return await response.json();
    } catch (error) {
        console.error('Error en getCandidatosNombre:', error);
        return [];
    }
}

export async function getNombrePartidoConId(idPartido) {
    try {
        const response = await fetch('../../../controlador/select/selectNombrePartidoIdPartido.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idPartido: idPartido })
        });
        const data = await response.json();
        return await data;
    } catch (error) {
        console.error('Error en getNombrePartido', error);
        return [];
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
            throw new Error('Ha habido un error en la conexión con selectTodasEleccion.php');
        }
        const data = await response.json();  // Lee la respuesta solo una vez
        console.log('Respuesta de getElecciones: ');
        console.log(data);
        if (data.eleccion) {
            return data.eleccion;
        }
        console.log(data.candidatos || 'Ha salido null');
        return data;  // Ya no necesitas hacer otro .json()
    } catch (error) {
        console.error('Error en selectTodasEleccion:', error);
        return [];
    }
}

export async function updateEleccionFormUpdate(idEleccion, tipo, estado, fechaInicio, fechaFin) {
    try {
        const response = await fetch('../../../controlador/update/updateUnaEleccionFormUpdate.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idEleccion: idEleccion,
                tipo: tipo,
                estado: estado,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin
            })
        });
        if (!response.ok) {
            throw new Error('Ha habido un error en la conexión con updateUnaEleccionFormUpdate.php');
        }
        const data = await response.json();  // Lee la respuesta solo una vez
        console.log('Respuesta de updateUnaEleccionFormUpdate: ');
        console.log(data);
        if (data.exito) return data.exito;
        if (data.error) return data.error;

    } catch (error) {
        console.error('Error en updateCandidato: ', error);
    }
}


export async function updateCandidatoFormUpdate(idCandidato, dni, idPartido, idEleccion, preferencia, idLocalidad) {
    try {
        const response = await fetch('../../../controlador/update/updateUnCandidatoFormUpdate.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idCandidato: idCandidato,
                dni: dni,
                idPartido: idPartido,
                idEleccion: idEleccion,
                preferencia: preferencia,
                idLocalidad: idLocalidad
            })
        });
        if (!response.ok) {
            throw new Error('Ha habido un error en la conexión con selectTodasEleccion.php');
        }
        const data = await response.json();
        console.log('Respuesta de getElecciones: ');
        console.log(data);
        return data;

    } catch (error) {
        console.error('Error en updateCandidato: ', error);
    }
}

export async function deleteCandidato(idCandidato) {
    try {
        const response = await fetch('../../../controlador/delete/deleteCandidato.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idCandidato: idCandidato
            })
        });
        if (!response.ok) {
            throw new Error('Ha habido un error en la conexión con selectTodasEleccion.php');
        }
        const data = await response.json();  // Lee la respuesta solo una vez
        console.log('Respuesta de getElecciones: ');
        console.log(data);
        if (data.exito) return data.exito;
        if (data.error) return data.error;

    } catch (error) {
        console.error('Error en updateCandidato: ', error);
    }
}
export async function deleteEleccion(idEleccion) {
    try {
        const response = await fetch('../../../controlador/delete/deleteEleccion.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idEleccion: idEleccion
            })
        });
        if (!response.ok) {
            throw new Error('Ha habido un error en la conexión con deleteEleccion.php');
        }
        const data = await response.json();  // Lee la respuesta solo una vez
        console.log(data);
        if (data.exito) return data.exito;
        if (data.error) return data.error;

    } catch (error) {
        console.error('Error en updateCandidato: ', error);
    }
}

export async function updateEleccion(formData) {
    try {
        const response = await fetch('../../../controlador/update/updateEleccion.php', {
            method: 'POST',
            body: formData // Enviar FormData (sin headers!)
        });

        if (!response.ok) {
            throw new Error('Error en la conexión con updateUnPartido.php');
        }

        const data = await response.json();
        console.log('RESPUESTA:', data);

        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function updatePartido(idPartido, nombre, siglas, imagen) {
    try {
        const response = await fetch('../../../controlador/update/updateUnPartido.php', {
            method: 'POST',
            body: JSON.stringify({
                idPartido: idPartido,
                nombre: nombre,
                siglas: siglas,
                imagen: imagen
            })
        });

        if (!response.ok) {
            throw new Error('Error en la conexión con updateUnPartido.php');
        }

        const data = await response.json();
        console.log('RESPUESTA:', data);

        return alert(data.exito) || data.error;
    } catch (error) {
        console.error('Error:', error);
    }
}


export async function deletePartido(idPartido) {
    try {
        const response = await fetch('../../../controlador/delete/deletePartidoId.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idPartido: idPartido })
        })

        if (!response.ok) {
            throw new Error('Ha habido un error en la conexión con selectTodasEleccion.php');
        }
        const data = await response.json();
        console.log('RESPUESTA:');
        console.log(data);
        if (data.exito) return data.exito;
        if (data.error) return data.error;
    } catch (error) {

    }
}

export async function actualizarEstadoEleccion(idEleccion, nuevoEstado) {
    console.log(idEleccion);
    console.log(nuevoEstado);
    try {
        const response = await fetch('../../../controlador/update/updateEstadoEleccion.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idEleccion: idEleccion,
                estado: nuevoEstado
            })
        });
        if (!response.ok) {
            throw new Error('Ha habido un error en la conexión con selectTodasEleccion.php');
        }
        const data = await response.json();
        console.log('RESPUESTA:');
        console.log(data);
        if (data.exito) return data.exito;
        if (data.error) return data.error;
    } catch (error) {

    }
}

export async function getDatosCenso(idCenso) {
    try {
        const response = await fetch('../../../controlador/select/selectUnCensoIdCenso.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idCenso: idCenso
            })
        });
        if (!response.ok) {
            throw new Error('Ha habido un error de conexion con selectUnCensoIdCenso.php');
        }
        return await response.json();
        
    } catch (error) { }
}