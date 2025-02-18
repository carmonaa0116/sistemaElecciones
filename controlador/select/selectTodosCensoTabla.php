<?php
require_once '../../bd/conectar.php';

// Establecer la cabecera Content-Type como JSON
header('Content-Type: application/json');

$sql = "SELECT c.idCenso, c.dni, c.nombre, c.apellido, c.email, c.fechaNacimiento, l.nombre localidad FROM censo c JOIN localidad l on c.idLocalidad = l.idLocalidad";
$resultado = $conn->query($sql);

$censo = [];

if ($resultado->num_rows > 0) {
    while ($row = $resultado->fetch_assoc()) {
        $censo[] = $row;
    }
    echo json_encode(['censo' => $censo]);
} else {
    echo json_encode(['error' => 'No hay datos de censo en la tabla censo']);
}

$conn->close();
