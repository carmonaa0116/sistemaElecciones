<?php
require_once '../../bd/conectar.php';
require '../../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['idUsuario'], $data['idEleccion'], $data['idPartido'], $data['email'])) {
    $conn->begin_transaction();
    try {
        $idUsuario = (int) $data['idUsuario'];
        $idEleccion = (int) $data['idEleccion'];
        $email = $data['email'];

        $stmt_check = $conn->prepare("SELECT COUNT(*) FROM registro_votantes WHERE idUsuario = ? AND idEleccion = ?");
        $stmt_check->bind_param("ii", $idUsuario, $idEleccion);
        $stmt_check->execute();
        $stmt_check->bind_result($existe);
        $stmt_check->fetch();
        $stmt_check->close();

        if ($existe > 0) {
            echo json_encode(["error" => "El usuario ya ha votado en esta elección."]);
            exit;
        }

        $stmt1 = $conn->prepare("INSERT INTO registro_votantes (idUsuario, idEleccion) VALUES (?, ?)");
        $stmt1->bind_param("ii", $idUsuario, $idEleccion);
        if (!$stmt1->execute()) {
            throw new Exception("Error en registro_votantes: " . $stmt1->error);
        }
        $stmt1->close();

        $idPartido = (int) $data['idPartido'];
        $idLocalidad = isset($data['idLocalidad']) ? (int) $data['idLocalidad'] : null;
        $idCandidato = isset($data['idCandidato']) ? (int) $data['idCandidato'] : null;

        if (!is_null($idLocalidad) && !is_null($idCandidato)) {
            $stmt2 = $conn->prepare("INSERT INTO voto (idEleccion, idPartido, idLocalidad, idCandidato) VALUES (?, ?, ?, ?)");
            $stmt2->bind_param("iiii", $idEleccion, $idPartido, $idLocalidad, $idCandidato);
        } else {
            $stmt2 = $conn->prepare("INSERT INTO voto (idEleccion, idPartido) VALUES (?, ?)");
            $stmt2->bind_param("ii", $idEleccion, $idPartido);
        }

        if (!$stmt2->execute()) {
            throw new Exception("Error en voto: " . $stmt2->error);
        }
        $stmt2->close();

        $conn->commit();

        require_once '../auth/login.php';
        $eleccionesVotadas = getEleccionesVotadasUsuario($idUsuario, $conn);
        if (isset($_COOKIE['datosUsuario'])) {
            $datosUsuario = json_decode($_COOKIE['datosUsuario'], true);
            $datosUsuario['eleccionesVotadas'] = $eleccionesVotadas;
            setcookie('datosUsuario', json_encode($datosUsuario), time() + (86400 * 30), "/");
        }

        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'alejandrocarmonarodero@gmail.com';
            $mail->Password = 'mntn rmir spqo oasf';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port = 465;

            $mail->setFrom('alejandrocarmonarodero@gmail.com', 'Sistema de Votaciones');
            $mail->addAddress($email);
            $mail->Subject = 'Confirmación de Voto';
            $mail->Body = "Estimado usuario,\n\nSu voto ha sido registrado correctamente en la elección $idEleccion.\n\nGracias por participar.";

            $mail->send();
        } catch (Exception $e) {
            echo json_encode(["error" => "El voto fue registrado, pero hubo un error al enviar el correo: {$mail->ErrorInfo}"]);
            exit;
        }

        echo json_encode(["exito" => "Se insertaron los registros correctamente y se envió el correo."]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Datos de entrada inválidos"]);
}
$conn->close();
?>