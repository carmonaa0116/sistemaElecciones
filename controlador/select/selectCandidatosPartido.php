<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['idPartido'])) {
    $idPartido = $data['idPartido'];

    require_once '../../bd/conectar.php';

    if ($conn->connect_error) {
        die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
    }

    // Preparar la consulta
    $stmt = $conn->prepare("SELECT ca.idCandidato, ce.nombre, ca.idLocalidad, ca.idEleccion, ca.preferencia, ca.idPartido 
                            FROM candidato ca 
                            JOIN censo ce ON ce.idCenso = ca.idCenso 
                            WHERE idPartido = ? 
                            ORDER BY ca.preferencia");
    $stmt->bind_param("i", $idPartido);
    $stmt->execute();

    // Vincular las columnas a variables
    $stmt->bind_result($idCandidato, $nombre, $idLocalidad, $idEleccion, $preferencia, $idPartido);

    // Crear un array para almacenar los resultados
    $candidatos = [];

    // Iterar sobre los resultados y agregarlos al array
    while ($stmt->fetch()) {
        $candidatos[] = [
            'idCandidato' => $idCandidato,
            'nombre' => $nombre,
            'idLocalidad' => $idLocalidad,
            'idEleccion' => $idEleccion,
            'preferencia' => $preferencia,
            'idPartido' => $idPartido
        ];
    }

    // Verificar si se encontraron candidatos
    if (count($candidatos) > 0) {
        echo json_encode(['candidatos' => $candidatos]);
    } else {
        echo json_encode(['error' => 'No se encontraron los candidatos para el idPartido proporcionado']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'No se proporcionó el idPartido']);
}
?>
