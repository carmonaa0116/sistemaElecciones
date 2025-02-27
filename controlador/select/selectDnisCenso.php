<?php
require_once '../../bd/conectar.php';

// Establecer la cabecera Content-Type como JSON
header('Content-Type: application/json');

$sql = "SELECT dni FROM censo";
$resultado = $conn->query($sql);

$censo = [];

if ($resultado->num_rows > 0) {
    while ($row = $resultado->fetch_assoc()) {
        $censo[] = $row;
    }
    echo json_encode(['value' => $censo]);
} else {
    echo json_encode(['error' => 'No hay datos de censo en la tabla censo']);
}

$conn->close();
