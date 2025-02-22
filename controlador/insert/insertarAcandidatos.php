<?php
require_once '../../bd/conectar.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$conexion = $conn;

if (isset($data['dni']) && isset($data['localidad']) && isset($data['idEleccion']) && isset($data['preferencia'])) {
    $dni = $data['dni'];
    $idLocalidad = sacarIdLocalidad($data['localidad'], $conexion);

    // Verificar si idLocalidad es null
    if ($idLocalidad === null) {
        echo json_encode(['error' => 'La localidad no existe']);
        exit;
    }

    $idElecciones = $data['idEleccion'];
    $preferencia = $data['preferencia'];

    if (!comprobarIdCenso($dni, $conexion)) {
        echo json_encode(['error' => 'El dni no está en la base de datos']);
        exit;
    }

    $idCenso = obtenerIdCenso($dni, $conexion); // Obtener el idCenso

    if ($idCenso === null) {
        echo json_encode(['error' => 'No se pudo obtener el idCenso']);
        exit;
    }

    // Insertar los datos en la base de datos
    $sql = "INSERT INTO candidato (idCenso, idLocalidad, idEleccion, preferencia) VALUES (?, ?, ?, ?)";
    $stmt = $conexion->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("iiis", $idCenso, $idLocalidad, $idElecciones, $preferencia);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => 'Candidato añadido correctamente']);
        } else {
            echo json_encode(['error' => 'Error al insertar el candidato']);
        }

        $stmt->close();
    } else {
        echo json_encode(['error' => 'Error al preparar la consulta']);
    }
} else {
    echo json_encode([
        'error' => 'Datos faltantes',
        'datos_recibidos' => $data
    ]);
    exit;
}

function sacarIdLocalidad($localidad, $conexion)
{
    $sql = "SELECT idLocalidad FROM localidad WHERE nombre = ?";
    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        die(json_encode(['error' => 'Error en la preparación de la consulta: ' . $conexion->error]));
    }

    $stmt->bind_param('s', $localidad);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        return $row['idLocalidad'];
    } else {
        return null;
    }
}

function comprobarIdCenso($dni, $conexion)
{
    $sql = "SELECT idCenso FROM censo WHERE dni = ?";
    $stmt = $conexion->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("s", $dni);  // Cambiado a "s" para que acepte una cadena
        $stmt->execute();
        $stmt->store_result();

        // Si hay al menos una fila, el idCenso existe
        if ($stmt->num_rows > 0) {
            $stmt->close();
            return true;
        } else {
            $stmt->close();
            return false;
        }
    } else {
        return false; // Error al preparar la consulta
    }
}

function obtenerIdCenso($dni, $conexion)
{
    $sql = "SELECT idCenso FROM censo WHERE dni = ?";
    $stmt = $conexion->prepare($sql);
    $idCenso = null;
    if ($stmt) {
        $stmt->bind_param("s", $dni);  // Cambiado a "s" para que acepte una cadena
        $stmt->execute();
        $stmt->bind_result($idCenso);
        $stmt->fetch();
        $stmt->close();

        return $idCenso;
    } else {
        return null;  // Si no se puede obtener el idCenso
    }
}
