<?php
require_once '../../bd/conectar.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['idLocalidad'])) {
    $idLocalidad = $data['idLocalidad'];

    $conexion = $conn;

    try {
        $stmt = $conexion->prepare('SELECT nombre FROM localidad WHERE idLocalidad = ?');
        $stmt->bind_param('i', $idLocalidad);

        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            echo json_encode(['nombre' => $row['nombre']]);
        } else {
            echo json_encode(['error' => 'No se encontró el idLocalidad']);
        }

        $stmt->close();
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }

    $conexion->close();
} else {
    echo json_encode(['error' => 'idLocalidad no proporcionado']);
    exit;
}
