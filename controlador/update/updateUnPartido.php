<?php
require_once '../../bd/conectar.php';
header('Content-Type: application/json');

$conexion = $conn;

if (!$conexion) {
    die(json_encode(['error' => 'Error de conexión: ' . mysqli_connect_error()]));
}

// Obtener datos JSON desde la entrada
$datos = json_decode(file_get_contents("php://input"), true);

if (isset($datos['idPartido'], $datos['nombre'], $datos['siglas'])) {
    $idPartido = $datos['idPartido'];
    $nombre = $datos['nombre'];
    $siglas = $datos['siglas'];
    $imagen = isset($datos['imagen']) ? base64_decode($datos['imagen']) : null;

    if ($imagen) {
        $sql = "UPDATE partido SET nombre = ?, siglas = ?, imagen = ? WHERE idPartido = ?";
        $stmt = $conexion->prepare($sql);
        
        if (!$stmt) {
            echo json_encode(['error' => 'Error en la preparación de la consulta']);
            exit;
        }
        
        $stmt->bind_param('sssi', $nombre, $siglas, $imagen, $idPartido);
    } else {
        $sql = "UPDATE partido SET nombre = ?, siglas = ? WHERE idPartido = ?";
        $stmt = $conexion->prepare($sql);
        
        if (!$stmt) {
            echo json_encode(['error' => 'Error en la preparación de la consulta']);
            exit;
        }
        
        $stmt->bind_param('ssi', $nombre, $siglas, $idPartido);
    }

    if ($stmt->execute()) {
        echo json_encode(['exito' => 'Partido actualizado correctamente']);
    } else {
        echo json_encode(['error' => 'Error al actualizar el partido']);
    }

    $stmt->close();
} else {
    echo json_encode(['error' => 'Datos de entrada incompletos']);
}
?>