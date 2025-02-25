<?php
require_once '../../bd/conectar.php';

$sql = "SELECT idPartido, nombre, siglas, imagen FROM partido";
$resultado = $conn->query($sql);

$partido = [];

if ($resultado->num_rows > 0) {
    while ($row = $resultado->fetch_assoc()) {
        // Convertir la imagen BLOB a base64
        if (!empty($row['imagen'])) {
            $row['imagen'] = 'data:image/jpeg;base64,' . base64_encode($row['imagen']);
        } else {
            $row['imagen'] = null; // En caso de que no haya imagen
        }

        $partido[] = $row;
    }

    echo json_encode(['partidos' => $partido]);
} else {
    echo json_encode(['error' => 'No hay datos de partidos en la tabla partido']);
}

$conn->close();
?>
