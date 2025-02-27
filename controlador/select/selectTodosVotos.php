<?php
require_once '../../bd/conectar.php';

$sql = "SELECT * FROM voto";

$resultado = $conn->query($sql);

$voto = [];

if ($resultado->num_rows > 0) {
    while ($row = $resultado->fetch_assoc()) {
        $voto[] = $row;
    }

    echo json_encode(['votos' => $voto]);
} else {
    echo json_encode(['error' => 'No hay datos de votos en la tabla voto']);
}

$conn->close();