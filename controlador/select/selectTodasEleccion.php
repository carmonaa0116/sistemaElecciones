<?php

require_once '../../bd/conectar.php';

$sql = "SELECT * FROM eleccion";

$resultado = $conn->query($sql);

$eleccion = [];

if ($resultado->num_rows > 0) {
    while ($row = $resultado->fetch_assoc()) {
        $eleccion[] = $row;
    }

    echo json_encode(['eleccion' => $eleccion]);
} else {
    echo json_encode(['error' => 'No hay datos de censo en la tabla censo']);
}

$conn->close();
