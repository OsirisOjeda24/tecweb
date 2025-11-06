<?php
include_once __DIR__.'/database.php';

// SE CREA EL ARREGLO QUE SE VA A DEVOLVER EN FORMA DE JSON
$data = array(
    'exists' => false,
    'message' => ''
);

// SE VERIFICA HABER RECIBIDO EL NOMBRE
if(isset($_GET['nombre'])) {
    $nombre = $_GET['nombre'];
    
    // SE REALIZA LA QUERY DE BÚSQUEDA Y AL MISMO TIEMPO SE VALIDA SI HUBO RESULTADOS
    $sql = "SELECT * FROM productos WHERE nombre = '{$nombre}' AND eliminado = 0";
    $result = $conexion->query($sql);
    
    if ($result->num_rows > 0) {
        $data['exists'] = true;
        $data['message'] = 'Ya existe un producto con este nombre';
    } else {
        $data['message'] = 'Nombre disponible';
    }

    $result->free();
    // Cierra la conexion
    $conexion->close();
}

// SE HACE LA CONVERSIÓN DE ARRAY A JSON
echo json_encode($data, JSON_PRETTY_PRINT);
?>