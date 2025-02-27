<?php
require_once '../../bd/conectar.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$conexion = $conn;

if (isset($data['dni'], $data['nombre'], $data['apellido'], $data['email'], $data['fechaNacimiento'], $data['localidad'])) {
    $dni = $data['dni'];
    $nombre = $data['nombre'];
    $apellido = $data['apellido'];
    $email = $data['email'];
    $fechaNacimiento = $data['fechaNacimiento'];
    $localidad = $data['localidad'];
    $idLocalidad = sacarIdLocalidad($localidad, $conexion);
    if ($idLocalidad === null) {
        echo json_encode(['error' => 'La localidad proporcionada no existe en la base de datos']);
        exit;
    }
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fechaNacimiento)) {
        echo json_encode(['error' => 'Formato de fecha inválido. Use YYYY-MM-DD']);
        exit;
    }
    

    require_once './insertUsuario.php';


    $sql = "INSERT INTO censo (dni, nombre, apellido, email, fechaNacimiento, idLocalidad) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        echo json_encode(['error' => 'Error en la preparación de la consulta: ' . $conexion->error]);
        exit;
    }

    $stmt->bind_param('sssssi', $dni, $nombre, $apellido, $email, $fechaNacimiento, $idLocalidad);

    if ($stmt->execute()) {
        $idUsuario = $conexion->insert_id;
        echo json_encode(['exito' => 'Censo insertado correctamente', 'id' => $idUsuario]);
    } else {
        echo json_encode(['error' => 'Error al insertar en el censo']);
    }

    $stmt->close();
} else {
    echo json_encode([
        'error' => 'Datos faltantes',
        'datos_recibidos' => $data
    ]);
    exit;
}

function sacarIdLocalidad($localidad, $conexion)
{
    $sql = "SELECT idLocalidad FROM localidad WHERE nombre = ?";
    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        echo json_encode(['error' => 'Error en la preparación de la consulta: ' . $conexion->error]);
        exit;
    }

    $stmt->bind_param('s', $localidad);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    if ($row = $result->fetch_assoc()) {
        return $row['idLocalidad'];
    } else {
        return null;
    }
}
