<?php

require_once '../../bd/conectar.php';

$data = json_decode(file_get_contents('php://input'), true);
$conexion = $conn;

if (isset($data['dni']) && isset($data['password'])) {
    $dni = $data['dni'];
    $password = password_hash($data['password'], PASSWORD_DEFAULT);
    $rol = isset($data['rol']) ? $data['rol'] : "Votante";

    try {
        // Verificar si ya está registrado
        if (comprobarUsuarioYaRegistrado($dni, $conexion)) {
            echo json_encode(['error' => 'El usuario ya está registrado']);
            exit;
        }

        // Comprobar mayoría de edad
        comprobarMayoriaDeEdad($dni, $conexion);

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

                $datosUsuario = [
                    'idUsuario' => $idUsuario,
                    'idCenso' => $idCenso,
                    'rol' => $rol
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
    } catch (MenorEdadExcepcion $e) {
        echo json_encode(['error' => 'Menor de edad', 'detalle' => $e->getMessage()]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Excepción general', 'detalle' => $e->getMessage()]);
    }
}

// Función para obtener el idCenso a partir del DNI
function sacarIdCenso($dni, $conexion)
{
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

function comprobarUsuarioYaRegistrado($dni, $conexion)
{
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

class MenorEdadExcepcion extends Exception {}

function comprobarMayoriaDeEdad($dni, $conexion)
{
    $sql = "SELECT fechaNacimiento FROM censo WHERE dni = ?";
    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        throw new Exception('Error en la preparación de la consulta: ' . $conexion->error);
    }

    $stmt->bind_param('s', $dni);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception('No se encontró el DNI en el censo');
    }

    $fila = $result->fetch_assoc();
    $fechaNacimiento = new DateTime($fila['fechaNacimiento']);
    $hoy = new DateTime();
    $edad = $fechaNacimiento->diff($hoy)->y;

    if ($edad < 18) {
        throw new MenorEdadExcepcion('El usuario no es mayor de edad. Edad: ' . $edad);
    }

    return ['mayorDeEdad' => true, 'edad' => $edad];
}
