<?php
require_once '../../bd\conectar.php';

$data = json_decode(file_get_contents('php://input'), true);  // Corregido el php://input
$conexion = $conn;

if(isset($data['dni'])){
    $dni = $data['dni'];

    $sql = "DELETE FROM censo WHERE dni = ?";
    $stmt = $conexion->prepare($sql);

    if(!$stmt){
        die(json_encode(['error' => 'Error en la preparación de la consulta']));
    }

    $stmt->bind_param('s', $dni);

    if($stmt->execute()){
        if($stmt->affected_rows > 0){
            echo json_encode(['exito' => 'Se ha eliminado correctamente la persona']);
        } else {
            echo json_encode(['error' => 'No se ha eliminado ninguna persona']);
        }
    }
}