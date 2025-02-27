<?php
// Obtener los datos en formato JSON
$data = json_decode(file_get_contents('php://input'), true);
require_once '../../bd/conectar.php';

if (!$data) {
    echo json_encode(['error' => 'Error al decodificar JSON']);
    exit;
}

if (isset($data['correo'], $data['password'], $data['idCenso'])) {
    $email = $data['correo'];
    $password = $data['password'];
    $idCenso = $data['idCenso'];

    if (!empty($password)) {
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $sql = "UPDATE censo SET email = ?, `password` = ? WHERE idCenso = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ssi', $email, $passwordHash, $idCenso);
    } else {
        $sql = "UPDATE censo SET email = ? WHERE idCenso = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('si', $email, $idCenso);
    }

    if ($stmt->execute()) {
        echo json_encode(['exito' => 'Datos actualizados correctamente']);
    } else {
        echo json_encode(['error' => 'No se han podido actualizar los datos']);
    }

    $stmt->close();
} else {
    echo json_encode(['error' => 'Error al actualizar los datos: Datos incompletos']);
}
?>
