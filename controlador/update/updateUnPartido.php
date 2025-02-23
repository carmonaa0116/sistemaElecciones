<?php

require_once '../../bd\conectar.php';

$data = json_decode(file_get_contents('php://input'), true);
$conexion = $conn;

if (isset($data['idPartido']) && ($data['nombre']) && ($data['siglas'])) {
    $idPartido = $data['idPartido'];
    $nombre = $data['nombre'];
    $siglas = $data['siglas'];

    $sql = "UPDATE partido SET nombre = ?, siglas = ? WHERE idPartido = ?";
    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        die(json_encode(['error' => 'Error en la preparación de la consulta']));
    }

    $stmt->bind_param('sss', $nombre, $siglas, $idPartido);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['exito' => 'Partido actualizado correctamente']);
        } else {
            echo json_encode(['error' => 'No se realizaron cambios en el registro']);
        }
    } else {
        echo json_encode(['error' => 'Error al actualizar el partido']);
    }

    $stmt->close();
} else {
    echo json_encode(['error' => 'Hay datos de entrada incompletos']);
}
