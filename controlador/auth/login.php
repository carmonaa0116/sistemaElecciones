<?php

require_once '../../bd/conectar.php';
require_once '../select/selectUnUsuario.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$conexion = $conn;

if (isset($data['dni']) && isset($data['password'])) {
    $dni = $data['dni'];
    $password = $data['password'];

    $usuarioJSON = cogerUnUsuario($dni, $conexion);
    $usuarioData = json_decode($usuarioJSON, true);

    if (isset($usuarioData['error'])) {
        echo json_encode(['error' => 'Usuario no encontrado']);
        exit;
    }

    $usuario = $usuarioData['usuario'];

    if (password_verify($password, $usuario['password'])) {
        $idUsuario = $usuario['idUsuario'];
        $idCenso = $usuario['idCenso'];
        $rol = $usuario['rol'];
        $eleccionesVotadas = getEleccionesVotadasUsuario($idUsuario, $conexion);
        $datosUsuario = [
            'idUsuario' => $idUsuario,
            'idCenso' => $idCenso,
            'rol' => $rol,
            'eleccionesVotadas' => $eleccionesVotadas
        ];

        $datosUsuarioJSON = json_encode($datosUsuario);
        setcookie('datosUsuario', $datosUsuarioJSON, time() + (86400 * 30), "/");

        echo json_encode(['exito' => 'Login exitoso']);
    } else {
        echo json_encode(['error' => 'Contraseña incorrecta']);
    }
} else {
    echo json_encode(['error' => 'Faltan credenciales']);
}

function getEleccionesVotadasUsuario($idUsuario, $conexion) {
    $sql = "SELECT idEleccion FROM registro_votantes WHERE idUsuario = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();
    $result = $stmt->get_result();
    $elecciones = [];
    while ($row = $result->fetch_assoc()) {
        $elecciones[] = $row['idEleccion'];
    }
    return $elecciones;
}
?>
