<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

require_once('../../bd/conectar.php');
$conexion = $conn;

if (isset($data['idEleccion']) && isset($data['idLocalidad'])) {
    $idEleccion = $data['idEleccion'];
    $idLocalidad = $data['idLocalidad'];
    $query = "SELECT 
    p.idPartido, 
    p.nombre, 
    p.siglas, 
    p.imagen, 
    COUNT(v.idVoto) AS total_votos 
FROM partido p
INNER JOIN candidato c 
    ON p.idPartido = c.idPartido 
    AND c.idEleccion = ?
    AND c.idLocalidad = ?
LEFT JOIN voto_autonomica v 
    ON p.idPartido = v.idPartido 
    AND v.idEleccion = ?
    AND v.idLocalidad = ?
GROUP BY p.idPartido;";

    $stmt = $conexion->prepare($query);
    $stmt->bind_param("iiii", $idEleccion, $idLocalidad, $idEleccion, $idLocalidad);
    $stmt->execute();
    $stmt->bind_result($idPartido, $nombre, $siglas, $imagen, $total_votos);

    $partidos = [];
    while ($stmt->fetch()) {
        $partido = [
            'idPartido' => $idPartido,
            'nombre' => $nombre,
            'siglas' => $siglas,
            'imagen' => base64_encode($imagen),
            'total_votos' => $total_votos
        ];
        $partidos[] = $partido;
    }

    echo json_encode($partidos);
} else {
    echo json_encode(['error' => 'Faltan datos']);
}
