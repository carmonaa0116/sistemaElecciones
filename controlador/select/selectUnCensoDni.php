<?php
require_once '../../bd/conectar.php';
$conexion = $conn;

if (isset($_GET['dni'])) {
    $dni = $_GET['dni'] . '%';
    $sql = "SELECT c.dni, c.nombre, c.apellido, c.email, c.fechaNacimiento, l.nombre AS localidad 
            FROM censo c 
            JOIN localidad l ON c.idLocalidad = l.idLocalidad 
            WHERE c.dni LIKE ?;";
    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        die(json_encode(['error' => 'Error en la preparación de la consulta: ' . $conexion->error]));
    }

    $stmt->bind_param('s', $dni);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $rows = [];
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
        echo json_encode(['censo' => $rows]);
    } else {
        echo json_encode(['vacio' => true]);
    }
    exit;
}
