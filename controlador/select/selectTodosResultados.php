<?php
require_once '../../bd/conectar.php';

$sql = "SELECT * FROM resultado";

$resultado = $conn->query($sql);

$resultado = [];

if ($resultado->num_rows > 0) {
    while ($row = $resultado->fetch_assoc()) {
        $resultado[] = $row;
    }

    echo json_encode(['resultados' => $resultado]);
} else {
    echo json_encode(['error' => 'No hay datos de resultados en la tabla resultado']);
}

$conn->close();