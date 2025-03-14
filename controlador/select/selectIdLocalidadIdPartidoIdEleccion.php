<?php

require_once '../../bd/conectar.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

try {
    // Verificamos que la conexión es válida
    if (!$conn) {
        die(json_encode(['error' => 'Error en la conexión a la base de datos']));
    }

    $idEleccion = $data['idEleccion'] ?? null;

    if (!$idEleccion) {
        echo json_encode(['error' => 'idEleccion no proporcionado']);
        exit;
    }

    // Preparar la consulta con MySQLi
    $stmt = $conn->prepare("
        SELECT idLocalidad, idPartido, COUNT(*) as num_votos
        FROM voto 
        WHERE idEleccion = ? 
        GROUP BY idLocalidad, idPartido
        ORDER BY idLocalidad
    ");

    if (!$stmt) {
        echo json_encode(['error' => 'Error en la preparación de la consulta']);
        exit;
    }
    $stmt->bind_param("i", $idEleccion);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $datos = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode(['exito' => $datos]);
    } else {
        echo json_encode(['error' => 'No se encontraron votos']);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
