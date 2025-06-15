<?php
session_start();
require_once '../db/conexion.php';
header('Content-Type: application/json');

$accion = $_GET['accion'] ?? '';

switch ($accion) {
    case 'listar':
        $result = mysqli_query($con, "SELECT id, email, rol, estado FROM usuarios");
        $usuarios = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $usuarios[] = $row;
        }
        $respuesta = [
            'success' => true,
            'user' => $usuarios
        ];
        echo json_encode($respuesta);
        //echo json_encode($usuarios);
        break;

    case 'crear':
        $data = json_decode(file_get_contents("php://input"));
        $email = $data->email;
        $password = $data->password;
        $rol = $data->rol;

        $stmt = $con->prepare("INSERT INTO usuarios (email, password, rol, estado) VALUES (?, ?, ?, 'activo')");
        $stmt->bind_param("sss", $email, $password, $rol);
        $stmt->execute();

        echo json_encode(['success' => true]);
        break;

    case 'suspender':
        $id = $_GET['id'] ?? '';
        $stmt = $con->prepare("UPDATE usuarios SET estado='suspendido' WHERE id=?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        echo json_encode(['success' => true]);
        break;

    case 'habilitar':
        $id = $_GET['id'] ?? '';
        $stmt = $con->prepare("UPDATE usuarios SET estado='activo' WHERE id=?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        echo json_encode(['success' => true]);
        break;

    case 'eliminar':
        $id = $_GET['id'] ?? '';
        $stmt = $con->prepare("UPDATE usuarios SET estado='eliminado' WHERE id=?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        echo json_encode(['success' => true]);
        break;

    case 'actualizar':
        $data = json_decode(file_get_contents("php://input"));
        $id = $data->id ?? '';
        $email = $data->email ?? '';
        $password = $data->password ?? '';
        $rol = $data->rol ?? '';

        if (!$id || !$email || !$password || !$rol) {
            echo json_encode(['success' => false, 'mensaje' => 'Datos incompletos']);
            exit;
        }

        $stmt = $con->prepare("UPDATE usuarios SET email=?, password=?, rol=? WHERE id=?");
        $stmt->bind_param("sssi", $email, $password, $rol, $id);
        $stmt->execute();

        echo json_encode(['success' => true]);
        break;

    default:
        echo json_encode(['success' => false, 'mensaje' => 'Acción no válida']);
        break;
}
?>
