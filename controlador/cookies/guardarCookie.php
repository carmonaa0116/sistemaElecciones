<?php
// Recibir los datos JSON
$datos = json_decode(file_get_contents("php://input"), true);

if (isset($datos['nombre']) && isset($datos['valor'])) {
    $nombre = $datos['nombre'];
    $valor = $datos['valor'];

    $expiracion = time() + (30 * 24 * 60 * 60);

    setcookie($nombre, $valor, $expiracion, "/");

    echo json_encode(["status" => "success", "mensaje" => "Cookie guardada"]);
} else {
    echo json_encode(["status" => "error", "mensaje" => "Datos inválidos"]);
}
?>