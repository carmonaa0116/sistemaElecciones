<?php
require_once '../../bd/conectar.php';

header('Content-Type: application/json');

$conexion = $conn;

if (isset($_POST['idPartido'], $_POST['nombre'], $_POST['siglas']) && isset($_FILES['imagen'])) {
    $idPartido = $_POST['idPartido'];
    $nombre = $_POST['nombre'];
    $siglas = $_POST['siglas'];

    // Leer el archivo como binario
    $imagenBinaria = file_get_contents($_FILES['imagen']['tmp_name']);

    // Preparar la consulta SQL
    $sql = "UPDATE partido SET nombre = ?, siglas = ?, imagen = ? WHERE idPartido = ?";
    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        die(json_encode(['error' => 'Error en la preparación de la consulta']));
    }

    $stmt->bind_param('sssi', $nombre, $siglas, $imagenBinaria, $idPartido);

    if ($stmt->execute()) {
        echo json_encode(['exito' => 'Partido actualizado correctamente']);
    } else {
        echo json_encode(['error' => 'Error al actualizar el partido']);
    }

    $stmt->close();
} else {
    echo json_encode(['error' => 'Datos de entrada incompletos']);
}
?>
