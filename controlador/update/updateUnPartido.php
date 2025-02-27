<?php
require_once '../../bd/conectar.php';

header('Content-Type: application/json');

$conexion = $conn;

if (!$conexion) {
    die(json_encode(['error' => 'Error de conexión: ' . mysqli_connect_error()]));
}

if (isset($_POST['inputIdPartido'], $_POST['inputNombre'], $_POST['inputSiglas'])) {
    $idPartido = $_POST['inputIdPartido'];
    $nombre = $_POST['inputNombre'];
    $siglas = $_POST['inputSiglas'];

    // Verificar si se ha enviado una imagen
    if (isset($_FILES['inputImagen']) && $_FILES['inputImagen']['error'] === UPLOAD_ERR_OK) {
        $imagenBinaria = file_get_contents($_FILES['inputImagen']['tmp_name']);
        $sql = "UPDATE partido SET nombre = ?, siglas = ?, imagen = ? WHERE idPartido = ?";
        $stmt = $conexion->prepare($sql);
        
        if (!$stmt) {
            die(json_encode(['error' => 'Error en la preparación de la consulta: ' . $conexion->error]));
        }
        
        $stmt->bind_param('sssi', $nombre, $siglas, $imagenBinaria, $idPartido);
    } else {
        // Si no se subió imagen, no actualizar la columna "imagen"
        $sql = "UPDATE partido SET nombre = ?, siglas = ? WHERE idPartido = ?";
        $stmt = $conexion->prepare($sql);
        
        if (!$stmt) {
            die(json_encode(['error' => 'Error en la preparación de la consulta: ' . $conexion->error]));
        }
        
        $stmt->bind_param('ssi', $nombre, $siglas, $idPartido);
    }

    // Ejecutar la consulta
    if ($stmt->execute()) {
        echo json_encode(['exito' => 'Partido actualizado correctamente']);
    } else {
        echo json_encode(['error' => 'Error al actualizar el partido: ' . $stmt->error]);
    }

    // Cerrar la consulta
    $stmt->close();
} else {
    echo json_encode(['error' => 'Datos de entrada incompletos']);
}
?>
