<?php
require_once '../../bd/conectar.php';
header('Content-Type: application/json');
$conexion = $conn;

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener datos del JSON
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['idUsuario']) && isset($data['idCenso']) && isset($data['nombre']) && isset($data['apellido']) && isset($data['correo'])) {
    $idUsuario = $data['idUsuario'];
    $idCenso = $data['idCenso'];
    $nombre = $data['nombre'];
    $apellido = $data['apellido'];
    $correo = $data['correo'];

    if (isset($data['password']) && $data['password'] != null && $data['password'] != "") {
        $password = encriptar($data['password']);
        $sql = "UPDATE censo SET nombre = ?, apellido = ?, email = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssi", $nombre, $apellido, $correo, $idCenso);
        $stmt->execute();

        $sql = "UPDATE usuario SET password = ? WHERE idUsuario = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $password, $idUsuario);
        $stmt->execute();
    } else {
        $sql = "UPDATE censo SET nombre = ?, apellido = ?, email = ? WHERE idCenso = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssi", $nombre, $apellido, $correo, $idCenso);
        $stmt->execute();
    }
} else {
    echo json_encode(["status" => "error", "mensaje" => "Faltan datos"]);
    exit;
}


// Cerrar conexiones

$stmt->close();
$conn->close();

echo json_encode(["status" => "success"]);
function encriptar($password)
{
    return password_hash($password, PASSWORD_DEFAULT);
}

