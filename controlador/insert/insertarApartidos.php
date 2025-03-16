<?php
require_once '../../bd/conectar.php';
header('Content-Type: application/json');

// Leer el JSON recibido
$inputJSON = file_get_contents('php://input');
$datos = json_decode($inputJSON, true);

// Verificar si los datos están presentes
if (!isset($datos['nombre'], $datos['siglas'], $datos['imagen'])) {
    echo json_encode(['error' => 'Datos faltantes']);
    exit;
}

$nombrePartido = $datos['nombre'];
$siglasPartido = $datos['siglas'];
$imagenBase64 = $datos['imagen'];

// Decodificar la imagen Base64 a binario
$imagenBinaria = base64_decode(preg_replace('/^data:image\/\w+;base64,/', '', $imagenBase64));

if ($imagenBinaria === false) {
    echo json_encode(['error' => 'Error al decodificar la imagen']);
    exit;
}

// Insertar en la base de datos
$sql = 'INSERT INTO partido (nombre, siglas, imagen) VALUES (?, ?, ?)';
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['error' => 'Error en la preparación de la consulta']);
    exit;
}

// `bind_param` no admite `longblob`, por lo que usamos `send_long_data`
$stmt->bind_param('ssb', $nombrePartido, $siglasPartido, $imagenBinaria);
$stmt->send_long_data(2, $imagenBinaria);

if ($stmt->execute()) {
    echo json_encode(['exito' => 'Se ha insertado el partido', 'id' => $conn->insert_id]);
} else {
    echo json_encode(['error' => 'Error al insertar el partido']);
}

$stmt->close();
?>
