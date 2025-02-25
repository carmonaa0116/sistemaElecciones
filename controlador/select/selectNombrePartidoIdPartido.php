<?php
require_once '../../bd/conectar.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['idPartido'])) {
    $idPartido = $data['idPartido'];

    $conexion = $conn;

    try {
        $stmt = $conexion->prepare('SELECT nombre FROM partido WHERE idPartido = ?');
        $stmt->bind_param('i', $idPartido);

        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            echo json_encode(['nombre' => $row['nombre']]);
        } else {
            echo json_encode(['error' => 'No se encontró el idCenso']);
        }

        $stmt->close();
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }

    $conexion->close();
} else {
    echo json_encode(['error' => 'idPartido no proporcionado']);
    exit;
}
