<?php

require_once '../../bd\conectar.php';

$data = json_decode(file_get_contents('php://input'), true);
$conexion = $conn;

if (isset($data['dni'], $data['nombre'], $data['apellido'], $data['email'], $data['fechaNacimiento'], $data['localidad'])) {
    $dni = $data['dni'];
    $nombre = $data['nombre'];
    $apellido = $data['apellido'];
    $email = $data['email'];
    $fechaNacimiento = $data['fechaNacimiento'];
    $idLocalidad = getIdLocalidad($conexion, $data['localidad']);

    if (!$idLocalidad) {
        echo json_encode(['error' => 'Ha habido un error al coger el idLocalidad']);
        exit;
    }

    $sql = "UPDATE censo SET nombre = ?, apellido = ?, email = ?, fechaNacimiento = ?, idLocalidad = ? WHERE dni = ?";
    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        die(json_encode(['error' => 'Error en la preparación de la consulta']));
    }

    $stmt->bind_param('sssssi', $nombre, $apellido, $email, $fechaNacimiento, $idLocalidad, $dni);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['exito' => 'Usuario actualizado correctamente']);
        } else {
            echo json_encode(['error' => 'No se realizaron cambios en el registro']);
        }
    } else {
        echo json_encode(['error' => 'Error al actualizar el usuario']);
    }

    $stmt->close();
} else {
    echo json_encode(['error' => 'Hay datos de entrada incompletos']);
}

// Función para obtener el idLocalidad
function getIdLocalidad($conn, $localidad) {
    $sql = "SELECT idLocalidad FROM localidad WHERE nombre = ?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        return null;
    }

    $stmt->bind_param('s', $localidad);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        return $row['idLocalidad'];
    } else {
        return null;
    }
}
