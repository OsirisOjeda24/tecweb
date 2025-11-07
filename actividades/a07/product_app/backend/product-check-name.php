<?php
include_once __DIR__.'/database.php';
header('Content-Type: application/json; charset=utf-8');

$data = ['exists' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['nombre'])) {
    $nombre = trim($conexion->real_escape_string($_POST['nombre']));
    $current_id = isset($_POST['current_id']) ? trim($conexion->real_escape_string($_POST['current_id'])) : '';

    if ($nombre !== '') {
        $sql = "SELECT id FROM productos WHERE nombre = '{$nombre}' AND eliminado = 0";
        if ($current_id !== '') {
            $sql .= " AND id != '{$current_id}'";
        }
        $res = $conexion->query($sql);
        if ($res) {
            if ($res->num_rows > 0) {
                $data['exists'] = true;
                $data['message'] = 'El nombre ya está registrado.';
            } else {
                $data['exists'] = false;
                $data['message'] = 'Nombre disponible.';
            }
            $res->free();
        } else {
            http_response_code(500);
            $data['exists'] = false;
            $data['message'] = 'Error en la consulta.';
        }
    } else {
        $data['exists'] = false;
        $data['message'] = 'Nombre vacío.';
    }
} else {
    // método no permitido o sin nombre
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        $data['message'] = 'Método no permitido.';
    } else {
        $data['message'] = 'Parámetro nombre faltante.';
    }
}

$conexion->close();
echo json_encode($data, JSON_PRETTY_PRINT);