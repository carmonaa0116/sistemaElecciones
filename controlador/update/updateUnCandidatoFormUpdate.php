<?php

require_once '../../bd/conectar.php';

$data = json_decode(file_get_contents('php://input'), true);
$conexion = $conn;

if (isset($data['idCandidato'], $data['dni'], $data['localidad'], $data['eleccion'], $data['preferencia'], $data['idPartido'])) {
    $idCandidato = $data['idCandidato'];
    $dni = $data['dni'];
    $localidad = $data['localidad'];
    $idEleccion = $data['eleccion'];
    $preferencia = $data['preferencia'];
    $nombrePartido = $data['idPartido']; // Es un nombre, no un ID

    // Obtener ID del censo a partir del DNI
    $idCenso = getIdCenso($dni, $conexion);
    if ($idCenso === null) {
        echo json_encode(['error' => 'DNI no encontrado en el censo']);
        exit;
    }

    // Obtener ID de la localidad a partir del nombre
    $idLocalidad = getIdLocalidad($localidad, $conexion);
    if ($idLocalidad === null) {
        echo json_encode(['error' => 'Localidad no encontrada']);
        exit;
    }

    // Obtener ID del partido a partir del nombre
    $idPartido = getIdPartido($nombrePartido, $conexion);
    if ($idPartido === null) {
        echo json_encode(['error' => 'Partido no encontrado']);
        exit;
    }

    // Actualizar datos del candidato
    $sqlCandidato = "UPDATE candidato SET idCenso = ?, idLocalidad = ?, idEleccion = ?, preferencia = ?, idPartido = ? WHERE idCandidato = ?";
    $stmtCandidato = $conexion->prepare($sqlCandidato);

    if (!$stmtCandidato) {
        echo json_encode(['error' => 'Error en la preparación de la consulta de candidato']);
        exit;
    }

    $stmtCandidato->bind_param('iiiiii', $idCenso, $idLocalidad, $idEleccion, $preferencia, $idPartido, $idCandidato);

    if ($stmtCandidato->execute()) {
        if ($stmtCandidato->affected_rows > 0) {
            echo json_encode(['exito' => 'Candidato actualizado correctamente']);
        } else {
            echo json_encode(['error' => 'No se realizaron cambios en el candidato']);
        }
    } else {
        echo json_encode(['error' => 'Error al actualizar el candidato']);
    }

    $stmtCandidato->close();
} else {
    echo json_encode(['error' => 'Hay datos de entrada incompletos']);
    exit;
}

// Obtener ID del censo por DNI
function getIdCenso($dni, $conexion) {
    $sql = "SELECT idCenso FROM censo WHERE dni = ? LIMIT 1";
    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        echo json_encode(['error' => 'Error en la preparación de la consulta de censo']);
        exit;
    }

    $stmt->bind_param('s', $dni);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        return $row['idCenso'];
    } else {
        return null;
    }
}

// Obtener ID de la localidad por nombre
function getIdLocalidad($localidad, $conexion) {
    $sql = "SELECT idLocalidad FROM localidad WHERE nombre = ?";
    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        return null;
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

// Obtener ID del partido por nombre
function getIdPartido($nombrePartido, $conexion) {
    $sql = "SELECT idPartido FROM partido WHERE nombre = ?";
    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        return null;
    }

    $stmt->bind_param('s', $nombrePartido);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        return $row['idPartido'];
    } else {
        return null;
    }
}
