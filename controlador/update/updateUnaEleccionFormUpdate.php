<?php

require_once '../../bd/conectar.php';

$data = json_decode(file_get_contents('php://input'), true);
$conexion = $conn;

if (isset($data['idEleccion']) && isset($data['tipo']) && isset($data['fechaInicio']) && isset($data['fechaFin'])) {
    $idEleccion = $data['idEleccion'];
    $tipo = $data['tipo'];
    $estado = $data['estado'];
    $fechaInicio = $data['fechaInicio'];
    $fechaFin = $data['fechaFin'];

    // Actualizar la tabla candidato
    $sqlCandidato = "UPDATE eleccion SET tipo = ?, fechaInicio = ?, fechaFin = ? WHERE idEleccion = ?";
    $stmtCandidato = $conexion->prepare($sqlCandidato);

    if (!$stmtCandidato) {
        die(json_encode(['error' => 'Error en la preparación de la consulta de candidato']));
    }

    $stmtCandidato->bind_param('sssi', $tipo, $fechaInicio, $fechaFin, $idEleccion);

    if ($stmtCandidato->execute()) {
        if ($stmtCandidato->affected_rows > 0) {
            echo json_encode(['exito' => 'Eleccion actualizada correctamente']);
        } else {
            echo json_encode(['error' => 'No se realizaron cambios en la eleccion']);
        }
    } else {
        echo json_encode(['error' => 'Error al actualizar la eleccion']);
    }

    $stmtCandidato->close();
} else {
    echo json_encode(['error' => 'Hay datos de entrada incompletos']);
}
