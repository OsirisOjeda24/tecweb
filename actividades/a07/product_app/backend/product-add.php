<?php
include_once __DIR__.'/database.php';
header('Content-Type: application/json; charset=utf-8');

$DEFAULT_IMAGE = 'images/default-product.png'; // ajusta si quieres otra ruta

$response = ['success' => false, 'errors' => [], 'message' => 'Error en la validación'];

// Tomar datos (esperamos request POST con campos individuales)
$nombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
$marca  = isset($_POST['marca']) ? trim($_POST['marca']) : '';
$modelo = isset($_POST['modelo']) ? trim($_POST['modelo']) : '';
$precio = isset($_POST['precio']) ? $_POST['precio'] : '';
$detalles= isset($_POST['detalles']) ? trim($_POST['detalles']) : '';
$unidades= isset($_POST['unidades']) ? $_POST['unidades'] : '';
$imagen = isset($_POST['imagen']) ? trim($_POST['imagen']) : '';

// VALIDACIONES (a-g)

// a) nombre requerido y <=100
if ($nombre === '') {
    $response['errors']['nombre'] = 'El nombre es requerido.';
} elseif (mb_strlen($nombre) > 100) {
    $response['errors']['nombre'] = 'El nombre debe tener 100 caracteres o menos.';
}

// b) marca requerida y debe estar en lista permitida
$allowed_brands = ['MarcaA','MarcaB','MarcaC','MarcaD'];
if ($marca === '') {
    $response['errors']['marca'] = 'La marca es requerida.';
} elseif (!in_array($marca, $allowed_brands, true)) {
    $response['errors']['marca'] = 'Marca inválida.';
}

// c) modelo requerido, alfanumérico, <=25
if ($modelo === '') {
    $response['errors']['modelo'] = 'El modelo es requerido.';
} elseif (mb_strlen($modelo) > 25) {
    $response['errors']['modelo'] = 'El modelo debe tener 25 caracteres o menos.';
} elseif (!preg_match('/^[A-Za-z0-9 _-]+$/u', $modelo)) {
    $response['errors']['modelo'] = 'El modelo debe ser alfanumérico (espacio, - y _ permitidos).';
}

// d) precio requerido y > 99.99
if ($precio === '' || !is_numeric($precio)) {
    $response['errors']['precio'] = 'El precio es requerido y debe ser numérico.';
} else {
    $precio_val = floatval($precio);
    if (!($precio_val > 99.99)) {
        $response['errors']['precio'] = 'El precio debe ser mayor a 99.99.';
    }
}

// e) detalles opcional <=250
if ($detalles !== '' && mb_strlen($detalles) > 250) {
    $response['errors']['detalles'] = 'Los detalles deben tener 250 caracteres o menos.';
}

// f) unidades requeridas y >=0 entero
if ($unidades === '' || !preg_match('/^\d+$/', strval($unidades))) {
    $response['errors']['unidades'] = 'Las unidades son requeridas y deben ser un número entero >= 0.';
} else {
    $unidades_val = intval($unidades, 10);
    if ($unidades_val < 0) {
        $response['errors']['unidades'] = 'Las unidades deben ser mayor o igual a 0.';
    }
}

// g) imagen opcional; si vacío usar default
if ($imagen === '') {
    $imagen_db = $DEFAULT_IMAGE;
} else {
    $imagen_db = $imagen;
}

// Si hay errores devolverlos
if (!empty($response['errors'])) {
    $response['success'] = false;
    $response['message'] = 'Errores de validación.';
    echo json_encode($response, JSON_PRETTY_PRINT);
    $conexion->close();
    exit;
}

// Escapar valores antes de insertar
$nombre_e = $conexion->real_escape_string($nombre);
$marca_e  = $conexion->real_escape_string($marca);
$modelo_e = $conexion->real_escape_string($modelo);
$precio_e = $conexion->real_escape_string(number_format($precio_val, 2, '.', ''));
$detalles_e= $conexion->real_escape_string($detalles);
$unidades_e= intval($unidades_val, 10);
$imagen_e = $conexion->real_escape_string($imagen_db);

// Verificar unicidad del nombre
$check_sql = "SELECT id FROM productos WHERE nombre = '{$nombre_e}' AND eliminado = 0";
$check_res = $conexion->query($check_sql);
if ($check_res && $check_res->num_rows > 0) {
    $response['success'] = false;
    $response['errors']['nombre'] = 'El nombre ya existe en la base de datos.';
    $response['message'] = 'Nombre duplicado.';
    if ($check_res) $check_res->free();
    $conexion->close();
    echo json_encode($response, JSON_PRETTY_PRINT);
    exit;
}
if ($check_res) $check_res->free();

// Insertar
$sql = "INSERT INTO productos (nombre, marca, modelo, precio, detalles, unidades, imagen, eliminado)
        VALUES ('{$nombre_e}', '{$marca_e}', '{$modelo_e}', {$precio_e}, '{$detalles_e}', {$unidades_e}, '{$imagen_e}', 0)";

if ($conexion->query($sql)) {
    $response['success'] = true;
    $response['message'] = 'Producto agregado correctamente.';
} else {
    $response['success'] = false;
    $response['message'] = 'Error al insertar el producto: ' . $conexion->error;
}

$conexion->close();
echo json_encode($response, JSON_PRETTY_PRINT);