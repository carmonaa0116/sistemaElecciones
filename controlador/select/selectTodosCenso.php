<?php
require_once '../../bd/conectar.php';

$sql = "SELECT * FROM censo";

$resultado = $conn->query($sql);

$censo = [];

if ($resultado->num_rows > 0) {
    while ($row = $resultado->fetch_assoc()) {
        $censo[] = $row;
    }

    echo json_encode(['censo' => $censo]);
} else {
    echo json_encode(['error' => 'No hay datos de censo en la tabla censo']);
}

$conn->close();