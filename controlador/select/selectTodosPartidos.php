<?php
require_once '../../bd/conectar.php';

$sql = "SELECT * FROM partido";

$resultado = $conn->query($sql);

$partido = [];

if ($resultado->num_rows > 0) {
    while ($row = $resultado->fetch_assoc()) {
        $partido[] = $row;
    }

    echo json_encode(['partidos' => $partido]);
} else {
    echo json_encode(['error' => 'No hay datos de partidos en la tabla partido']);
}

$conn->close();