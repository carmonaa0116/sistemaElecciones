<?php
require_once '../../bd/conectar.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['idCenso'])) {
    $idCenso = $data['idCenso'];

    $conexion = $conn;

    try {
        $stmt = $conexion->prepare('SELECT c.nombre AS nombre, c.apellido AS apellido, l.nombre as localidad FROM censo c JOIN localidad l ON c.idLocalidad = l.idLocalidad WHERE c.idCenso = ?;');
        $stmt->bind_param('i', $idCenso);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            echo json_encode(['candidato' => $row]);
        } else {
            echo json_encode(['error' => 'No se encontró el idCenso']);
        }

        $stmt->close();
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }

    $conexion->close();
} else {
    echo json_encode(['error' => 'idCenso no proporcionado']);
}
