<?php

require_once '../../bd/conectar.php';

function cogerUnUsuario($dni, $conexion) {


    $sql = "SELECT * FROM usuario WHERE idCenso = (SELECT idCenso FROM censo WHERE dni = ?)";
    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        die(json_encode(['error' => 'Error en la preparación de la consulta: ' . $conexion->error]));
    }

    $stmt->bind_param('s', $dni);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        return json_encode(['usuario' => $row]);
    } else {
        return json_encode(['error' => 'Usuario no encontrado']);
    }
}
