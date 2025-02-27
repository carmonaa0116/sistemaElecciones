<?php
require_once '../../bd\conectar.php';

$data = json_decode(file_get_contents('php://input'), true);  // Corregido el php://input
$conexion = $conn;

if(isset($data['idCandidato'])){
    $idCandidato = $data['idCandidato'];

    $sql = "DELETE FROM candidato WHERE idCandidato = ?";
    $stmt = $conexion->prepare($sql);

    if(!$stmt){
        die(json_encode(['error' => 'Error en la preparación de la consulta']));
    }

    $stmt->bind_param('s', $idCandidato);

    if($stmt->execute()){
        if($stmt->affected_rows > 0){
            echo json_encode(['exito' => 'Se ha eliminado correctamente al candidato']);
        } else {
            echo json_encode(['error' => 'No se ha eliminado ningun candidato']);
        }
    }
}