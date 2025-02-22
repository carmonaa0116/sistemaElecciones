<?php
header('Content-Type: application/json');
require_once '../../bd/conectar.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['idLocalidad'])) {

    $idLocalidad = $data['orden'];
    $sql = "WITH preferencias AS (SELECT '1' AS preferencia UNION ALL SELECT '2' UNION ALL SELECT '3') SELECT p.preferencia FROM (SELECT DISTINCT idLocalidad FROM candidato WHERE idLocalidad = ?) l CROSS JOIN preferencias p LEFT JOIN candidato ca ON l.idLocalidad = ca.idLocalidad AND p.preferencia = ca.preferencia WHERE ca.preferencia IS NULL ORDER BY l.idLocalidad, p.preferencia;";
    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        echo json_encode(['error' => 'Error en la preparación de la consulta']);
        exit;
    }

    $stmt->bind_param('s', $idLocalidad);

    if ($stmt = $conn->prepare($sql)) {
        $stmt->execute();
        $resultado = $stmt->get_result();

        $preferencias = [];

        if ($resultado->num_rows > 0) {
            while ($row = $resultado->fetch_assoc()) {
                $preferencias[] = $row;
            }
            echo json_encode(['preferencias' => $preferencias]);
        } else {
            echo json_encode(['error' => 'No hay datos de censo en la tabla censo']);
        }

        $stmt->close();
    } else {
        echo json_encode(['error' => 'Error en la preparación de la consulta']);
    }
} else {
    echo json_encode(['error' => 'Campo de orden no válido']);
}

$conn->close();
