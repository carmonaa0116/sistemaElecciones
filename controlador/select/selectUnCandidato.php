<?php
require_once './bd/conectar.php';
// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener el idCandidato de la solicitud
$idCandidato = $_GET['idCandidato'];

// Preparar y vincular
$stmt = $conn->prepare("SELECT idCandidato, idCenso, idLocalidad, idEleccion, preferencia FROM Candidato WHERE idCandidato = ?");
$stmt->bind_param("i", $idCandidato);

// Ejecutar la consulta
$stmt->execute();

// Obtener el resultado
$result = $stmt->get_result();

// Verificar si se encontraron resultados
if ($result->num_rows > 0) {
    // Salida de datos de cada fila
    while($row = $result->fetch_assoc()) {
        echo "idCandidato: " . $row["idCandidato"]. " - idCenso: " . $row["idCenso"]. " - idLocalidad: " . $row["idLocalidad"]. " - idEleccion: " . $row["idEleccion"]. " - preferencia: " . $row["preferencia"]. "<br>";
    }
} else {
    echo "0 resultados";
}

// Cerrar la declaración y la conexión
$stmt->close();
$conn->close();
?>