<?php
require_once '../../bd/conectar.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$conexion = $conn;

if (isset($data['dni'], $data['idLocalidad'], $data['idEleccion'], $data['preferencia'], $data['partido'])) {
    $dni = $data['dni'];
    $idLocalidad = $data['idLocalidad'];
    $idElecciones = $data['idEleccion'];
    $preferencia = $data['preferencia'];
    $partido = $data['partido'];

    // Verificar si la localidad es válida
    if ($idLocalidad === null) {
        echo json_encode(['error' => 'La localidad no existe']);
        exit;
    }

    // Verificar si el DNI existe en el censo
    if (!comprobarIdCenso($dni, $conexion)) {
        echo json_encode(['error' => 'El DNI no está en la base de datos']);
        exit;
    }

    // Obtener el ID del censo
    $idCenso = obtenerIdCenso($dni, $conexion);
    if ($idCenso === null) {
        echo json_encode(['error' => 'No se pudo obtener el idCenso']);
        exit;
    }

    // Verificar si el candidato ya existe
    if (candidatoExiste($idCenso, $conexion)) {
        echo json_encode(['error' => 'Este candidato ya está registrado']);
        exit;
    }

    // Obtener el ID del partido
    $idPartido = obtenerIdPartido($partido, $conexion);
    if ($idPartido === null) {
        echo json_encode(['error' => 'El partido no existe']);
        exit;
    }

    // Insertar el candidato
    $sql = "INSERT INTO candidato (idCenso, idLocalidad, idEleccion, preferencia, idPartido) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conexion->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("iiiii", $idCenso, $idLocalidad, $idElecciones, $preferencia, $idPartido);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => 'Candidato añadido correctamente']);
        } else {
            echo json_encode(['error' => 'Error al insertar el candidato']);
        }

        $stmt->close();
    } else {
        echo json_encode(['error' => 'Error al preparar la consulta']);
    }
} else {
    echo json_encode([
        'error' => 'Datos faltantes',
        'datos_recibidos' => $data
    ]);
    exit;
}

// Verificar si el candidato ya existe en la base de datos
function candidatoExiste($idCenso, $conexion) {
    $sql = "SELECT 1 FROM candidato WHERE idCenso = ? LIMIT 1";
    $stmt = $conexion->prepare($sql);
    if ($stmt) {
        $stmt->bind_param("i", $idCenso);
        $stmt->execute();
        $stmt->store_result();
        $existe = $stmt->num_rows > 0;
        $stmt->close();
        return $existe;
    }
    return false;
}

// Verificar si el DNI existe en el censo
function comprobarIdCenso($dni, $conexion) {
    $sql = "SELECT 1 FROM censo WHERE dni = ? LIMIT 1";
    $stmt = $conexion->prepare($sql);
    if ($stmt) {
        $stmt->bind_param("i", $dni);
        $stmt->execute();
        $stmt->store_result();
        $existe = $stmt->num_rows > 0;
        $stmt->close();
        return $existe;
    }
    return false;
}

// Obtener el ID del censo a partir del DNI
function obtenerIdCenso($dni, $conexion) {
    $sql = "SELECT idCenso FROM censo WHERE dni = ? LIMIT 1";
    $stmt = $conexion->prepare($sql);
    if ($stmt) {
        $stmt->bind_param("i", $dni);
        $stmt->execute();
        $stmt->bind_result($idCenso);
        $stmt->fetch();
        $stmt->close();
        return $idCenso;
    }
    return null;
}

// Obtener el ID del partido a partir del nombre
function obtenerIdPartido($partido, $conexion) {
    $sql = "SELECT idPartido FROM partido WHERE nombre = ? LIMIT 1";
    $stmt = $conexion->prepare($sql);
    if ($stmt) {
        $stmt->bind_param("s", $partido);
        $stmt->execute();
        $stmt->bind_result($idPartido);
        $stmt->fetch();
        $stmt->close();
        return $idPartido;
    }
    return null;
}
