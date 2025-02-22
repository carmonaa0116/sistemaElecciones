<?php
require_once '../../bd/conectar.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$conexion = $conn;

if (isset($data['tipo']) && isset($data['fechaInicio']) && isset($data['fechaFin'])) {

    $tipo = $data['tipo'];
    $fechaInicio = $data['fechaInicio'];
    $fechaFin = $data['fechaFin'];
    // Insertar los datos en la base de datos
    $sql = "INSERT INTO eleccion (tipo, fechaInicio, fechaFin) VALUES (?, ?, ?)";
    $stmt = $conexion->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("sss", $tipo, $fechaInicio, $fechaFin);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => 'Eleccion añadido correctamente']);
        } else {
            echo json_encode(['error' => 'Error al insertar la eleccion']);
        }

        $stmt->close();
    } else {
        echo json_encode(['error' => 'Error al preparar la consulta']);
    }
} else {
    echo json_encode([
        'error' => 'Datos faltantes',
        'datos_recibidos' => $data
    ]);
    exit;
}
