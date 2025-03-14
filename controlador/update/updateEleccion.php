<?php
    require_once '../../bd/conectar.php';
    header('Content-Type: application/json');

    $conexion = $conn;

    if (!$conexion) {
        die(json_encode(['error' => 'Error de conexión: ' . mysqli_connect_error()]));
    }

    
    $idEleccion = $_POST['idEleccion'];
    $tipoEleccion = $_POST['tipoEleccion'];
    $estadoEleccion = $_POST['estadoEleccion'];
    $fechaInicioEleccion = $_POST['fechaInicioEleccion'];
    $fechaFinEleccion = $_POST['fechaFinEleccion'];

    $sql = "UPDATE eleccion SET tipo = ?, estado = ?, fechainicio = ?, fechafin = ? WHERE idEleccion = ?";
    $stmt = $conexion->prepare($sql);
    
    if (!$stmt) {
        die(json_encode(['error' => 'Error en la preparación de la consulta: ' . $conexion->error]));
    }
    
    $stmt->bind_param('ssssi', $tipoEleccion, $estadoEleccion, $fechaInicioEleccion, $fechaFinEleccion, $idEleccion);

    if ($stmt->execute()) {
        echo json_encode(['exito' => 'Elección actualizada correctamente', "data" => $_POST]);
        
    } else {
        echo json_encode(['error' => 'Error al actualizar la elección: ' . $stmt->error]);
    }

    $stmt->close();

?>
