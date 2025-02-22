<?php
require_once '../../bd/conectar.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$conexion = $conn;

if (isset($data['nombrePartido']) && isset($data['siglasPartido'])) {
    $nombrePartido = $data['nombrePartido'];
    $siglasPartido = $data['siglasPartido'];


    $sql = 'INSERT INTO partido (nombre, siglas) VALUES (?, ?);';

    $stmt = $conexion->prepare($sql);

    if(!$stmt){
        echo json_encode(['error' => 'Error en la preparación de la consulta']);
        exit;

    }

    $stmt->bind_param('ss', $nombrePartido, $siglasPartido);

    if($stmt->execute()){
        $idEleccion = $conexion->insert_id;
        echo json_encode(['exito' => 'Se ha insertado el partido', 'id' => $idEleccion]);
    } else {
        echo json_encode(['error' => 'Error al insertar en elecciones']);
    }

    $stmt->close();
} else {
    echo json_encode([
        'error' => 'Datos faltantes',
        'datos_recibidos' => $data
    ]);
    exit;
}