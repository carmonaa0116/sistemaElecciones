<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

require_once('../../bd/conectar.php');
$conexion = $conn;

if(isset($data['idEleccion'])){
    $idEleccion = $data['idEleccion'];

    $query = "SELECT p.idPartido, p.nombre, p.siglas, p.imagen, COUNT(v.idPartido) AS total_votos FROM partido p LEFT JOIN voto_general v ON p.idPartido = v.idPartido AND v.idEleccion = ? GROUP BY p.idPartido, p.nombre, p.siglas, p.imagen;";

    $stmt = $conexion->prepare($query);
    $stmt->bind_param("i", $idEleccion);
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
}
