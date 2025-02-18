<?php

require_once '../../bd/conectar.php';

$sql = "SELECT * FROM localidad";

$resultado = $conn->query($sql);

$localidad = [];

if ($resultado->num_rows > 0) {
    while ($row = $resultado->fetch_assoc()) {
        $localidad[] = $row;
    }

    echo json_encode(['localidades' => $localidad]);
} else {
    echo json_encode(['error' => 'No hay datos de localidades en la tabla localidad']);
}

$conn->close();
