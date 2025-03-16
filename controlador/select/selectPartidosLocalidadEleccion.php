<?php

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

require_once '../../bd/conectar.php';
$conexion = $conn;
if (!$conexion) {
    die(json_encode(['error' => 'Error de conexión: ' . mysqli_connect_error()]));
}

if (isset($data['idLocalidad']) && isset($data['idEleccion'])) {
    $idLocalidad = $data['idLocalidad'];
    $idEleccion = $data['idEleccion'];

    $sql = "SELECT c.idPartido, p.nombre, p.imagen 
            FROM candidato c 
            JOIN partido p ON c.idPartido = p.idPartido 
            WHERE c.idEleccion = ? AND c.idLocalidad = ? 
            GROUP BY c.idPartido";

    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        echo json_encode(['error' => 'Error en la preparación de la consulta']);
        exit;
    }

    $stmt->bind_param('ii', $idEleccion, $idLocalidad);
    $stmt->execute();
    $result = $stmt->get_result();

    $partidos = [];
    while ($row = $result->fetch_assoc()) {
        $imagenBase64 = base64_encode($row['imagen']); // Convertir BLOB a Base64

        $partidos[] = [
            'idPartido' => $row['idPartido'],
            'nombre' => $row['nombre'],
            'imagen' => $imagenBase64 ? 'data:image/jpeg;base64,' . $imagenBase64 : null
        ];
    }

    echo json_encode(['partidos' => $partidos]);    

    $stmt->close();
    $conexion->close();
}
