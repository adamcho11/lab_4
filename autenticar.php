<?php
session_start();
header('Content-Type: application/json');
include("conexion.php");

$email = $_POST['correo'] ?? '';
$password = $_POST['password'] ?? '';

// Consulta para buscar usuario con email y password
$sql = "SELECT * FROM usuarios WHERE email = ? AND password = ?";

$stmt = $con->prepare($sql);
$stmt->bind_param("ss", $email, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    // Usuario encontrado
    $respuesta = [
        'status' => 'success',
        'message' => 'Usuario autenticado correctamente',
        'id' => $user['id'],
        'rol' => $user['rol'],
        'estado' => $user['estado']
    ];
    echo json_encode($respuesta);
} else {
    // Usuario no encontrado o credenciales incorrectas
    $respuesta = [
        'status' => 'error',
        'message' => 'Usuario o contraseña incorrectos'
    ];
    echo json_encode($respuesta);
}
?>
