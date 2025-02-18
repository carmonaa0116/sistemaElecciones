<?php

header('Content-Type: application/json');

if (isset($_COOKIE['datosUsuario'])) {
    $datosUsuarioJSON = $_COOKIE['datosUsuario'];
    echo $datosUsuarioJSON;  // Respuesta en JSON
} else {
    echo json_encode(['error' => 'La cookie no está definida.']);
}
