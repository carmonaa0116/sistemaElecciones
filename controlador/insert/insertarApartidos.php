<?php
require_once '../../bd/conectar.php';
header('Content-Type: application/json');

$conexion = $conn;

if (isset($_POST['input-nombre-partido']) && isset($_POST['input-siglas-partido']) && isset($_FILES['input-imagen-partido'])) {
    $nombrePartido = $_POST['input-nombre-partido'];
    $siglasPartido = $_POST['input-siglas-partido'];
    
    // Leer la imagen como binario
    $imagenBinaria = file_get_contents($_FILES['input-imagen-partido']['tmp_name']);

    $sql = 'INSERT INTO partido (nombre, siglas, imagen) VALUES (?, ?, ?)';
    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        echo json_encode(['error' => 'Error en la preparación de la consulta']);
        exit;
    }

    $stmt->bind_param('sss', $nombrePartido, $siglasPartido, $imagenBinaria);

    if ($stmt->execute()) {
        $idPartido = $conexion->insert_id;
        echo json_encode(['exito' => 'Se ha insertado el partido', 'id' => $idPartido]);
    } else {
        echo json_encode(['error' => 'Error al insertar el partido']);
    }

    $stmt->close();
} else {
    echo json_encode([
        'error' => 'Datos faltantes',
        'datos_recibidos' => $_POST
    ]);
    exit;
}
?>
