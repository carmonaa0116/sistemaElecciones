<?php
require_once '../../bd/conectar.php';

$data = json_decode(file_get_contents('php://input'), true);
$conexion = $conn;

if(isset($data['idEleccion'])){
    $idEleccion = $data['idEleccion'];

    $sql = "DELETE FROM eleccion WHERE idEleccion = ?"; 
    $stmt = $conexion->prepare($sql);

    if(!$stmt){
        die(json_encode(['error' => 'Error en la preparación de la consulta']));
    }

    $stmt->bind_param('i', $idEleccion);

    if($stmt->execute()){
        if($stmt->affected_rows > 0){
            echo json_encode(['exito' => 'Se ha eliminado correctamente la eleccion']);
        } else {
            echo json_encode(['error' => 'No se ha eliminado ninguna eleccion']);
        }
    } else {
        echo json_encode(['error' => 'Error en la ejecución de la consulta']);
    }
} else {
    echo json_encode(['error' => 'No se ha proporcionado el idEleccion']);
}
?>