<?php
require_once '../../bd/conectar.php';
$conexion = $conn;

if (isset($_GET['nombre'])) {
    // Concatenar los caracteres de comodín % antes y después del valor
    $nombre = "%" . $_GET['nombre'] . "%";

    $sql = "SELECT c.dni, c.nombre, c.apellido, c.email, c.fechaNacimiento, l.nombre AS localidad 
            FROM censo c 
            JOIN localidad l ON c.idLocalidad = l.idLocalidad 
            WHERE c.nombre LIKE ?;";
    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        die(json_encode(['error' => 'Error en la preparación de la consulta: ' . $conexion->error]));
    }

    // Vincular el parámetro ya con los comodines de búsqueda
    $stmt->bind_param('s', $nombre);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $rows = [];
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
        echo json_encode(['censo' => $rows]);
    } else {
        echo json_encode(['vacio' => 'No se ha encontrado ningún usuario con ese nombre']);
    }
    exit;
}