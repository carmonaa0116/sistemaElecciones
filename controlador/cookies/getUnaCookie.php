<?php
header('Content-Type: application/json');


$datos = json_decode(file_get_contents("php://input"), true);

if (isset($datos['nombreCookie'])) {
    $cookie_name = $datos['nombreCookie'];
    if (isset($_COOKIE[$cookie_name])) {
        $response = array('valor' => $_COOKIE[$cookie_name]);
    } else {
        $response = array('error' => 'Cookie not found');
    }
} else {
    $response = array('error' => 'No se ha recibido el nombre de una cookie');
}

echo json_encode($response);
?>