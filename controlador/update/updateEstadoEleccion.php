<?php

require_once '../../bd/conectar.php';

$data = json_decode(file_get_contents('php://input'), true);
$conexion = $conn;

if (isset($data['idEleccion']) && isset($data['estado'])) {
    $idEleccion = $data['idEleccion'];
    $estado = $data['estado'];

    // Actualizar la tabla candidato
    $sqlCandidato = "UPDATE eleccion SET estado = ? WHERE idEleccion = ?";
    $stmtCandidato = $conexion->prepare($sqlCandidato);

    if (!$stmtCandidato) {
        die(json_encode(['error' => 'Error en la preparación de la consulta de candidato']));
    }

    $stmtCandidato->bind_param('si', $estado, $idEleccion);

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
