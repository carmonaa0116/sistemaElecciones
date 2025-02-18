<?php
require_once '../../bd/conectar.php';

$sql = "SELECT * FROM candidato";

$resultado = $conn->query($sql);

$candidatos = [];

if ($resultado->num_rows > 0) {
    while ($row = $resultado->fetch_assoc()) {
        $candidatos[] = $row;
    }

    echo json_encode(['candidatos' => $candidatos]);
} else {
    echo json_encode(['error' => 'No hay candidatos en la tabla candidatos']);
}

$conn->close();