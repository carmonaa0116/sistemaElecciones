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
        console.log(idCensoFinal);
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
        console.log(idLocalidadFinal);
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
        console.log(idCandidatoFinal);
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

        if (data.localidades && Array.isArray(data.localidades)) {
            const localidades = data.localidades.map(localidad => localidad.nombre); // Extraemos solo los nombres
            return localidades;
        } else {
            console.error('La estructura de datos no contiene un array de localidades');
            return []; // Devolvemos un array vacío si no encontramos el campo esperado
        }

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

export async function insertarEleccion(tipo, estado, fechaInicio, fechaFin) {
    try {
        const response = await fetch('../../../controlador/insert/insertarAeleccion.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tipo: tipo,
                estado: estado,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin
            })
        });

        if (!response.ok) {
            throw new Error('La respuesta no fue correcta');
        }
        const data = await response.json();
        if (data.exito) console.log(data.exito);
        if (data.error) {
            console.log(data.error);
            return null;
        }
    } catch (error) {
        console.error('Ha habido un problema con el fetch: ', error);
        throw error;
    }
}


export async function insertarCandidato(dni, localidad, idEleccion, preferencia) {
    try {
        const response = await fetch('../../../controlador/insert/insertarAcandidatos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dni: dni,
                localidad: localidad,
                idEleccion: idEleccion,
                preferencia: preferencia
            })
        });

        if (!response.ok) {
            throw new Error('La respuesta no fue correcta');
        }
        const data = await response.json();
        if (data.exito) console.log(data.exito);
        if (data.error) {
            console.log(data.error);
            return null;
        }
    } catch (error) {
        console.error('Ha habido un problema con el fetch: ', error);
        throw error;
    }
}

export async function insertarPartido(nombrePartido, siglasPartido) {
    try {
        const response = await fetch('../../../controlador/insert/insertarApartidos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombrePartido: nombrePartido,
                siglasPartido: siglasPartido
            })
        });

        if (!response.ok) {
            throw new Error('La respuesta no fue correcta');
        }
        const data = await response.json();
        if (data.exito) console.log(data.exito);
        if (data.error) {
            console.log(data.error);
            return null;
        }
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

export async function updateEleccionFormUpdate(atributos) {
    try {
        const response = await fetch('../../../controlador/update/updateUnaEleccionFormUpdate.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idEleccion: atributos.idEleccion,
                tipo: atributos.tipo,
                estado: atributos.estado,
                fechaInicio: atributos.fechaInicio,
                fechaFin: atributos.fechaFin
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


export async function updateCandidatoFormUpdate(atributos) {
    try {
        const response = await fetch('../../../controlador/update/updateUnCandidatoFormUpdate.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idCandidato: atributos.idCandidato,
                dni: atributos.dni,
                localidad: atributos.localidad,
                eleccion: atributos.eleccion,
                preferencia: atributos.preferencia
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

export async function updatePartido(datos) {
    try {
        const response = await fetch('../../../controlador/update/updateUnPartido.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
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

export async function actualizarEstadoEleccion(idEleccion, nuevoEstado){
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