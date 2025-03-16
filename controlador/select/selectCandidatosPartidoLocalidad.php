<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

// Verifica si los datos llegan correctamente
error_log(print_r($data, true));

require_once('../../bd/conectar.php');
$conexion = $conn;

if (isset($data['idPartido'], $data['idLocalidad'], $data['idEleccion'])) {
    $idPartido = $data['idPartido'];
    $idLocalidad = $data['idLocalidad'];
    $idEleccion = $data['idEleccion'];

    $sql = "SELECT ca.idCenso, ce.nombre, ce.apellido 
            FROM candidato ca 
            JOIN censo ce ON ca.idCenso = ce.idCenso 
            WHERE ca.idLocalidad = ? AND ca.idEleccion = ? AND ca.idPartido = ? 
            ORDER BY preferencia";

    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("iii", $idLocalidad, $idEleccion, $idPartido);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $candidatos[] = $row;
        }
        echo json_encode(['candidatos' => $candidatos]);
    } else {
        echo json_encode(['error' => 'No se encontraron candidatos']);
    }
    $stmt->close();
} else {
    echo json_encode(['error' => 'Faltan parámetros']);
}
