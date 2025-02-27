<?php
require_once '../../bd/conectar.php';

header('Content-Type: application/json');

// Intentamos ejecutar la consulta
$sql = "SELECT idEleccion FROM eleccion";
$resultado = $conn->query($sql);

$idElecciones = [];

if ($resultado) {
    if ($resultado->num_rows > 0) {
        while ($row = $resultado->fetch_assoc()) {
            $idElecciones[] = $row;
        }
        echo json_encode(['value' => $idElecciones]);
    } else {
        echo json_encode(['error' => 'No hay datos de elecciones en la tabla eleccion']);
    }
} else {
    // Si no se pudo ejecutar la consulta, mostramos el error de MySQL
    echo json_encode(['error' => 'Error en la consulta: ' . $conn->error]);
}

$conn->close();
