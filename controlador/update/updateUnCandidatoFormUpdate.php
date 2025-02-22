<?php

require_once '../../bd/conectar.php';

$data = json_decode(file_get_contents('php://input'), true);
$conexion = $conn;

if (isset($data['idCandidato']) && isset($data['dni']) && isset($data['localidad']) && isset($data['eleccion']) && isset($data['preferencia'])) {
    $idCandidato = $data['idCandidato'];
    $dni = $data['dni'];
    $localidad = $data['localidad'];
    $eleccion = $data['eleccion'];
    $preferencia = $data['preferencia'];

    // Actualizar la tabla candidato
    $sqlCandidato = "UPDATE candidato SET idCenso = (SELECT idCenso FROM censo WHERE dni = ? LIMIT 1), idLocalidad = (SELECT idLocalidad FROM localidad WHERE nombre = ? LIMIT 1), idEleccion = ?, preferencia = ? WHERE idCandidato = ?";
    $stmtCandidato = $conexion->prepare($sqlCandidato);

    if (!$stmtCandidato) {
        die(json_encode(['error' => 'Error en la preparación de la consulta de candidato']));
    }

    $stmtCandidato->bind_param('issss', $dni, $localidad, $eleccion, $preferencia, $idCandidato);

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
}
