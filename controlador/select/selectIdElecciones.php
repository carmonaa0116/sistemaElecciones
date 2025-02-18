<?php
require_once '../../bd/conectar.php';

// Establecer la cabecera Content-Type como JSON
header('Content-Type: application/json');

$sql = "SELECT idEleccion FROM eleccion";
$resultado = $conn->query($sql);

$idElecciones = [];

if ($resultado->num_rows > 0) {
    while ($row = $resultado->fetch_assoc()) {
        $idElecciones[] = $row;
    }
    echo json_encode(['value' => $idElecciones]);
} else {
    echo json_encode(['error' => 'No hay datos de censo en la tabla censo']);
}

$conn->close();
