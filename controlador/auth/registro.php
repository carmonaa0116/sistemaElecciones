<?php

require_once '../../bd/conectar.php';

$data = json_decode(file_get_contents('php://input'), true);
$conexion = $conn;

if (isset($data['dni']) && isset($data['password'])) {
    $dni = $data['dni'];
    $password = password_hash($data['password'], PASSWORD_DEFAULT);
    $rol = isset($data['rol']) ? $data['rol'] : "Votante";

    if (comprobarUsuarioYaRegistrado($dni, $conexion)) {
        echo json_encode(['error' => 'El usuario ya está registrado']);
        exit;
    }

    $idCenso = sacarIdCenso($dni, $conexion);

    if ($idCenso) {
        $sql = "INSERT INTO usuario (idCenso, password, rol) VALUES (?, ?, ?)";
        $stmt = $conexion->prepare($sql);

        if (!$stmt) {
            die(json_encode(['error' => 'Error en la preparación de la consulta: ' . $conexion->error]));
        }

        $stmt->bind_param('iss', $idCenso, $password, $rol);

        if ($stmt->execute()) {
            $idUsuario = $conexion->insert_id;
            $nombreApellido = getNombreYapellidoUsuario($idCenso, $conexion);
            $datosUsuario = [
                'idUsuario' => $idUsuario,
                'idCenso' => $idCenso,
                'rol' => $rol,
                'nombre' => $nombreApellido['nombre'],
                'apellido' => $nombreApellido['apellido'];
            ];
            
            $datosUsuarioJSON = json_encode($datosUsuario);
            setcookie('datosUsuario', $datosUsuarioJSON, time() + (86400 * 30), "/");

            echo json_encode(['exito' => $datosUsuarioJSON]);
        } else {
            echo json_encode(['error' => 'Error al insertar el usuario']);
        }
    } else {
        echo json_encode(['error' => 'No existe una persona con ese DNI en el censo']);
    }
}

// Función para obtener el idCenso a partir del DNI
function sacarIdCenso($dni, $conexion) {
    $sql = "SELECT idCenso FROM censo WHERE dni = ?";
    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        die(json_encode(['error' => 'Error en la preparación de la consulta: ' . $conexion->error]));
    }

    $stmt->bind_param('s', $dni);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        return $row['idCenso'];
    }
    return false;
}

function comprobarUsuarioYaRegistrado($dni, $conexion) {
    $sql = "SELECT u.* FROM usuario u JOIN censo c ON u.idCenso = c.idCenso WHERE c.dni = ?;";
    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        die(json_encode(['error' => 'Error en la preparación de la consulta: ' . $conexion->error]));
    }

    $stmt->bind_param('s', $dni);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        return true;
    }
    return false;
}

function getNombreYapellidoUsuario($idCenso, $conexion) {
    $sql = "SELECT nombre, apellido FROM censo WHERE idCenso = ?";
    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        die(json_encode(['error' => 'Error en la preparación de la consulta: ' . $conexion->error]));
    }

    $stmt->bind_param('i', $idCenso);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        return ['nombre' => $row['nombre'], 'apellido' => $row['apellido']];
    }

    return false;
}
