<?php
header('Content-Type: application/json');
require_once '../../bd/conectar.php';

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(['error' => 'Conexión fallida: ' . $conn->connect_error]));
}

// Obtener datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['idCandidato'])) {
    echo json_encode(['error' => 'No se proporcionó idCandidato']);
    exit;
}

$idCandidato = $data['idCandidato'];

// Preparar y ejecutar la consulta
$stmt = $conn->prepare("SELECT idCandidato, idCenso, idLocalidad, idEleccion, preferencia FROM Candidato WHERE idCandidato = ?");
$stmt->bind_param("i", $idCandidato);
$stmt->execute();
$result = $stmt->get_result();

// Verificar si hay resultados
if ($result->num_rows > 0) {
    $candidato = $result->fetch_assoc();
    echo json_encode(['candidato' => $candidato]);
} else {
    echo json_encode(['error' => 'No se encontraron resultados']);
}

// Cerrar la declaración y la conexión
$stmt->close();
$conn->close();
