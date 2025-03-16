<?php
header('Content-Type: application/json');
require_once '../../bd/conectar.php';

$data = json_decode(file_get_contents('php://input'), true);

if ($data === null) {
    echo json_encode(['error' => 'Error al decodificar el JSON']);
    exit;
}
$conexion = $conn;

if (isset($data['idCandidato'], $data['dni'], $data['idLocalidad'], $data['idEleccion'], $data['preferencia'], $data['idPartido'])) {
    $idCandidato = $data['idCandidato'];
    $dni = $data['dni'];
    $idLocalidad = $data['idLocalidad'];
    $idEleccion = $data['idEleccion'];
    $preferencia = $data['preferencia'];
    $idPartido = $data['idPartido']; // Es un nombre, no un ID

    // Obtener ID del censo a partir del DNI
    $idCenso = getIdCenso($dni, $conexion);
    if ($idCenso === null) {
        echo json_encode(['error' => 'DNI no encontrado en el censo']);
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
    echo json_encode(
        [
            'error' => 'Hay datos de entrada incompletos',
            'datos_incompletos' => $data
        ]
    );
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

// Obtener ID del partido por nombre
