<?php
require_once '../../bd/conectar.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$conexion = $conn;

// Asegurarnos de que los datos necesarios están presentes en la solicitud
if (isset($data['dni'], $data['idLocalidad'], $data['idEleccion'], $data['preferencia'], $data['idPartido'])) {
    // Obtener el ID de Censo
    $idCenso = getIdCenso($data['dni'], $conexion);
    // Obtener el ID de Localidad
    $idLocalidad = $data['idLocalidad']; // Usamos directamente el idLocalidad
    // Obtener el ID de Elección
    $idElecciones = $data['idEleccion'];
    // Preferencia
    $preferencia = $data['preferencia'];
    // Obtener el ID del Partido
    $idPartido = getIdPartido($data['idPartido'], $conexion);

    // Verificamos que los ID obtenidos sean válidos
    if ($idCenso && $idLocalidad && $idPartido) {
        // Preparamos la consulta para insertar el candidato
        $sql = "INSERT INTO candidato (idCenso, idLocalidad, idEleccion, preferencia, idPartido) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("iiisi", $idCenso, $idLocalidad, $idElecciones, $preferencia, $idPartido);

        // Ejecutamos la consulta
        if ($stmt->execute()) {
            echo json_encode(['success' => 'Candidato insertado correctamente']);
        } else {
            echo json_encode(['error' => 'Error al insertar candidato']);
        }
    } else {
        // Si alguno de los ID es inválido, mostramos un error con los datos recibidos
        echo json_encode([
            'error' => 'Datos inválidos',
            'debug' => [
                'received_data' => $data,
                'idCenso' => $idCenso,
                'idLocalidad' => $idLocalidad,
                'idPartido' => $idPartido
            ]
        ]);
    }
} else {
    // Si los datos necesarios no están presentes en la solicitud
    echo json_encode(['error' => 'Datos incompletos']);
}

// Función para obtener el ID de Censo
function getIdCenso($dni, $conexion)
{
    $sql = "SELECT idCenso FROM censo WHERE dni = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("s", $dni);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        return $row['idCenso'];
    } else {
        return null;
    }
}

// Función para obtener el ID de Localidad (ya no es necesario convertirlo, ya que envías el id)
function getIdPartido($partido, $conexion)
{
    $sql = "SELECT idPartido FROM partido WHERE idPartido = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $partido); // Ahora esperamos un ID numérico
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        return $row['idPartido'];
    } else {
        return null;
    }
}
