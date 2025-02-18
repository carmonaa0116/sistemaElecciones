<?php

require_once '../../bd/conectar.php';

$sql = "SELECT * FROM usuario";

$resultado = $conn->query($sql);

$usuario = [];

if ($resultado->num_rows > 0) {
    while ($row = $resultado->fetch_assoc()) {
        $usuario[] = $row;
    }

    echo json_encode(['usuarios' => $usuario]);
} else {
    echo json_encode(['error' => 'No hay datos de usuarios en la tabla usuario']);
}

$conn->close();
