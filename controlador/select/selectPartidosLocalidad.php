<?php
header('Content-Type: application/json');

require_once '../../bd/conectar.php';
$conexion = $conn;

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['idLocalidad'])) {
    $idLocalidad = $data['idLocalidad'];
    
    $sql = "SELECT idPartido FROM candidato WHERE idLocalidad = ? GROUP BY idPartido";
    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        echo json_encode(['error' => 'Error en la preparación de la consulta']);
        exit;
    }

    $stmt->bind_param('i', $idLocalidad);
    $stmt->execute();
    $result = $stmt->get_result();

    $partidos = [];
    while ($row = $result->fetch_assoc()) {
        $partidos[] = $row['idPartido'];
    }

    echo json_encode(['partidos' => $partidos]);
}