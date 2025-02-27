<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['idCenso'])) {
    $idCenso = $data['idCenso'];

    require_once '../../bd/conectar.php';

    if ($conn->connect_error) {
        die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
    }

    $stmt = $conn->prepare("SELECT email FROM censo WHERE idCenso = ?");
    $stmt->bind_param("i", $idCenso);
    $stmt->execute();
    $stmt->bind_result($correo);
    $stmt->fetch();

    if ($correo) {
        echo json_encode(['correo' => $correo]);
    } else {
        echo json_encode(['error' => 'No se encontró el correo para el idCenso proporcionado']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'No se proporcionó el idCenso']);
}
?>