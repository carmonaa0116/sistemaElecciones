<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['idPartido']) && isset($data['idEleccion'])) {
    $idPartido= $data['idPartido'];
    $idEleccion = $data['idEleccion'];
    require_once '../../bd/conectar.php';

    if ($conn->connect_error) {
        die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
    }

    $stmt = $conn->prepare("SELECT COUNT(*) FROM voto WHERE idEleccion = ? AND idPartido = ?");
    $stmt->bind_param("ii", $idEleccion, $idPartido);
    $stmt->execute();
    $stmt->bind_result($row);
    $stmt->fetch();

    if ($row) {
        echo json_encode(['votos' => $row]);
    } else {
        echo json_encode(['error' => 'No hay votos para el idPartido proporcionado']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'No se proporcionó el idPartido']);
}
?>