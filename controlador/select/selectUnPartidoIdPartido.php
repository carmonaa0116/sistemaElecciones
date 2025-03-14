<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['idPartido'])) {
    $idPartido = $data['idPartido'];
    require_once '../../bd/conectar.php';

    if ($conn->connect_error) {
        die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
    }

    $sql = "SELECT idPartido, nombre, siglas, imagen FROM partido WHERE idPartido = ?";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        die(json_encode(['error' => 'Error en la preparación de la consulta']));
    }

    $stmt->bind_param("i", $idPartido);
    $stmt->execute();
    
    // Variables para almacenar los resultados
    $stmt->bind_result($id, $nombre, $siglas, $imagen);

    if ($stmt->fetch()) {
        echo json_encode([
            'partido' => [
                'idPartido' => $id,
                'nombre' => $nombre,
                'siglas' => $siglas,
                'imagen' => base64_encode($imagen) // Convertimos la imagen BLOB en base64
            ]
        ]);
    } else {
        echo json_encode(['error' => 'No hay un partido para el idPartido proporcionado']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'No se proporcionó el idPartido']);
}
?>
