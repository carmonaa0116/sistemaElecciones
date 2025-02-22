<?php
require_once '../../bd/conectar.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['idCandidato'])) {
    $idCandidato = $data['idCandidato'];

    $conexion = $conn;

    try {
        $stmt = $conexion->prepare('SELECT preferencia FROM candidato WHERE idCandidato = ?');
        $stmt->bind_param('i', $idCandidato);

        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            echo json_encode(['preferencia' => $row['preferencia']]);
        } else {
            echo json_encode(['error' => 'No se encontró el idCandidato']);
        }

        $stmt->close();
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }

    $conexion->close();
} else {
    echo json_encode(['error' => 'idCandidato no proporcionado']);
    exit;
}
