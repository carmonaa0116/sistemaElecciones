<?php
require_once '../../bd/conectar.php';
$conexion = $conn;

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener datos del JSON
$data = json_decode(file_get_contents('php://input'), true);
$correo = $data['correo'];
$password = $data['password'];

// Actualizar correo en la tabla censo
$sql_censo = "UPDATE censo SET email = ? WHERE id = ?";
$stmt_censo = $conn->prepare($sql_censo);
$stmt_censo->bind_param("si", $correo, $id_censo); // Asumiendo que tienes el id del censo
$stmt_censo->execute();

// Actualizar password en la tabla usuario
$sql_usuario = "UPDATE usuario SET password = ? WHERE id = ?";
$stmt_usuario = $conn->prepare($sql_usuario);
$stmt_usuario->bind_param("si", $password, $id_usuario); // Asumiendo que tienes el id del usuario
$stmt_usuario->execute();

// Cerrar conexiones
$stmt_censo->close();
$stmt_usuario->close();
$conn->close();

echo json_encode(["status" => "success"]);
?>