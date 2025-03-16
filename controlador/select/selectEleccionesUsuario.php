<?php

require_once '../../bd/conectar.php';

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['idUsuario'])) {
    $idUsuario = $data['idUsuario'];

    $sql = "SELECT e.idEleccion, e.tipo, e.estado, e.fechainicio, e.fechafin 
            FROM eleccion e
            LEFT JOIN registro_votantes rv ON e.idEleccion = rv.idEleccion AND rv.idUsuario = ?
            WHERE rv.idEleccion IS NULL;
            ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $elecciones = [];
        while ($row = $result->fetch_assoc()) {
            $elecciones[] = $row;
        }
        echo json_encode(['elecciones' => $elecciones]);
    } else {
        echo json_encode(['error' => 'No hay elecciones para este usuario']);
    }
} else {
    echo json_encode(['error' => 'No se ha proporcionado el idUsuario']);
}

$stmt->close();
$conn->close();
