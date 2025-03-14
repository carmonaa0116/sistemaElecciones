<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['idLocalidad']) && isset($data['idEleccion'])) {
    $idLocalidad = $data['idLocalidad'];
    $idEleccion = $data['idEleccion'];

    require_once '../../bd/conectar.php';

    if ($conn->connect_error) {
        die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
    }

    $stmt = $conn->prepare("SELECT * FROM candidato WHERE idEleccion = ? AND idLocalidad = ?");
    if (!$stmt) {
        die(json_encode(['error' => 'Error en la consulta: ' . $conn->error]));
    }

    $stmt->bind_param("ii", $idEleccion, $idLocalidad);
    $stmt->execute();

    $result = $stmt->get_result();
    $candidatos = [];

    while ($row = $result->fetch_assoc()) {
        $candidatos[] = $row;
    }

    echo json_encode(['candidatos' => $candidatos]);

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'No se proporcionó el idLocalidad o el idEleccion']);
}
