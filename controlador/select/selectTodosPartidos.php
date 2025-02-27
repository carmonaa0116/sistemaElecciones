<?php
header('Content-Type: application/json');
require_once '../../bd/conectar.php';

if (!$conn) {
    echo json_encode(['error' => 'Error de conexión a la base de datos']);
    exit;
}

$sql = "SELECT idPartido, nombre, siglas, imagen FROM partido";
$resultado = $conn->query($sql);

if (!$resultado) {
    echo json_encode(['error' => 'Error en la consulta: ' . $conn->error]);
    exit;
}

$partidos = [];

while ($row = $resultado->fetch_assoc()) {
    // Convertir imagen a base64 si no es NULL
    if (!is_null($row['imagen'])) {
        $row['imagen'] = base64_encode($row['imagen']);
    }
    $partidos[] = $row;
}

echo json_encode(['partidos' => $partidos]);
$conn->close();
