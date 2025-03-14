<?php
require_once '../../bd/conectar.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$conexion = $conn;

if (isset($data['dni'], $data['idLocalidad'], $data['idEleccion'], $data['preferencia'], $data['partido'])) {
    $idCenso = getIdCenso($data['dni'], $conexion);
    $idLocalidad = getIdLocalidad($data['idLocalidad'], $conexion);
    $idElecciones = $data['idEleccion'];
    $preferencia = $data['preferencia'];
    $idPartido = getIdPartido($data['partido'], $conexion);

    if ($idCenso && $idLocalidad && $idPartido) {
        $sql = "INSERT INTO candidato (idCenso, idLocalidad, idEleccion, preferencia, idPartido) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("iiisi", $idCenso, $idLocalidad, $idElecciones, $preferencia, $idPartido);

        if ($stmt->execute()) {
            echo json_encode(['success' => 'Candidato insertado correctamente']);
        } else {
            echo json_encode(['error' => 'Error al insertar candidato']);
        }
    } else {
        if ($idCenso && $idLocalidad && $idPartido) {
            $sql = "INSERT INTO candidato (idCenso, idLocalidad, idEleccion, preferencia, idPartido) VALUES (?, ?, ?, ?, ?)";
            $stmt = $conexion->prepare($sql);
            $stmt->bind_param("iiisi", $idCenso, $idLocalidad, $idElecciones, $preferencia, $idPartido);
        
            if ($stmt->execute()) {
                echo json_encode(['success' => 'Candidato insertado correctamente']);
            } else {
                echo json_encode(['error' => 'Error al insertar candidato']);
            }
        } else {
            echo json_encode([
                'error' => 'Datos inválidos', 
                'debug' => [
                    'received_data' => $data,
                    'idCenso' => $idCenso,
                    'idLocalidad' => $idLocalidad,
                    'idPartido' => $idPartido
                ]
            ]);
        }
    }
} else {
    echo json_encode(['error' => 'Datos incompletos']);
}

function getIdCenso($dni, $conexion) {
    $sql = "SELECT idCenso FROM censo WHERE dni = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("s", $dni);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        return $row['idCenso'];
    } else {
        return null;
    }
}

function getIdLocalidad($localidad, $conexion) {
    $sql = "SELECT idLocalidad FROM localidad WHERE nombre = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("s", $localidad);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        return $row['idLocalidad'];
    } else {
        return null;
    }
}

function getIdPartido($partido, $conexion) {
    $sql = "SELECT idPartido FROM partido WHERE nombre = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("s", $partido);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        return $row['idPartido'];
    } else {
        return null;
    }
}
?>