<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "bbdd_acr_elecciones";

try {
   $conn = new mysqli($servername, $username, $password, $dbname);
} catch (mysqli_sql_exception $e) {
    die("Error de conexión: " . $e->getMessage());
}
