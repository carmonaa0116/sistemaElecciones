<?php
require_once '../../bd/conectar.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['idPartido'])) {
    $idPartido = $data['idPartido'];

    $conexion = $conn;

    try {
        $stmt = $conexion->prepare("SELECT * FROM partido");
        $stmt->bind_param('i', $idPartido);

        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            echo json_encode(['nombresPartido' => $row['nombre']]);
        } else {
            echo json_encode(['error' => 'No se encontró el idPartido']);
        }

        $stmt->close();
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage(), 'idPartido' => $idPartido]);
    }

    $conexion->close();
} else {
    echo json_encode(['error' => 'idPartido no proporcionado']);
    exit;
}
