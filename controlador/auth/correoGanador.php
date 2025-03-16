<?php
header('Content-Type: application/json');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once '../../bd/conectar.php';
require_once '../../vendor/autoload.php';

$data = json_decode(file_get_contents('php://input'), true);

$idEleccion = $data['idEleccion'];

$sql = "SELECT c.idCandidato, c.idCenso, va.idPartido, COUNT(*) AS recuento
FROM voto_autonomica va
JOIN candidato c ON va.idPartido = c.idPartido AND va.idEleccion = c.idEleccion
WHERE va.idEleccion = ? 
GROUP BY va.idPartido, 
c.idCandidato 
ORDER BY recuento 
DESC LIMIT 1;";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $idEleccion);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {    
    $idCandidato = $row['idCandidato'];
    $idCenso = $row['idCenso'];
    $idPartido = $row['idPartido'];
    $recuento = $row['recuento'];

    $mail = new PHPMailer(true);
    try {
        //Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'alejandrocarmonarodero@gmail.com';
        $mail->Password = 'mntn rmir spqo oasf';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 587;
        //Recipients

        $mail->setFrom('alejandrocarmonarodero@gmail.com', 'Sistema de Votaciones');
        $mail->addAddress($direccionCorreo);
        $mail->Subject = 'Finalización de la eleccion autonomica';
        $mail->Body = 'ENHORABUENA, HAS GANADO LAS ELECCIONES AUTONOMICAS!!!';

        // Content
        $mail->isHTML(true);                                  // Set email format to HTML
        $mail->Subject = 'Has ganado la eleccion autonomica';
        $mail->Body    = 'Felicidades, has ganado la eleccion autonomica con un total de ' . $recuento . ' votos. <br> Tu id de candidato es ' . $idCandidato . ' y tu id de censo es ' . $idCenso . '. <br> Tu id de partido es ' . $idPartido . '.';

        $mail->send();
    } catch (Exception $e) {
        echo "Error al enviar el correo: {$mail->ErrorInfo}";
    }
} else {
    $idCandidato = null;
    $idCenso = null;
    $idPartido = null;
    $recuento = null;
}


$stmt->close();

