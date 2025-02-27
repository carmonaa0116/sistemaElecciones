<?php
require_once '../../bd/conectar.php';

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the JSON data from the request
$data = json_decode(file_get_contents('php://input'), true);

// Check if required data is received
if (isset($data['idUsuario'], $data['idEleccion'], $data['idPartido'])) {
    // Start transaction
    $conn->begin_transaction();
    try {
        // Insert into registro_votantes
        $stmt1 = $conn->prepare("INSERT INTO registro_votantes (idUsuario, idEleccion) VALUES (?, ?)");
        $stmt1->bind_param("ii", $idUsuario, $idEleccion);
        
        $idUsuario = (int) $data['idUsuario'];
        $idEleccion = (int) $data['idEleccion'];
        
        if (!$stmt1->execute()) {
            throw new Exception("Error en registro_votantes: " . $stmt1->error);
        }
        
        $stmt1->close();

        // Insert into voto (con o sin idLocalidad e idCandidato)
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

        // Commit transaction
        $conn->commit();
        echo json_encode(["exito" => "Se insertaron los registros correctamente"]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Datos de entrada inválidos"]);
}

$conn->close();
?>
