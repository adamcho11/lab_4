<?php
include("conexion.php");

$sql = "SELECT * FROM usuarios";

$resultado = $con->query($sql);

$arreglo = array();

while ($row = mysqli_fetch_array($resultado)) {
    $arreglo[] = $row;
}

$con->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="ajax.js"></script>
    <title>Document</title>
</head>
<body>
    <div id="divform">
        <form id="formCorreo" action="crearCorreo.php" method="POST">
            <label for="nombre">Nombre:</label>
            <input type="text" name="nombre" id="nombre" required>
            <br>
            <label for="correo">Correo:</label>
            <input type="email" name="correo" id="correo" required>
            <br>
            <label for="telefono">Teléfono:</label>
            <input type="text" name="telefono" id="telefono" required>
            <br>
            <button type="submit">Enviar</button>
        </form>
    </div>
</body>
</html>