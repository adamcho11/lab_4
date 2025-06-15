<?php
session_start();
header('Content-Type: application/json');
require_once '../db/conexion.php';

$data = json_decode(file_get_contents("php://input"));

$email = $data->email ?? '';
$password = $data->password ?? '';

if ($email && $password) {
    $stmt = $con->prepare("SELECT id, email, rol FROM usuarios WHERE email=? AND password=? AND estado='activo'");
    $stmt->bind_param("ss", $email, $password);
    $stmt->execute();
    $result = $stmt->get_result();
    $usuario = $result->fetch_assoc();

    if ($usuario) {
        $_SESSION['usuario'] = $usuario;
        echo json_encode(['success' => true, 'rol' => $usuario['rol']]);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Credenciales incorrectas']);
    }
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
}
?>
