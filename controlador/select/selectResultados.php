<?php
require_once '../../bd/conectar.php';

header('Content-Type: application/json');

// Recibir datos JSON
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['idEleccion'])) {
    $idEleccion = $conn->real_escape_string($data['idEleccion']);

    $sql = "SELECT p.nombre AS nombre, COUNT(v.idVoto) AS votos 
            FROM voto v 
            JOIN partido p ON p.idPartido = v.idPartido 
            WHERE v.idEleccion = '$idEleccion' 
            GROUP BY p.idPartido 
            ORDER BY votos DESC;";

    $resultado = $conn->query($sql);

    $data = [];

    if ($resultado->num_rows > 0) {
        while ($row = $resultado->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode(['resultados' => $data]);
    } else {
        echo json_encode(['error' => 'No hay datos de resultados para esta elección']);
    }
} else {
    echo json_encode(['error' => 'idEleccion no proporcionado']);
}

$conn->close();
?>
