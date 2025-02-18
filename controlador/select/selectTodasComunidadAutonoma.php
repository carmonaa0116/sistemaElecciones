<?php
require_once '../../bd/conectar.php';

$sql = "SELECT * FROM comunidadautonoma";

$resultado = $conn->query($sql);

$comunidades = [];

if ($resultado->num_rows > 0) {
    while ($row = $resultado->fetch_assoc()) {
        $comunidades[] = $row;
    }

    echo json_encode(['comunidades' => $comunidades]);
} else {
    echo json_encode(['error' => 'No hay datos de comunidades en la tabla comunidades']);
}

$conn->close();