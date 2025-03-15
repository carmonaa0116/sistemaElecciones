<?php
    require_once '../../bd/conectar.php';
    header('Content-Type: application/json');
    
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    
    try {
        $conexion = $conn; // Asegúrate de que $conn es una conexión MySQLi válida
    
        $tipo = $_POST['tipo'];
        $estado = $_POST['estado'];
        $fechainicio = $_POST['fechainicio'];
        $fechafin = $_POST['fechafin'];
    
        // Consulta con MySQLi
        $stmt = $conexion->prepare("INSERT INTO eleccion (tipo, estado, fechainicio, fechafin) VALUES (?, ?, ?, ?)");
        
        if (!$stmt) {
            echo json_encode(["error" => "Error en la preparación de la consulta"]);
            exit;
        }
    
        // Aquí usamos bind_param() en lugar de bindParam()
        $stmt->bind_param("ssss", $tipo, $estado, $fechainicio, $fechafin); // "ssss" indica que son strings
    
        $stmt->execute();
    
        if ($stmt->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Elección registrada correctamente"]);
        } else {
            echo json_encode(["message" => "Error al registrar la elección", "data" => $stmt->error_list]);
        }
    
        $stmt->close();
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
    
    exit;    

?>

