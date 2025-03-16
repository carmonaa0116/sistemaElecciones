<?php
header('Content-Type: application/json');

// Obtener datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

require '../../bd/conectar.php';

if (!$conn) {
    echo json_encode(["error" => "Error de conexión a la base de datos"]);
    exit;
}

if (!isset($data['idEleccion'], $data['idPartido'], $data['idUsuario'], $data['idLocalidad'])) {
    echo json_encode(["error" => "Faltan parámetros obligatorios"]);
    exit;
}

$idEleccion = $data['idEleccion'];
$idPartido = $data['idPartido'];
$idUsuario = $data['idUsuario'];
$idLocalidad = $data['idLocalidad'];

// Iniciar transacción
$conn->begin_transaction();

$votoAutonomico = insertarEnVotoAutonomico($idEleccion, $idPartido, $idLocalidad, $conn);
$insertarEnRegistro = insertarEnRegistroVotantes($idUsuario, $idEleccion, $conn);

if ($votoAutonomico && $insertarEnRegistro) {
    $datosCenso = getDatosCenso($idUsuario, $conn);
    
    if ($datosCenso && isset($datosCenso['email'])) {
        $correoEnviado = enviarCorreo($datosCenso['email'], "Has votado en la elección autonómica nº $idEleccion al partido: $idPartido, en la localidad de: $idLocalidad. Muchas gracias por tu participación.");

        if ($correoEnviado) {
            $conn->commit();
            echo json_encode(["success" => "Voto registrado correctamente"]);
        } else {
            $conn->rollback();
            echo json_encode(["error" => "El voto no se registró porque falló el envío del correo"]);
        }
    } else {
        $conn->rollback();
        echo json_encode(["error" => "No se encontró un correo asociado en el censo"]);
    }
} else {
    $conn->rollback();
    echo json_encode(["error" => "No se pudo registrar el voto"]);
}

// Obtener datos del censo
function getDatosCenso($idUsuario, $conexion) {
    $idCenso = null;
    $sql = "SELECT idCenso FROM usuario WHERE idUsuario = ?";
    $stmt = $conexion->prepare($sql);
    
    if (!$stmt) {
        return ["error" => "Error en la consulta de usuario: " . $conexion->error];
    }

    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();
    $stmt->bind_result($idCenso);
    
    if (!$stmt->fetch()) {
        $stmt->close();
        return null;
    }
    
    $stmt->close();

    $sql = "SELECT * FROM censo WHERE idCenso = ?";
    $stmt = $conexion->prepare($sql);
    
    if (!$stmt) {
        return ["error" => "Error en la consulta del censo: " . $conexion->error];
    }

    $stmt->bind_param("i", $idCenso);
    $stmt->execute();
    
    $resultado = $stmt->get_result();
    $fila = $resultado->fetch_assoc();

    $stmt->close();
    return $fila ?: null;
}

// Insertar voto en voto_autonomica
function insertarEnVotoAutonomico($idEleccion, $idPartido, $idLocalidad, $conexion) {
    $sql = "INSERT INTO voto_autonomica (idEleccion, idPartido, idLocalidad) VALUES (?, ?, ?)";
    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        return false;
    }

    $stmt->bind_param("iii", $idEleccion, $idPartido, $idLocalidad);
    $stmt->execute();

    $resultado = $stmt->affected_rows > 0;
    $stmt->close();
    
    return $resultado;
}

// Insertar en registro_votantes
function insertarEnRegistroVotantes($idUsuario, $idEleccion, $conexion) {
    $sql = "INSERT INTO registro_votantes (idUsuario, idEleccion) VALUES (?, ?)";
    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        return false;
    }

    $stmt->bind_param("ii", $idUsuario, $idEleccion);
    $stmt->execute();

    $resultado = $stmt->affected_rows > 0;
    $stmt->close();
    
    return $resultado;
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function enviarCorreo($direccionCorreo, $textoCorreo) {
    require '../../vendor/autoload.php';

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'alejandrocarmonarodero@gmail.com';
        $mail->Password = 'mntn rmir spqo oasf';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 587;

        $mail->setFrom('alejandrocarmonarodero@gmail.com', 'Sistema de Votaciones');
        $mail->addAddress($direccionCorreo);
        $mail->Subject = 'Confirmación de Voto';
        $mail->Body = $textoCorreo;

        $mail->send();
        return true;
    } catch (Exception $e) {
        return false;
    }
}
