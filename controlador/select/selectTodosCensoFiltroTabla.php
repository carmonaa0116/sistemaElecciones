<?php
header('Content-Type: application/json');
require_once '../../bd/conectar.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['orden'])) {

    $orden = $data['orden'];

    // Validar la columna de orden, además de permitir 'all' para no aplicar orden
    $columnas_validas = ['dni', 'nombre', 'apellido', 'email', 'fechaNacimiento', 'localidad', 'all'];
    if (!in_array($orden, $columnas_validas)) {
        echo json_encode(['error' => 'Columna de orden no válida']);
        exit;
    }

    // Si la opción es 'all', no se aplica orden, de lo contrario, se utiliza el valor de orden
    if ($orden !== 'all') {
        $sql = "SELECT c.idCenso, c.dni, c.nombre, c.apellido, c.email, c.fechaNacimiento, l.nombre localidad 
                FROM censo c 
                JOIN localidad l ON c.idLocalidad = l.idLocalidad 
                ORDER BY $orden"; // Aquí se inserta la columna validada
    } else {
        // Si 'orden' es 'all', no se aplica ORDER BY
        $sql = "SELECT c.idCenso, c.dni, c.nombre, c.apellido, c.email, c.fechaNacimiento, l.nombre localidad 
                FROM censo c 
                JOIN localidad l ON c.idLocalidad = l.idLocalidad";
    }

    // Preparar la consulta
    if ($stmt = $conn->prepare($sql)) {
        $stmt->execute();
        $resultado = $stmt->get_result();

        $censo = [];

        if ($resultado->num_rows > 0) {
            while ($row = $resultado->fetch_assoc()) {
                $censo[] = $row;
            }
            echo json_encode(['censo' => $censo]);
        } else {
            echo json_encode(['error' => 'No hay datos de censo en la tabla censo']);
        }

        $stmt->close();
    } else {
        echo json_encode(['error' => 'Error en la preparación de la consulta']);
    }
} else {
    echo json_encode(['error' => 'Campo de orden no válido']);
}

$conn->close();
?>
